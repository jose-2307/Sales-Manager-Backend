const { Model, DataTypes } = require("sequelize");
const { USER_TABLE } = require("./user.model");

const CUSTOMER_TABLE = "customers";

const CustomerSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: false,
  },
  phone: {
    allowNull: true,
    type: DataTypes.STRING,
    unique: false,
  },
  location: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
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

class Customer extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      as: "user"
    });
    this.hasMany(models.PurchaseOrder, {
      as: "purchaseOrders",
      foreignKey: "customerId"
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: CUSTOMER_TABLE,
      modelName: "Customer",
      timestamps: false
    }
  }
}

module.exports = { Customer, CustomerSchema, CUSTOMER_TABLE }
