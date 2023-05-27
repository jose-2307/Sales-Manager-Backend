const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30);
const salePriceKilo = Joi.number().integer().positive();

//images
const urls = Joi.array().items(Joi.string().uri()).max(6);

//
const categoryId = Joi.number().integer();

//Purchase
const purchaseDate = Joi.date().greater("1-1-2022");
const weight = Joi.number().integer().positive();
const purchasePriceKilo = Joi.number().integer().positive();
const productId = Joi.number().integer();



const createProductSchema = Joi.object({
  name: name.required(),
  salePriceKilo: salePriceKilo.required(),
  urls,
  categoryId: categoryId.required(),
});


const updateProductSchema = Joi.object({
  salePriceKilo,
  urls
});


const getProductSchema = Joi.object({
  id: id.required(),
});


const getProductsByCategorySchema = Joi.object({
  categoryId: categoryId.required(),
});


const createPurchaseSchema = Joi.object({
  purchaseDate: purchaseDate.required(),
  weight: weight.required(),
  purchasePriceKilo: purchasePriceKilo.required(),
  productId: productId.required(),
});


const getAllPurchaseProductSchema = Joi.object({
  productId: productId.required(),
});


const getPurchaseSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  getProductsByCategorySchema,
  createPurchaseSchema,
  getAllPurchaseProductSchema,
  getPurchaseSchema
}

