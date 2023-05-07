const { Model, DataTypes } = require("sequelize");
const { USER_TABLE } = require("./user.model");
const { PRODUCT_TABLE } = require("./product.model");

const USER_PRODUCT_PURCHASE_TABLE = "users_products_purchase";

const UserProductPurchaseSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: "purchase_date",
    unique: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    unique: false,
  },
  purchasePriceKilo: {
    type: DataTypes.FLOAT,
    field: "purchase_price_kilo",
    allowNull: false,
    unique: false,
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
    onDelete: "CASCADE",
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "product_id",
    references: {
      model: PRODUCT_TABLE,
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
}

class UserProductPurchase extends Model {

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_PRODUCT_PURCHASE_TABLE,
      modelName: "UserProductPurchase",
      timestamps: false
    }
  }
}

module.exports = { UserProductPurchase, UserProductPurchaseSchema, USER_PRODUCT_PURCHASE_TABLE }
