const express = require("express");
const UserService = require("../services/user.service");
const validatorHanlder = require("../middlewares/validator.handler");
const { createUserSchema, getUserSchema, updateUserSchema } = require("../schemas/user.schema");

const router = express.Router();
const service = new UserService();

router.get("/",
  async (req, res, next) => {
    try {
      const users = await service.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:id",
  validatorHanlder(getUserSchema, "params"), //Controla el esquema de entrada
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

//Ruta para users
router.post("/",
  validatorHanlder(createUserSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/admin",
  validatorHanlder(createUserSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newAdmin = await service.create(body, true);
      res.status(201).json(newAdmin);
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/:id",
  validatorHanlder(getUserSchema, "params"),
  validatorHanlder(updateUserSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = await service.findOne(id);
      const body = req.body;
      const resp = await service.update(id, body);
      res.json(resp);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id",
  validatorHanlder(getUserSchema, "params"),
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


