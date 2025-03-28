const express = require("express");
const router = express.Router();
const Ferias = require("../models/Ferias.js");
const Utilizadores = require("../models/Utilizadores.js");

router.get("/marcarFerias", (req, res) => res.render("marcarFerias"));

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

/*function isDateValid(dateFirst, date_Second_or_today) {
  let date = dateFirst;
  let date2 = date_Second_or_today;
  if (date2 == null) {
    date2 = new Date().getTime();
    date = new Date(date[2], date[1] - 1, date[0]).getTime();
    console.log("Date 1: " + date);
    console.log("Date 2: " + date2);
    return date2 - date < 0;
  } else {
    date2 = date2.split("/");
    date = new Date(date[2], date[1] - 1, date[0]).getTime();
    date2 = new Date(date2[2], date2[1] - 1, date2[0]).getTime();
    console.log("Date 1: " + date);
    console.log("Date 2: " + date2);
    return date - date2 < 0;
  }
}*/

module.exports = router;
