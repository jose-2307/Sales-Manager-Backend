const { Model, DataTypes } = require("sequelize");
const { USER_TABLE } = require("./user.model");
const { CUSTOMER_TABLE } = require("./customer.model");

const DEFAULTER_TABLE = "defaulters";

const DefaulterSchema = {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "user_id",
    primaryKey: true,
    references: {
      model: USER_TABLE,
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "customer_id",
    primaryKey: true,
    references: {
      model: CUSTOMER_TABLE,
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false,
    defaultValue: 0,
  },
  defaulter: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    unique: false,
    defaultValue: false,
  }
}

class Defaulter extends Model {

  static config(sequelize) {
    return {
      sequelize,
      tableName: DEFAULTER_TABLE,
      modelName: "Defaulter",
      timestamps: false
    }
  }
}

module.exports = { DefaulterSchema, DEFAULTER_TABLE, Defaulter }
