const { Model, DataTypes } = require("sequelize");
const { PRODUCT_TABLE } = require("./product.model");

const IMAGE_TABLE = "images";

const ImageSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  url: {
    allowNull: false,
    unique: false,
    type: DataTypes.STRING,
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
  }
}

class Image extends Model {
  static associate(models) {
    this.belongsTo(models.Product, {
      as: "product"
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: IMAGE_TABLE,
      modelName: "Image",
      timestamps: false
    }
  }
}

module.exports = { ImageSchema, IMAGE_TABLE, Image }
