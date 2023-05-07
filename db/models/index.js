const { Role, RoleSchema } = require("./role.model");
const { User, UserSchema } = require("./user.model");
const { Auth, AuthSchema } = require("./auth.model");
const { Category, CategorySchema } = require("./category.model");
const { Product, ProductSchema } = require("./product.model");
const { UserProductPurchase, UserProductPurchaseSchema } = require("./userProductPurchase.model");
const { Image, ImageSchema } = require("./image.model");
const { Customer, CustomerSchema } = require("./customer.model");
const { PurchaseOrder, PurchaseOrderSchema } = require("./purchaseOrder.model");
const { PurchaseOrderProduct, PurchaseOrderProductSchema } = require("./purchaseOrderProduct.model");
const { Defaulter, DefaulterSchema } = require("./defaulter.model");


/**
 * Función: setupModels
 * Objetivo: inicializar los modelos con sus relaciones para su posterior uso
 * Input: sequelize
 */

const setupModels = (sequelize) => {
  Role.init(RoleSchema, Role.config(sequelize));
  User.init(UserSchema, User.config(sequelize));
  Auth.init(AuthSchema, Auth.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  UserProductPurchase.init(UserProductPurchaseSchema, UserProductPurchase.config(sequelize));
  Image.init(ImageSchema, Image.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  PurchaseOrder.init(PurchaseOrderSchema, PurchaseOrder.config(sequelize));
  PurchaseOrderProduct.init(PurchaseOrderProductSchema, PurchaseOrderProduct.config(sequelize));
  Defaulter.init(DefaulterSchema, Defaulter.config(sequelize));


  //Relaciones

  Role.associate(sequelize.models);
  User.associate(sequelize.models);
  Auth.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  Image.associate(sequelize.models);
  Customer.associate(sequelize.models);
  PurchaseOrder.associate(sequelize.models);


}

module.exports = setupModels;


