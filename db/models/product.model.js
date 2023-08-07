const { Model, DataTypes } = require("sequelize");
const { CATEGORY_TABLE } = require("./category.model");
const { USER_TABLE } = require("./user.model");

const PRODUCT_TABLE = "products";

const ProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },
  salePriceKilo: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
    field: "sale_price_kilo",
  },
  weight: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
    defaultValue: 0,
  },
  locked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    unique: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "category_id",
    references: {
      model: CATEGORY_TABLE,
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "user_id",
    references: {
      model: USER_TABLE,
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  }
}

class Product extends Model{
  static associate(models){
    this.belongsTo(models.User, {
      as: "user"
    });
    this.belongsTo(models.Category, {
      as: "category"
    });
    this.hasMany(models.Image, {
      as: "images",
      foreignKey: "productId"
    })
  }
  static config(sequelize){
    return {
      sequelize,
      tableName: PRODUCT_TABLE,
      modelName: "Product",
      timestamps: false
    }
  }
}

module.exports = { PRODUCT_TABLE, ProductSchema, Product }
