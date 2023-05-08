const { models } = require("../libs/sequelize");
const boom = require("@hapi/boom");

class ProductService {
  constructor(){}

  async create(data) {
    await this.findName(data.userId, data.name); //busca duplicidad en el nombre
    const newProduct = await models.Product.create(data);
    const { id } = newProduct;
    const { urls } = data;
    if (urls) {
      const images = urls.map(url => {
        return {
          url,
          productId: id,
        }
      });
      console.log(images);
      // const newImages = await this.createImages();
    }
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
    //! Añadir lo de las imagenes

    const resp = await product.update(id,changes);
    return resp;
  }

  //Se utiliza cuando se hacen ventas o compras de un producto
  async updateWeight(id, newWeight, isPurchase) {
    const product = await this.findOne(id);
    let { weight } = product;
    if (isPurchase) {
      //se suma
      weight += newWeight;
    } else {
      //se resta
      weight -= newWeight;
    }
    const resp = await this.update(id, { weight });
    return resp;
  }

  //---------------UserProductsPurchase

  async createPurchaseByUser(data) {
    const newPurchase = await models.UserProductPurchase.create(data);
    const resp = await this.updateWeight(newPurchase.productId,newPurchase.weight,true);
    return {newPurchase, resp};
  }

  async findAllByProduct(productId) {
    const purchases = await models.UserProductPurchase.findAll({
      where: {
        productId
      }
    });
    return purchases;
  }

  async findOnePurchase(id) {
    const purchase = await models.UserProductPurchase.findByPk(id);
    if(!purchase) {
      throw boom.notFound("Purchase not found");
    }
    return purchase;
  }

  //---------------Images

  async createImages(data) {
    const newImages = await models.Image.bulkCreate(data);
    return newImages
  }

  // async deleteImages(ids) {
  //   let exist = false;
  //   for (let i; i < ids.length; i++) {

  //   }
  // }

  //---------------------

  async delete(id) {
    const product = await this.findOne(id);
    await product.destroy();
    return { id };
  }
}

module.exports = ProductService;
