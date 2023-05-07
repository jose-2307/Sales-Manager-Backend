'use strict';

const { ROLE_TABLE } = require("../models/role.model");
const { CATEGORY_TABLE } = require("../models/category.model");


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert(ROLE_TABLE, [
      {
        name: "Admin",
      },
      {
        name: "User",
      },
    ], {});
    await queryInterface.bulkInsert(CATEGORY_TABLE, [
      {
        name: "Frutos secos",
      },
      {
        name: "Azúcares y dulces",
      },
      {
        name: "Lácteos",
      },
      {
        name: "Frutas y verduras",
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(ROLE_TABLE, {name: {[Op.in]: ["Admin","User"]}}, {}); //con ,null, elimina todo
    await queryInterface.bulkDelete(CATEGORY_TABLE, null, {});
  }
};
