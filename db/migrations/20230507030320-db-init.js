'use strict';
const { DataTypes } = require("sequelize");

const { ROLE_TABLE } = require("../models/role.model");
const { USER_TABLE } = require("../models/user.model");
const { AUTH_TABLE } = require("../models/auth.model");
const { CATEGORY_TABLE } = require("../models/category.model");
const { PRODUCT_TABLE } = require("../models/product.model");
const { USER_PRODUCT_PURCHASE_TABLE } = require("../models/userProductPurchase.model");
const { IMAGE_TABLE } = require("../models/image.model");
const { CUSTOMER_TABLE } = require("../models/customer.model");
const { PURCHASE_ORDER_TABLE } = require("../models/purchaseOrder.model");
const { PURCHASE_ORDER_PRODUCT_TABLE } = require("../models/purchaseOrderProduct.model");
const { DEFAULTER_TABLE } = require("../models/defaulter.model");




/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(ROLE_TABLE,{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      }
    });
    await queryInterface.createTable(USER_TABLE,{
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
    });
    await queryInterface.createTable(AUTH_TABLE,{
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
    });
    await queryInterface.createTable(CATEGORY_TABLE,{
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
    });
    await queryInterface.createTable(PRODUCT_TABLE,{
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
      salePriceKilo: {
        type: DataTypes.FLOAT,
        unique: false,
        allowNull: false,
        field: "sale_price_kilo",
      },
      weight: {
        type: DataTypes.FLOAT,
        unique: false,
        allowNull: false,
        defaultValue: 0,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "category_id",
        references: {
          model: CATEGORY_TABLE,
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    });
    await queryInterface.createTable(USER_PRODUCT_PURCHASE_TABLE,{
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
    });
    await queryInterface.createTable(IMAGE_TABLE,{
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
        onDelete: "SET NULL",
      }
    });
    await queryInterface.createTable(CUSTOMER_TABLE,{
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
    });
    await queryInterface.createTable(PURCHASE_ORDER_TABLE,{
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
    });
    await queryInterface.createTable(PURCHASE_ORDER_PRODUCT_TABLE,{
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
    });
    await queryInterface.createTable(DEFAULTER_TABLE,{
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
    });

  },

  async down (queryInterface) {
    await queryInterface.dropTable(DEFAULTER_TABLE);
    await queryInterface.dropTable(PURCHASE_ORDER_PRODUCT_TABLE);
    await queryInterface.dropTable(PURCHASE_ORDER_TABLE);
    await queryInterface.dropTable(CUSTOMER_TABLE);
    await queryInterface.dropTable(IMAGE_TABLE);
    await queryInterface.dropTable(USER_PRODUCT_PURCHASE_TABLE);
    await queryInterface.dropTable(PRODUCT_TABLE);
    await queryInterface.dropTable(CATEGORY_TABLE);
    await queryInterface.dropTable(AUTH_TABLE);
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(ROLE_TABLE);
  }
};
