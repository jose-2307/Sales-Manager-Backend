const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30);
const phone = Joi.string().length(12);
const location = Joi.string().min(3).max(30);
const email = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "cl"] } });

//Purchase order
const saleDate = Joi.date().greater("1-1-2022");
const paymentDate = Joi.date().greater("1-1-2022");
const subscriber = Joi.number().integer().positive();
const paidOut = Joi.boolean();
const orderId = Joi.number().integer();

//Purchase order product
const weight = Joi.number().integer().positive();
const productId = Joi.number().integer();

//Sales
const year = Joi.number().integer().positive();
const month = Joi.number().integer().min(1).max(12);

const createCustomerSchema = Joi.object({
  name: name.required(),
  phone: phone.required(),
  location,
  email,
});


const updateCustomerSchema = Joi.object({
  name,
  phone,
  location,
  email,
});


const getCustomerSchema = Joi.object({
  id: id.required(),
});

const createPurchaseOrder = Joi.object({
  saleDate: saleDate.required(),
  paymentDate,
  subscriber,
  paidOut,
});

const getPurchaseOrderSchema = Joi.object({
  id: id.required(),
  orderId: orderId.required(),
});

const updatePurchaseOrder = Joi.object({
  paymentDate,
  subscriber,
  paidOut,
});

const createPurchaseOrderProduct = Joi.object({
  productId: productId.required(),
  weight: weight.required(),
});

const getSalesSchema = Joi.object({
  year: year,
  month: month,
});

const getMonthsSchema = Joi.object({
  year: year.required(),
});

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
  getCustomerSchema,
  createPurchaseOrder,
  getPurchaseOrderSchema,
  updatePurchaseOrder,
  createPurchaseOrderProduct,
  getSalesSchema,
  getMonthsSchema,
}

