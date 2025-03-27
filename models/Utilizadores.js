const Sequelize = require("sequelize");
const db = require("../config/database");

const Utilizadores = db.define("Utilizadores", {
  Utilizador_ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Utilizador_email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  Utilizador_nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Utilizador_telemovel: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  Utilizador_cargo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Utilizador_senha: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Utilizador_tipo: {
    type: Sequelize.BOOLEAN, //   Normal / Admin
    allowNull: false,
  },
});

module.exports = Utilizadores;
