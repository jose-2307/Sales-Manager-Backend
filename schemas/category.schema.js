/**
 * Objetivo: Definir las características de los datos que serán utilizados en las rutas
 */

const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30);
const image = Joi.string().uri();


const createCategorySchema = Joi.object({
  name: name.required(),
  image,
});


const updateCategorySchema = Joi.object({
  name,
  image,
});

const getCategorySchema = Joi.object({
  id: id.required(),
});

module.exports = { createCategorySchema, updateCategorySchema, getCategorySchema }
