const boom = require("@hapi/boom");

const { models } = require("../libs/sequelize");

class RoleService {
  constructor(){}

  async create(data) {
    const newRole = await models.Role.create(data);
    return newRole;
  }
}

module.exports = RoleService;
