const { config } = require("./../config/config");

module.exports = {
  development: {
    url: config.dbUrl,
    dialect: "postgres",
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeData",
  },
  production: {
    url: config.dbUrl,
    dialect: "postgres",
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeData",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}
