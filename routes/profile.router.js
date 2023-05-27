const express = require("express");
const passport = require("passport");

const UserService = require("./../services/user.service");
const ProductService = require("../services/product.service");
const validatorHandler = require("./../middlewares/validator.handler");
const { updateUserSchema } = require("./../schemas/user.schema");
const { createProductSchema, createPurchaseSchema, getProductsByCategorySchema } = require("../schemas/product.schema");

const router = express.Router();
const userService = new UserService();
const productService = new ProductService();


router.get("/personal-information",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const resp = await userService.findOne(user.sub);
      delete resp.dataValues.recoveryToken;
      res.json(resp);
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/personal-information",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(updateUserSchema, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;
      const resp = await userService.update(user.sub,body);
      delete resp.dataValues.recoveryToken;
      res.json(resp);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/product",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(createProductSchema, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;
      body.userId = user.sub;
      const newProduct = await productService.create(body);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/my-products/:categoryId",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getProductsByCategorySchema, "params"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { categoryId } = req.params;
      const myProducts = await productService.find(user.sub,categoryId);
      res.json(myProducts);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/product-purchase",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(createPurchaseSchema, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;
      body.userId = user.sub;
      const newPurchase = await productService.createPurchaseByUser(body);
      res.status(201).json(newPurchase);
    } catch (error) {
      next(error);
    }
  }
);



module.exports = router;
