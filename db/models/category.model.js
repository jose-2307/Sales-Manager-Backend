const { Model, DataTypes } = require("sequelize");

const CATEGORY_TABLE = "categories";

const CategorySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: true,
  }
}

class Category extends Model {
  static associate(models) {
    this.hasMany(models.Product, {
      as: "products",
      foreignKey: "categoryId"
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_TABLE,
      modelName: "Category",
      timestamps: false
    }
  }
}

module.exports = { CATEGORY_TABLE, CategorySchema, Category }
