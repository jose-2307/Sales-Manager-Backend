const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30).lowercase();
const salePriceKilo = Joi.number().min(1);



const createProductSchema = Joi.object({
  name: name.required(),
  salePriceKilo: salePriceKilo.required(),
});


const updateProductSchema = Joi.object({
  salePriceKilo: salePriceKilo.required(),
});

const getProductSchema = Joi.object({
  id: id.required(),
});

module.exports = { createProductSchema, updateProductSchema, getProductSchema }

