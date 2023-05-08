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
    field: "last_name",
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
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
    });
    this.hasMany(models.Product, {
      as: "products",
      foreignKey: "userId"
    });
    this.belongsToMany(models.Product, {
      as: "items",
      through: models.UserProductPurchase,
      foreignKey: "userId",
      otherKey: "productId"
    });
    this.hasMany(models.Customer, {
      as: "customers",
      foreignKey: "userId"
    });
    this.belongsToMany(models.Customer, {
      as: "defaulters",
      through: models.Defaulter,
      foreignKey: "userId",
      otherKey: "customerId",
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
