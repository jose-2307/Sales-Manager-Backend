const boom = require("@hapi/boom");
const UserService = require("./user.service");
const MailService = require("./mail.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");

const userService = new UserService();
const mailService = new MailService();

class AuthService {

  async login(email, password) {
    const user = await userService.findByEmail(email);

    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password,user.password); //Se verifica que la contraseña coinsida
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.password;
    delete user.dataValues.recoveryToken;
    return user;
  }

  async signToken(user) {
    const payload = {
      sub: user.dataValues.id,
      role: user.role.name,
    };
    const accessToken = jwt.sign(payload, config.jwtSecretLogin, {
      expiresIn: "5min",
    });
    const refreshToken = jwt.sign(payload, config.jwtSecretRefresh, {
      expiresIn: "90min",
    });

    await userService.update(user.dataValues.id, { refreshToken });
    return { user: user.dataValues, accessToken, refreshToken };
  }

  async signRefreshToken(refreshToken) {
    try {
      //verificar el refreshToken
      const payloadRefresh = jwt.verify(refreshToken, config.jwtSecretRefresh);

      //verficar que sea el mismo que presenta el usuario
      const user = await userService.findOne(payloadRefresh.sub);
      if (user.refreshToken !== refreshToken) {
        throw boom.unauthorized();
      }
      //crear el accessToken
      const accessToken = jwt.sign({ sub: payloadRefresh.sub, role: payloadRefresh.role }, config.jwtSecretLogin, { expiresIn: "5min" });

      return { accessToken, user };

    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async logout(refreshToken) {
    try {
      const payloadRefresh = jwt.verify(refreshToken, config.jwtSecretRefresh);
      const user = await userService.findOne(payloadRefresh.sub);
      if (user.refreshToken !== refreshToken) {
        throw boom.unauthorized();
      }
      await userService.update(payloadRefresh.sub, { refreshToken: null });
      return { message: "Log out" };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendRecovery(email) {
    try {
      //Buscar el email
      const user = await userService.findByEmail(email);

      //Generar token para acceder a cambiar la contraseña
      const payload = { sub: user.dataValues.id, role: user.role.name };
      const token = jwt.sign(payload, config.jwtSecretRecovery, { expiresIn: "15min" });

      //Generar la url para que el usuario pueda realizar el cambio
      const uri = `http://${config.recoveryUri}/change-password?token=${token}`;

      //Almacenar token en el usuario
      await userService.update(user.dataValues.id, { recoveryToken: token });

      //Envíar el mail
      const mail = {
        from: config.email,
        to: `${user.dataValues.email}`,
        subject: "Restablecer contraseña",
        html: `<head>
        <style>
          a:hover {
            opacity: 0.7;
          }

        </style>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;">
        <div">
          <p>Hola, ${user.dataValues.name}:</p>
          <br>
          <p>Hemos recibido una solicitud para cambiar tu contraseña. Por favor, accede al siguiente enlace, el cual estará disponible durante 15 minutos, para <b>restablecer tu contraseña:</b></p>
          <br>
          <div style="padding-left: 30%;">
              <a style="padding: 14px;
              background-color: rgb(252, 211, 79);
              border-radius: 6px;
              text-decoration: none;
              box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.2);
              color: black" target="_blank" href=${uri}>Recuperar contraseña</a>
          </div>
          <br>
          <p>Si no has solicitado este link, puede que alguien esté intentando acceder a tu cuenta. <b>No reenvíes este mail ni des el link a nadie.<b/></p>
          <br>
          <br>
          <p>Atentamente,</p>
          <p>El equipo de Sales Manager</p>
        </div>
      </body>`,
      };

      return (await mailService.sendMail(mail));
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async changePassword(token, newPassword) {
    try {
      //verificar el token
      const payload = jwt.verify(token, config.jwtSecretRecovery);

      //verificar el token con el usuario
      const user = await userService.findOne(payload.sub);

      if (token !== user.recoveryToken) {
        throw boom.unauthorized();
      }

      //cambiar contraseña
      const hash = await bcrypt.hash(newPassword, 10);
      await userService.update(user.id, { password: hash, recoveryToken: null });
      return { message: "Password changed" };

    } catch (error) {
      throw boom.unauthorized();
    }
  }

}

module.exports = AuthService;

