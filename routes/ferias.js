const express = require("express");
const router = express.Router();
const Ferias = require("../models/Ferias.js");
const Utilizadores = require("../models/Utilizadores.js");

router.get("/marcarFerias", (req, res) => res.render("marcarFerias"));

router.get("/showFerias", async (req, res) => {
  /*Ferias.findAll({ raw: true })
    .then((F) => {
      Utilizadores.findOne({ where: {Utilizador_ID: F.Utilizador_ID}})
      .then((Utilizador) => {
        res.render("ferias", {
          F,Utilizador
        });
      })
    })
    .catch((err) => console.log("Error: " + err));
    */
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
      console.log("Ferias table:" + JSON.stringify(utilizadoresData[0]));
      res.render("ferias", {
        ferias,
        utilizadoresID,
        utilizadoresnome,
        utilizadoresemail,
        tipo: req.session.user.tipo,
      });
      /*
      res.render("ferias", {
        ferias: ferias.map((f) => ({
          Ferias_ID: f.Ferias_ID,
          Ferias_data_inicio: f.Ferias_data_inicio,
          Ferias_data_fim: f.Ferias_data_fim,
          Utilizadore: [f.Utilizadore],
        })),
        tipo: req.session.user.tipo,
      });*/
    } catch (err) {
      console.error("Error: " + err);
    }
  } else {
    //MOSTRAS AS FERIAS DO USER ATUAL
    Ferias.findAll({ where: { Utilizador_ID: req.session.user.ID } })
      .then((ferias) => {
        res.render("ferias", { ferias, tipo: req.session.user.tipo });
      })
      .catch((err) => {
        console.log("Error: " + err);
        res.render("ferias");
      });
  }
});

router.post("/marcarFerias", async (req, res) => {
  const { Ferias_data_inicio, Ferias_data_fim } = req.body;
  try {
    Ferias.create({
      Utilizador_ID: req.session.user.ID,
      Ferias_data_inicio,
      Ferias_data_fim,
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
