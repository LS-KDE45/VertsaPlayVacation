require("dotenv").config();

const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  "vertsaplayvacation",
  "root",
  process.env.DB_PASS_LOCAL,
  {
    // LOCAL HOST DB
    host: "localhost",
    dialect: "mariadb",

    define: {
      freezeTableName: true,
      timestamps: false,
    },
  }
);
