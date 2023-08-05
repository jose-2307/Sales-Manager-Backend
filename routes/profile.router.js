const express = require("express");
const passport = require("passport");

const UserService = require("./../services/user.service");
const ProductService = require("../services/product.service");
const CustomerService = require("../services/customer.service");
const AnalysisService = require("../services/analysis.service");

const validatorHandler = require("./../middlewares/validator.handler");
const { updateUserSchema } = require("./../schemas/user.schema");
const { createProductSchema, createPurchaseSchema, getProductsByCategorySchema, getProductSchema, updateProductSchema } = require("../schemas/product.schema");
const { createCustomerSchema, getCustomerSchema, updateCustomerSchema, createPurchaseOrder, getPurchaseOrderSchema, updatePurchaseOrder, createPurchaseOrderProduct, getSalesSchema, getMonthsSchema } = require("../schemas/customer.schema");

const router = express.Router();
const userService = new UserService();
const productService = new ProductService();
const customerService = new CustomerService();
const analysisService = new AnalysisService();


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
      if ("recoveryToken" in resp) delete resp.dataValues.recoveryToken;
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

router.patch("/product/:id", //! Añadir lo de las imagenes
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getProductSchema, "params"),
  validatorHandler(updateProductSchema, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const body = req.body;
      await productService.userValidate(user.sub, id);
      const resp = await productService.update(id, body);
      res.json(resp);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/product/:id",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getProductSchema, "params"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { id } = req.params;
      await productService.userValidate(user.sub, id);
      const resp = await productService.delete(id);
      res.json({resp});
    } catch (error) {
      next(error);
    }
  }
);

//-----Customer

router.post("/customer",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(createCustomerSchema, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const body = req.body;
      body.userId = user.sub;
      const newCustomer = await customerService.create(body);
      res.status(201).json(newCustomer);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/customer",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const customers = await customerService.find(user.sub);
      res.json(customers);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/customer/:id",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getCustomerSchema, "params"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { id } = req.params;
      await customerService.userValidate(user.sub, id);
      const customer = await customerService.findOne(id);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/customer/:id",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getCustomerSchema, "params"),
  validatorHandler(updateCustomerSchema, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const body = req.body;
      const resp = await customerService.update(user.sub, id, body);
      res.json(resp);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/customer/:id",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getCustomerSchema, "params"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { id } = req.params;
      await customerService.userValidate(user.sub, id);
      const resp = await customerService.delete(id);
      res.json({resp});
    } catch (error) {
      next(error);
    }
  }
);

router.post("/customer/:id/purchase-order",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getCustomerSchema, "params"),
  validatorHandler(createPurchaseOrder, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const body = req.body;
      body.customerId = id;
      await customerService.userValidate(user.sub, id);
      const newPurchaseOrder = await customerService.createPurchaseOrderByCustomer(body);
      res.status(201).json(newPurchaseOrder);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/customer/:id/purchase-order",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getCustomerSchema, "params"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { id } = req.params;
      await customerService.userValidate(user.sub, id);
      const purchaseOrders = await customerService.findAllPurchaseOrdersByCustomer(id);
      res.json(purchaseOrders);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/customer/:id/purchase-order/:orderId",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getPurchaseOrderSchema, "params"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { id, orderId } = req.params;
      await customerService.userValidate(user.sub, id);
      const purchaseOrder = await customerService.findOnePurchaseOrderByCustomer(id, orderId);
      res.json(purchaseOrder);
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/customer/:id/purchase-order/:orderId",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getPurchaseOrderSchema, "params"),
  validatorHandler(updatePurchaseOrder, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { id, orderId } = req.params;
      const body = req.body;
      await customerService.userValidate(user.sub, id);
      const resp = await customerService.updatePurchaseOrder(id, orderId , body);
      res.json(resp);
    } catch (error) {
      next(error);
    }
  }
);

// PurchaseOrderProduct

router.post("/customer/:id/purchase-order/:orderId/product",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getPurchaseOrderSchema, "params"),
  validatorHandler(createPurchaseOrderProduct, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { id, orderId } = req.params;
      const body = req.body;
      body.purchaseOrderId = orderId;
      await customerService.userValidate(user.sub, id); //Verifica que el customer sea del usuario
      await customerService.findOnePurchaseOrderByCustomer(id, orderId); //Verifica que la orden de compra sea del customer
      await productService.userValidate(user.sub, body.productId); //Verifica que el producto pertenece al usuario
      const newPurchaseOrder = await customerService.createPurchaseOrderProduct(body);
      res.status(201).json(newPurchaseOrder);
    } catch (error) {
      next(error);
    }
  }
);


router.get("/debtors",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const data = await customerService.getDebtors(user.sub);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/sales",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getSalesSchema, "query"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { year, month } = req.query;
      const data = await customerService.getSales(user.sub, year, month);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/sales/years",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const data = await customerService.getSalesYears(user.sub);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/sales/months/:year",
  passport.authenticate("jwt", {session: false}),
  validatorHandler(getMonthsSchema, "params"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const { year } = req.params;
      const data = await customerService.getSalesMonths(user.sub, year);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

//Analysis

router.get("/analysis/sales-product",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const data = await analysisService.salesByProduct(user.sub);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/analysis/investment",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const data = await analysisService.amountInvested(user.sub);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/analysis/income",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const data = await analysisService.amountIncome(user.sub);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/analysis/annual-balance",
  passport.authenticate("jwt", {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const data = await analysisService.annualBalance(user.sub);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);




module.exports = router;
