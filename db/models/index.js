const { Role, RoleSchema } = require("./role.model");
const { User, UserSchema } = require("./user.model");
const { Auth, AuthSchema } = require("./auth.model");

/**
 * Función: setupModels
 * Objetivo: inicializar los modelos con sus relaciones para su posterior uso
 * Input: sequelize
 */

const setupModels = (sequelize) => {
  Role.init(RoleSchema, Role.config(sequelize));
  User.init(UserSchema, User.config(sequelize));
  Auth.init(AuthSchema, Auth.config(sequelize));

  //Relaciones

  Role.associate(sequelize.models);
  User.associate(sequelize.models);
  Auth.associate(sequelize.models);
}

module.exports = setupModels;


