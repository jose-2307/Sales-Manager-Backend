const { models } = require("../libs/sequelize");
const boom = require("@hapi/boom");

class ProductService {
  constructor(){}

  async create(data) {
    await this.findName(data.userId, data.name); //busca duplicidad en el nombre
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async findName(userId, name) {
    const product = await models.Product.findOne({
      where: {
        userId,
        name
      }
    });
    if (product) {
      throw boom.conflict("The product is already entered");
    }
    return true;
  }

  async find(userId,categoryId) {
    const products = await models.Product.findAll({
      where: {
        userId,
        categoryId
      }
    });
    return products;
  }

  async findOne(id) {
    const product = await models.Product.findByPk(id,{
      include: ["user", "category", "images"]
    });
    if (!product) {
      throw boom.notFound("product not found");
    }
    return product;
  }

  async update(id, changes) {
    const product = await this.findOne(id);
    const resp = await product.update(id,changes);
    return resp;
  }

  //Se utiliza cuando se hacen ventas o compras de un producto
  async updateWeight(id, weight, isPurchase) {
    if (isPurchase) {
      //se suma
    } else {
      //se resta
    }
  }

  async delete(id) {
    const product = await this.findOne(id);
    await product.destroy();
    return { id };
  }
}

module.exports = ProductService;
