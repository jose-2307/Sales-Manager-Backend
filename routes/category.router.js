const express = require("express");
const CategoryService = require("../services/category.service");
const validatorHanlder = require("../middlewares/validator.handler");
const { createCategorySchema, getCategorySchema } = require("../schemas/category.schema");

const router = express.Router();
const service = new CategoryService();

router.get("/",
  async (req, res, next) => {
    try {
      const categories = await service.find();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:id",
  validatorHanlder(getCategorySchema, "params"), //Controla el esquema de entrada
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await service.findOne(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);


router.post("/",
  validatorHanlder(createCategorySchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:id",
  validatorHanlder(getCategorySchema, "params"),
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


