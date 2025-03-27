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

/*module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: 21,
  dialect: 'mariadb',

  define:{
    freezeTableName: true,
    timestamps: false
}
}); SERVER*/
