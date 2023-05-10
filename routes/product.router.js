const express = require("express");
const ProductService = require("../services/product.service");
const validatorHanlder = require("../middlewares/validator.handler");
const {
  createProductSchema,
  getProductSchema,
  updateProductSchema,
  getProductsByCategorySchema,
  createPurchaseSchema,
  getAllPurchaseProductSchema,
  getPurchaseSchema
} = require("../schemas/product.schema");

const router = express.Router();
const service = new ProductService();

//------------Purchase

router.post("/purchase",
  validatorHanlder(createPurchaseSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newPurchase = await service.createPurchaseByUser(body);
      res.status(201).json(newPurchase);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/purchase-all/:productId",
  validatorHanlder(getAllPurchaseProductSchema, "params"),
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const purchases = await service.findAllByProduct(productId);
      res.json(purchases);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/purchase/:id",
  validatorHanlder(getPurchaseSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const purchase = await service.findOnePurchase(id);
      res.json(purchase);
    } catch (error) {
      next(error);
    }
  }
);

//----------------

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
      const body = req.body;
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
      const body = req.body;
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
      next(error);
    }
  }
);


module.exports = router;
