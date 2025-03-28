const express = require("express");
const router = express.Router();
const Ferias = require("../models/Ferias.js");
const Utilizadores = require("../models/Utilizadores.js");

//Renderiza a página para marcação de férias
router.get("/marcarFerias", (req, res) => res.render("marcarFerias"));

//Renderiza a página de visualização de férias, se for um admin mostra todas as férias, se for um utilizador normal apenas mostra as férias desse utilizador
router.get("/showFerias", async (req, res) => {
  if (req.session.user.tipo) {
    //MOSTRA TODAS AS FERIAS
    try {
      const feriasData = await Ferias.findAll({
        include: [
          {
            model: Utilizadores,
            as: "Utilizadore",
          },
        ],
        nested: true,
      });
      const ferias = feriasData.map((f) => ({
        Ferias_ID: f.Ferias_ID,
        Ferias_data_inicio: f.Ferias_data_inicio,
        Ferias_data_fim: f.Ferias_data_fim,
      }));
      //Handlebars não conseguia lidar com as listas nested a solução foi criar uma lista para cada campo de utilizador
      const utilizadoresData = feriasData.map((f) => f.Utilizadore);
      const utilizadoresID = utilizadoresData.map((u) => u.Utilizador_ID);
      const utilizadoresnome = utilizadoresData.map((u) => u.Utilizador_nome);
      const utilizadoresemail = utilizadoresData.map((u) => u.Utilizador_email);
      res.render("ferias", {
        ferias,
        utilizadoresID,
        utilizadoresnome,
        utilizadoresemail,
        tipo: req.session.user.tipo,
      });
    } catch (err) {
      console.error("Error: " + err);
      res.render("ferias", { errorMessage: "Erro a mostrar férias" });
    }
  } else {
    //MOSTRAS AS FERIAS DO USER ATUAL
    Ferias.findAll({ where: { Utilizador_ID: req.session.user.ID }, raw: true })
      .then((ferias) => {
        res.render("ferias", { ferias, tipo: req.session.user.tipo });
      })
      .catch((err) => {
        console.log("Error: " + err);
        res.render("ferias", { errorMessage: "Erro a mostrar férias" });
      });
  }
});

//Envia a informação dos dias de férias para a base de dados
router.post("/marcarFerias", async (req, res) => {
  const { Ferias_data_inicio, Ferias_data_fim } = req.body;
  if (isDateValid(Ferias_data_inicio, null)) {
    if (isDateValid(Ferias_data_inicio, Ferias_data_fim)) {
      try {
        Ferias.create({
          Utilizador_ID: req.session.user.ID,
          Ferias_data_inicio,
          Ferias_data_fim,
        });
        res.redirect("/ferias/showFerias");
      } catch (error) {
        console.error(error);
        res.render("marcarFerias", { errorMessage: "Erro a marcar férias" });
      }
    } else {
      res.render("marcarFerias", {
        errorMessage: "Periodo de férias inválido",
      });
    }
  } else {
    res.render("marcarFerias", {
      errorMessage: "Data de ínicio de férias é inválida",
    });
  }
});

//Verifica se as datas inseridas são válidas (data de inicio ser maior que a do próprio dia e data de fim ser maior que a do inicio)
function isDateValid(dateFirst, date_Second_or_today) {
  let date = new Date(dateFirst);
  if (date_Second_or_today == null) {
    let date2 = new Date();
    return date2.getTime() - date.getTime() < 0;
  } else {
    let date2 = new Date(date_Second_or_today);
    return date.getTime() - date2.getTime() <= 0;
  }
}
module.exports = router;
