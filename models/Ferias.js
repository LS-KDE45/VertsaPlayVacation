const Sequelize = require("sequelize");
const db = require("../config/database");
const Utilizadores = require("./Utilizadores");

const Ferias = db.define("Ferias", {
  Ferias_ID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Utilizador_ID: {
    type: Sequelize.INTEGER,
    references: {
      model: Utilizadores,
      key: "Utilizador_ID",
    },
    onDelete: "CASCADE",
  },
  Ferias_data_inicio: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  Ferias_data_fim: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
});

Utilizadores.hasMany(Ferias, {
  foreignKey: "Utilizador_ID",
  onDelete: "CASCADE",
});
Ferias.belongsTo(Utilizadores, {
  foreignKey: "Utilizador_ID",
  onDelete: "CASCADE",
});

module.exports = Ferias;
