const { models } = require("../libs/sequelize");
const CustomerService = require("./customer.service");
const ProductService = require("./product.service");

const customerService = new CustomerService();
const productService = new ProductService();

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; //TODO sumar 1
const currentYear = currentDate.getFullYear();

class AnalysisService {

  async salesByProduct (userId, monthEvaluate = currentMonth, yearEvaluate = currentYear) {
    const customers = await customerService.find(userId);
    const ordersId = [];
    const products = [];
    for (let c of customers) {
      for (let o of c.purchaseOrders) {
        const date = new Date(o.saleDate);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (month == monthEvaluate && year == yearEvaluate) {
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
        const product = products.find(p => p.id === op.productId);
        if (product) {
          product["weight"] += op.weight;
        } else {
          const p = await productService.findOne(op.productId, true);
          products.push({id: op.productId, name: p.name, weight: op.weight});
        }
      }
    }

    return products;
  }


  async amountInvested (userId, monthEvaluate = currentMonth, yearEvaluate = currentYear) {
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
      if (month == monthEvaluate && year == yearEvaluate) {
        amount += (x.weight * x.purchasePriceKilo) / 1000;
      }
    });

    return amount;
  }

  async amountIncome (userId, monthEvaluate = currentMonth, yearEvaluate = currentYear) {
    const customers = await customerService.find(userId);
    const ordersId = [];
    let amount = 0;

    for (let c of customers) {
      for (let o of c.purchaseOrders) {
        if (o.paidOut) {
          const paymentDate = new Date(o.paymentDate);
          const paymentMonth = paymentDate.getMonth() + 1;
          const paymentYear = paymentDate.getFullYear();

          if (paymentMonth == monthEvaluate && paymentYear == yearEvaluate) { //Se realizó el pago completo
              ordersId.push(o.id);
          }
        } else if (o.subscriber > 0) {
          const subscriberDate = new Date(o.subscriberDate);
          const subscriberMonth = subscriberDate.getMonth() + 1;
          const subscriberYear = subscriberDate.getFullYear();
          if (subscriberMonth == monthEvaluate && subscriberYear == yearEvaluate) {
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

  async annualBalance (userId, yearEvaluate = currentYear) {
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
      const invested = await this.amountInvested(userId, m.number, yearEvaluate);
      const income = await this.amountIncome(userId, m.number, yearEvaluate);
      const balance = income - invested;
      annualBalance.push({ ...m, balance });
    }
    return annualBalance;
  }

}

module.exports = AnalysisService;
