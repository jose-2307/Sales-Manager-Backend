const { Model, DataTypes } = require("sequelize");
const { PRODUCT_TABLE } = require("./product.model");
const { PURCHASE_ORDER_TABLE } = require("./purchaseOrder.model");

const PURCHASE_ORDER_PRODUCT_TABLE = "pruchase_orders_products";

const PurchaseOrderProductSchema = {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "product_id",
    primaryKey: true,
    references: {
      model: PRODUCT_TABLE,
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "purchase_order_id",
    primaryKey: true,
    references: {
      model: PURCHASE_ORDER_TABLE,
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  weight: {
    type: DataTypes.FLOAT,
    unique: false,
    allowNull: false,
  },
  priceKilo: {
    type: DataTypes.FLOAT,
    unique: false,
    allowNull: false,
    field: "price_kilo",
  },
}

class PurchaseOrderProduct extends Model {

  static config(sequelize) {
    return {
      sequelize,
      tableName: PURCHASE_ORDER_PRODUCT_TABLE,
      modelName: "PurchaseOrderProduct",
      timestamps: false
    }
  }
}

module.exports = { PurchaseOrderProduct, PurchaseOrderProductSchema, PURCHASE_ORDER_PRODUCT_TABLE }
