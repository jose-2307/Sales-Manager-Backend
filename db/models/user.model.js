const { Model, DataTypes } = require("sequelize");
const { ROLE_TABLE } = require("./role.model");

const USER_TABLE = "users";

const UserSchema = {
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
  lastName: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  paymentDeadline: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
  },
  roleId: {
    field: "role_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ROLE_TABLE,
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  }
}


class User extends Model {
  static associate(models) {
    this.hasOne(models.Auth, {
      as: "auth",
      foreignKey: "userId"
    });
    this.belongsTo(models.Role, {
      as: "role"
    })
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: "User",
      timestamps: false
    }
  }
}

module.exports = { User, UserSchema, USER_TABLE }
