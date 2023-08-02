const { models } = require("../libs/sequelize");
const boom = require("@hapi/boom");
const CustomerService = require("./customer.service");
const ProductService = require("./product.service");

const customerService = new CustomerService();
const productService = new ProductService();

const currentDate = new Date();
const currentMonth = currentDate.getMonth(); //TODO sumar 1


class AnalysisService {

  async salesByProduct (userId) {

    const customers = await customerService.find(userId);
    const ordersId = [];
    const productsId = [];

    for (let c of customers) {
      for (let o of c.purchaseOrders) {
        const date = new Date(o.saleDate);
        const month = date.getMonth() + 1;
        if (month == currentMonth) {
          ordersId.push(o.id);
        }
      }
    }

    for (let o of ordersId) {
      const orderProducts = await models.PurchaseOrderProduct.findAll({
        where: {
          purchaseOrderId: o,
        }
      });
      for (let op of orderProducts) {
        productsId.push(op.productId);
      }
    }

    const uniqueProductsId = productsId.filter((value, index, arr) => arr.indexOf(value) === index);
    const resp = []

    for (let id of uniqueProductsId) {
      let count = 0;

      for (let x of productsId) {
        if (x == id) count ++;
      }
      const product = await productService.findOne(id);
      resp.push({name: product.name, count})
    }

    return resp;
  }


  async amountInvested (userId) {
    const purchases = await models.UserProductPurchase.findAll({
      where: {
        userId
      }
    });

    let amount = 0;

    purchases.forEach(x => {
      const date = new Date(x.purchaseDate);
      const month = date.getMonth() + 1;
      if (month === currentMonth) {
        amount += (x.weight * x.purchasePriceKilo) / 1000;
      }
    });

    return amount;
  }

  async amountIncome (userId) {
    const customers = await customerService.find(userId);
    const ordersId = [];
    let amount = 0;

    for (let c of customers) {
      for (let o of c.purchaseOrders) {
        const date = new Date(o.saleDate);
        const month = date.getMonth() + 1;
        if (month == currentMonth) {
          if (o.paidOut) {
            ordersId.push(o.id);
          } else if (o.subscriber > 0) {
            amount += o.subscriber;
          }
        }
      }
    }
    for (let o of ordersId) {
      const orderProducts = await models.PurchaseOrderProduct.findAll({
        where: {
          purchaseOrderId: o,
        }
      });
      for (let op of orderProducts) {
        amount += (op.weight * op.priceKilo) / 1000;
      }
    }
    return amount;
  }

}

module.exports = AnalysisService;
