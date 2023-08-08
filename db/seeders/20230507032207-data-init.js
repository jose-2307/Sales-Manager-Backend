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
        image: "http://res.cloudinary.com/dmevmh3ch/image/upload/v1684368389/movcwilezy12af6kdf15.jpg",
      },
      {
        name: "Azúcares y dulces",
        image: "http://res.cloudinary.com/dmevmh3ch/image/upload/v1684372670/rjuhvegxeqgtvap0wp3g.jpg",
      },
      {
        name: "Lácteos",
        image: "http://res.cloudinary.com/dmevmh3ch/image/upload/v1684372702/txpm6qyfmertkntgrrqw.jpg",
      },
      {
        name: "Frutas y verduras",
        image: "http://res.cloudinary.com/dmevmh3ch/image/upload/v1684372726/v3doi9mus7s8c6ad6mes.jpg",
      },
      {
        name: "Otros productos",
        image: "http://res.cloudinary.com/dmevmh3ch/image/upload/v1691455475/bzrkvaiu87jhdstikmok.png",
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(ROLE_TABLE, {name: {[Op.in]: ["Admin","User"]}}, {}); //con ,null, elimina todo
    await queryInterface.bulkDelete(CATEGORY_TABLE, null, {});
  }
};
