const {Strategy} = require("passport-local");
const AuthService = require("../../../services/auth.service");
const service = new AuthService();

const LocalStrategy = new Strategy({ //Se define el cómo se va a loguear el usuario
    usernameField: "email",
    passwordField: "password"
  },
  async (email, password, done) => {
    try {
      const user = await service.login(email,password);
      done(null, user); //Se pudo loguear correctamente.
    } catch (error) {
      done(error, false);
    }
  }
);

module.exports = LocalStrategy;
