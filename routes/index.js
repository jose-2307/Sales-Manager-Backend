const express = require("express");

//routers específicos
const roleRouter = require("./role.router");

const routerApi = (app) => {
  const router = express.Router();
  app.use("/api/v1",router);
  router.use("/roles",roleRouter);

}

module.exports = routerApi;
