const { models } = require("../libs/sequelize");
const boom = require("@hapi/boom");
const ProductService = require("./product.service");

const productService = new ProductService();

class CategoryService {
  constructor(){}

  async create(data) {
    let { name } = data;
    name = name.toLowerCase();
    await this.findAttribute(data.userId, "name", name); //busca duplicidad en el nombre
    const newCustomer = await models.Customer.create({...data, name});
    return newCustomer;
  }

  async find(userId) {
    const customers = await models.Customer.findAll({
      where: {
        userId
      },
      include: ["purchaseOrders"]
    });
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

  async findAttribute(userId, attribute, data) {
    const customer = await models.Customer.findOne({
      where: {
        userId,
        [attribute]: data,
      },
    });
    if (customer) {
      throw boom.conflict(`The customer with this ${attribute} is already entered`);
    }
    return true;
  }

  async update(userId, id, changes) {
    const { name, phone, email } = changes;

    if (name) {
      await this.findAttribute(userId, "name", name);
    }
    if (phone) {
      await this.findAttribute(userId, "phone", phone);
    }
    if (email) {
      await this.findAttribute(userId, "email", email);
    }

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
    //Controlar que la fecha de venta sea menor o igual que la fecha de pago
    let { saleDate, paymentDate } = data;
    if (paymentDate) {
      saleDate = new Date(saleDate);
      paymentDate = new Date(paymentDate);
      if (saleDate > paymentDate) throw boom.badRequest("The payment date can't be greater than sale date.");
    }
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

  async findOnePurchaseOrderByCustomer(customerId, orderId) {
    const order = await models.PurchaseOrder.findAll({
      where: {
        id: orderId,
        customerId,
      },
      include: ["orderProducts"],
    });
    if (!order) {
      throw boom.notFound("purchase order not found");
    }
    return order;
  }

  async updatePurchaseOrder(customerId, orderId, changes) {
    const purchase = await this.findOnePurchaseOrderByCustomer(customerId,orderId);
    const resp = await purchase[0].update(changes);
    return resp;
  }


  //--------------Purchase_Orders_Products

  async createPurchaseOrderProduct(data) {
    const { productId, weight } = data;
    const product = await productService.findOne(productId);
    if (weight > product.weight) {
      throw boom.conflict("The weight entered is greater than the actual weight of product");
    }
    const resp = await models.PurchaseOrderProduct.create({priceKilo: product.salePriceKilo, ...data});
    await productService.updateWeight(productId, weight, false);
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

  //----------------Tabla de deudores

  async getRebtors(userId) {
    const customers = await this.find(userId);
    let resp = [];

    for (let c of customers) {
      let purchaseOrders = [];
      let debt = 0;

      for (let po of c.purchaseOrders) {
        if (!po.paidOut) {
          const purchaseOrderProducts = await models.PurchaseOrderProduct.findAll({
            where: {
              purchaseOrderId: po.id,
            },
          });
          purchaseOrderProducts.forEach(p => {
            debt += (p.weight * p.priceKilo) / 1000;
          });
          purchaseOrders.push({
            ...po.dataValues,
            purchaseOrderProducts
          });
        }
      }
      if (purchaseOrders.length !== 0) {
        resp.push({
          id: c.id,
          name: c.name,
          phone: c.phone,
          location: c.location,
          email: c.email,
          debt,
          purchaseOrders
        });
      }
    }
    return resp;
  }

  async getSales(userId) {
    const customers = await this.find(userId);
    let resp = [];

    for (let c of customers) {
      let purchaseOrders = [];
      for (let po of c.purchaseOrders) {
        const purchaseOrderProducts = await models.PurchaseOrderProduct.findAll({
          where: {
            purchaseOrderId: po.id,
          },
        });
        purchaseOrders.push({
          ...po.dataValues,
          purchaseOrderProducts
        });
      }
      if (purchaseOrders.length !== 0) {
        resp.push({
          id: c.id,
          name: c.name,
          phone: c.phone,
          location: c.location,
          email: c.email,
          purchaseOrders
        });
      }
    }
    return resp;
  }


}

module.exports = CategoryService;
