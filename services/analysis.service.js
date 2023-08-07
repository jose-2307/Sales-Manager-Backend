const { models } = require("../libs/sequelize");
const boom = require("@hapi/boom");
const CustomerService = require("./customer.service");
const ProductService = require("./product.service");

const customerService = new CustomerService();
const productService = new ProductService();

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; //TODO sumar 1
const currentYear = currentDate.getFullYear();

class AnalysisService {

  async salesByProduct (userId) {
    const customers = await customerService.find(userId);
    const ordersId = [];
    const productsId = [];

    for (let c of customers) {
      for (let o of c.purchaseOrders) {
        const date = new Date(o.saleDate);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (month === currentMonth && year === currentYear) {
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
    const resp = [];

    for (let id of uniqueProductsId) {
      let count = 0;

      for (let x of productsId) {
        if (x == id) count ++;
      }
      const product = await productService.findOne(id, true);
      resp.push({name: product.name, count})
    }

    return resp;
  }


  async amountInvested (userId, monthEvaluate = currentMonth) {
    const purchases = await models.UserProductPurchase.findAll({
      where: {
        userId
      }
    });

    let amount = 0;

    purchases.forEach(x => {
      const date = new Date(x.purchaseDate);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      if (month === monthEvaluate && year === currentYear) {
        amount += (x.weight * x.purchasePriceKilo) / 1000;
      }
    });

    return amount;
  }

  async amountIncome (userId, monthEvaluate = currentMonth) {
    const customers = await customerService.find(userId);
    const ordersId = [];
    let amount = 0;

    for (let c of customers) {
      for (let o of c.purchaseOrders) {
        if (o.paidOut) {
          const paymentDate = new Date(o.paymentDate);
          const paymentMonth = paymentDate.getMonth() + 1;
          const paymentYear = paymentDate.getFullYear();

          if (paymentMonth === monthEvaluate && paymentYear === currentYear) { //Se realizó el pago completo
              ordersId.push(o.id);
          }
        } else if (o.subscriber > 0) {
          const subscriberDate = new Date(o.subscriberDate);
          const subscriberMonth = subscriberDate.getMonth() + 1;
          const subscriberYear = subscriberDate.getFullYear();
          if (subscriberMonth === monthEvaluate && subscriberYear === currentYear) {
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

  async annualBalance (userId) {
    const months = [
      { number: 1, name: "Enero" },
      { number: 2, name: "Febrero" },
      { number: 3, name: "Marzo" },
      { number: 4, name: "Abril" },
      { number: 5, name: "Mayo" },
      { number: 6, name: "Junio" },
      { number: 7, name: "Julio" },
      { number: 8, name: "Agosto" },
      { number: 9, name: "Septiembre" },
      { number: 10, name: "Octubre" },
      { number: 11, name: "Noviembre" },
      { number: 12, name: "Diciembre" }
    ];

    const annualBalance = [];
    for (let m of months) {
      const invested = await this.amountInvested(userId, m.number);
      const income = await this.amountIncome(userId, m.number);
      const balance = income - invested;
      annualBalance.push({ ...m, balance });
    }
    return annualBalance;
  }

}

module.exports = AnalysisService;
