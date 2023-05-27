const express = require("express");

//routers específicos
// const roleRouter = require("./role.router");
const userRouter = require("./user.router");
const categoryRouter = require("./category.router");
const productRouter = require("./product.router");
const authRouter = require("./auth.router");
const profileRouter = require("./profile.router");

const routerApi = (app) => {
  const router = express.Router();
  app.use("/api/v1",router);
  // router.use("/roles",roleRouter);
  router.use("/users",userRouter);
  router.use("/categories",categoryRouter);
  router.use("/products",productRouter);
  router.use("/auth",authRouter);
  router.use("/profile",profileRouter);
}

module.exports = routerApi;
