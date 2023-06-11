const { models } = require("../libs/sequelize");
const boom = require("@hapi/boom");
const ProductService = require("./product.service");

const productService = new ProductService();

class CategoryService {
  constructor(){}

  async create(data) {
    let { name } = data;
    name = name.toLowerCase();
    await this.findName(data.userId, name); //busca duplicidad en el nombre
    const newCustomer = await models.Customer.create({...data, name});
    return newCustomer;
  }

  async find() {
    const customers = await models.Customer.findAll();
    return customers;
  }

  async findOne(id) {
    const customer = await models.Customer.findByPk(id, {
      include: ["user", "purchaseOrders"]
    });
    if (!customer) {
      throw boom.notFound("customer not found");
    }
    return customer;
  }

  async findName(userId, name) {
    const customer = await models.Customer.findOne({
      where: {
        userId,
        name
      }
    });
    if (customer) {
      throw boom.conflict("The customer is already entered");
    }
    return true;
  }

  async update(id, changes) {
    const customer = await this.findOne(id);
    const resp = await customer.update(changes);
    return resp;
  }

  async delete(id) {
    const customer = await this.findOne(id);
    await customer.destroy();
    return { id };
  }

  async userValidate(userId, customerId) {
    const customer = await this.findOne(customerId);
    if (customer.user.id !== userId) {
      throw boom.unauthorized();
    }
  }

  //--------------Purchase_Orders

  async createPurchaseOrderByCustomer(data) {
    const newPurchase = await models.PurchaseOrder.create(data);
    return newPurchase;
  }

  async findAllPurchaseOrdersByCustomer(customerId) {
    const orders = await models.PurchaseOrder.findAll({
      where: {
        customerId
      },
      include: ["orderProducts"]
    });
    return orders;
  }

  async findOnePurchaseOrderByCustomer(id) {
    const order = await models.PurchaseOrder.findByPk(id, {
      include: ["orderProducts"],
    });
    if (!order) {
      throw boom.notFound("purchase order not found");
    }
    return order;
  }

  async updatePurchaseOrder(id, changes) {
    const purchase = await this.findOne(id);
    const resp = await purchase.update(changes);
    return resp;
  }


  //--------------Purchase_Orders_Products

  async createPurchaseOrderProduct(data) {
    const { productId } = data;
    const {salePriceKilo } = await productService.findOne(productId);
    const resp = await models.PurchaseOrderProduct.create({priceKilo: salePriceKilo, ...data});
    return resp;
  }

  // async findAllOrderProducts(purchaseOrderId) {
  //   const orderProducts = await models.PurchaseOrderProduct.findAll({
  //     where: {
  //       purchaseOrderId
  //     },
  //   });
  //   return orderProducts;
  // }

  // async findOneOrderProducts(purchaseOrderId) {
  //   const order = await models.PurchaseOrderProduct.findByPk(purchaseOrderId);
  //   if (!order) {
  //     throw boom.notFound("purchase order product not found");
  //   }
  //   return order;
  // }


}

module.exports = CategoryService;
