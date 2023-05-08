const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30).lowercase();
const salePriceKilo = Joi.number().min(1);

//images
const urls = Joi.array().items(Joi.string().uri()).length(6);

//
const userId = Joi.number().integer();
const categoryId = Joi.number().integer();



const createProductSchema = Joi.object({
  name: name.required(),
  salePriceKilo: salePriceKilo.required(),
  urls,
});


const updateProductSchema = Joi.object({
  salePriceKilo,
  urls
});


const getProductSchema = Joi.object({
  id: id.required(),
});


const getProductsByCategorySchema = Joi.object({
  userId: userId.required(),
  categoryId: categoryId.required(),
});

const createPurchase = Joi.object({})

module.exports = { createProductSchema, updateProductSchema, getProductSchema, getProductsByCategorySchema }

