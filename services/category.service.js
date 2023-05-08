const { models } = require("../libs/sequelize");
const boom = require("@hapi/boom");

class CategoryService {
  constructor(){}

  async create(data) {
    const newCategory = await models.Category.create(data);
    return newCategory;
  }

  async find() {
    const categories = await models.Category.findAll();
    return categories;
  }

  async findOne(categoryId, userId) {
    //se debe obtener la caregoría junto a los productos del user
    const category = await models.Category.findByPk(categoryId);
    if (!category) {
      throw boom.notFound("category not found");
    }
    return category;
  }

  async delete(id) {
    const category = await this.findOne(id);
    await category.destroy();
    return { id };
  }


}

module.exports = CategoryService;
