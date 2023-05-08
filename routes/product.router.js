const express = require("express");
const ProductService = require("../services/product.service");
const validatorHanlder = require("../middlewares/validator.handler");
const { createProductSchema, getProductSchema, updateProductSchema, getProductsByCategorySchema } = require("../schemas/product.schema");

const router = express.Router();
const service = new ProductService();


router.get("/:userId/:categoryId",
  validatorHanlder(getProductsByCategorySchema,"params"),
  async (req, res, next) => {
    try {
      const { userId, categoryId } = req.params;
      const products = await service.find(userId, categoryId);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:id",
  validatorHanlder(getProductSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/",
  validatorHanlder(createProductSchema, "body"),
  async (req, res, next) => {
    try {
      const { body } = req.body;
      const newProduct = await service.create(body);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/:id", //! Añadir lo de las imagenes
  validatorHanlder(getProductSchema, "params"),
  validatorHanlder(updateProductSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { body } = req.body;
      const resp = await service.update(id, body);
      res.json(resp);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id",
  validatorHanlder(getProductSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const resp = await service.delete(id);
      res.json({resp});
    } catch (error) {
      throw next(error);
    }
  }
);

//------------Purchase

router.post("/purchase",
  validatorHanlder()
);
