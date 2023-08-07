const { models } = require("../libs/sequelize");
const boom = require("@hapi/boom");

class ProductService {

  async create(data) {
    let { name } = data;
    name = name.toLowerCase();
    await this.findName(data.userId, name); //busca duplicidad en el nombre
    const newProduct = await models.Product.create({...data, name});
    const { id } = newProduct;
    const { urls } = data;
    if (urls) {
      const images = urls.map(url => {
        return {
          url,
          productId: id,
        }
      });
      await this.createImages(images);
    }
    return newProduct;
  }

  async findName(userId, name) {
    const product = await models.Product.findOne({
      where: {
        userId,
        name,
        locked: false,
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
        categoryId,
        locked: false,
      },
      include: ["images"]
    });
    return products;
  }

  async findOne(id, considerLocked = false) { //considerLocked es utilizado para controlar si se considera o no el producto estando bloqueado
    let product;
    if (considerLocked) {
      product = await models.Product.findByPk(id,{
        include: ["user", "category", "images"],
      });
    } else {
      product = await models.Product.findByPk(id,{
        include: ["user", "category", "images"],
        where: {
          locked: false,
        }
      });
    }

    if (!product) {
      throw boom.notFound("product not found");
    }
    return product;
  }

  async userValidate(userId, productId) {
    const product = await this.findOne(productId);
    if (product.user.id !== userId) {
      throw boom.unauthorized();
    }
  }

  async update(id, changes) {
    const product = await this.findOne(id);
    if ("urls" in changes) {
      const images = changes["urls"].map(url => {
        return {
          url,
          productId: id,
        }
      });
      const image = await models.Image.findOne({
        where: {
          productId: id
        }
      });
      if (image) await image.destroy();
      await this.createImages(images);
    }
    const resp = await product.update(changes);
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


  //---------------------

  async delete(id) {
    //Corroborar que no se hayan realizado ventas ni compras del producto
    const purchase = await this.findAllByProduct(id); // []
    const sales = await models.PurchaseOrderProduct.findAll({
      where: {
        productId: id
      }
    });

    if (purchase.length === 0 && sales.length === 0) {
      const product = await this.findOne(id);
      await product.destroy();
    } else { //Existe algún movimiento en el que está involucrado el producto
      await this.update(id, {locked: true});
    }
    return { id };
  }
}

module.exports = ProductService;
