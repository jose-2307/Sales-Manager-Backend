const { Model, DataTypes } = require("sequelize");
const { CUSTOMER_TABLE } = require("./customer.model");

const PURCHASE_ORDER_TABLE = "purchase_orders";

const PurchaseOrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  saleDate: {
    allowNull: false,
    unique: false,
    type: DataTypes.DATEONLY,
    field: "sale_date",
  },
  paymentDate: {
    allowNull: true,
    unique: false,
    type: DataTypes.DATEONLY,
    field: "payment_date",
  },
  subscriber: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
    unique: false,
  },
  paidOut: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    unique: false,
    field: "paid_out",
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "customer_id",
    references: {
      model: CUSTOMER_TABLE,
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
}

class PurchaseOrder extends Model {
  static associate(models) {
    this.belongsTo(models.Customer, {
      as: "customer"
    });
    this.belongsToMany(models.Product, {
      as: "orderProducts",
      through: models.PurchaseOrderProduct,
      foreignKey: "purchaseOrderId",
      otherKey: "productId"
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: PURCHASE_ORDER_TABLE,
      modelName: "PurchaseOrder",
      timestamps: false
    }
  }
}

module.exports = { PurchaseOrder, PurchaseOrderSchema, PURCHASE_ORDER_TABLE }
