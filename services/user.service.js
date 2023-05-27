const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const { models } = require("../libs/sequelize");

class UserService {
  constructor(){}

  async create(data, isAdmin = false) {
    const hash = await bcrypt.hash(data.password, 10);
    delete data.password;
    let role;
    if(isAdmin) {
      role = await models.Role.findOne({
        where: {
          name: "Admin"
        }
      });
    } else {
      role = await models.Role.findOne({
        where: {
          name: "User"
        }
      });
    }

    const newUser = await models.User.create({...data, roleId: role.id});
    await models.Auth.create({userId: newUser.id, password: hash});
    delete newUser.dataValues.refreshToken;
    delete newUser.dataValues.recoveryToken;
    return newUser;
  }

  async find() {
    const users = await models.User.findAll();
    return users;
  }

  async findByEmail(email) {
    const user = await models.User.findOne({
      where: {
        email
      },
     include: ["role"]});
    if (!user) {
      throw boom.notFound("user not found");
    }

    const auth = await models.Auth.findByPk(user.id);
    return {...user, password: auth.password};
  }

  async findOne(id) {
    const user = await models.User.findByPk(id, {
      include: ["role","items","products","customers"]
    });
    if (!user) {
      throw boom.notFound("user not found");
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);

    if (changes.password) { //La contraseña se actualiza individualmente
      const auth = await models.Auth.findByPk(user.id);
      await auth.update({ password: changes.password });
      if ("recoveryToken" in changes) {
        await user.update({ recoveryToken: changes.recoveryToken });
        return { message: "password and recoveryToken changed" };
      }
      return { message: "password changed" };
    }

    const resp = await user.update(changes);
    return resp;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UserService;
