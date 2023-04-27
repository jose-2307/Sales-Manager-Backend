const { Model, DataTypes } = require("sequelize");
const { USER_TABLE } = require("./user.model");

const AUTH_TABLE = "auth";

const AuthSchema = {
  userId: {
    field: "user_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: USER_TABLE,
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: false,
  }
}

class Auth extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      as: "user"
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: AUTH_TABLE,
      modelName: "Auth",
      timestamps: false
    }
  }
}

module.exports = { AuthSchema, AUTH_TABLE, Auth }
