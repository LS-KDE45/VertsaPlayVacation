const express = require("express");
const router = express.Router();
const Utilizadores = require("../models/Utilizadores.js");
const { v4: uuidv4 } = require("uuid"); // Generate unique tokens
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { FORCE } = require("sequelize/lib/index-hints");

router.get("/login", (req, res) => res.render("login"));

router.get("/createUser", (req, res) => res.render("createUser"));

router.get("/showUsers", (req, res) =>
  Utilizadores.findAll({ raw: true })
    .then((Utilizador) => {
      res.render("utilizadores", {
        Utilizador,
      });
    })
    .catch((err) => console.error("Error: " + err))
);

router.get("/deleteUsers", (req, res) =>
  Utilizadores.findAll({ raw: true })
    .then((Utilizador) => {
      res.render("deleteUser", {
        Utilizador,
      });
    })
    .catch((err) => console.error("Error: " + err))
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao encerrar sessão:", err);
      return res.render("login", { errorMessage: "Erro ao encerrar sessão" });
    }
    res.redirect("/utilizadores/login");
  });
});

// Email-sending route
router.post("/send-email", async (req, res) => {
  console.log("/sendemail");
  const { Utilizador_email, Utilizador_cargo, checkbox } = req.body;
  let Utilizador_tipo = req.body.checkbox_user_tipo ? 1 : 0;

  try {
    // Hash a temporary password
    const temporaryPassword = await bcrypt.hash(uuidv4(), 10);
    const temporaryName = "John Doe";

    console.log({
      Utilizador_email,
      temporaryName,
      Utilizador_cargo,
      temporaryPassword,
      Utilizador_tipo,
    });

    // Insert the user into the database with isConfirmed = false
    let user = await Utilizadores.findOne({
      where: { Utilizador_email: Utilizador_email },
    });

    if (!user) {
      Utilizadores.create({
        Utilizador_email,
        Utilizador_nome: temporaryName,
        Utilizador_cargo,
        Utilizador_senha: temporaryPassword,
        Utilizador_tipo,
      });
    } else {
      return res.render("createUser", { errorMessage: "Utilizador já existe" });
    }
    // Generate a secure confirmation token (expires in 1 hour)
    const token = jwt.sign(
      { Utilizador_email: Utilizador_email },
      process.env.SESSION_SECRET,
      { expiresIn: "1h" }
    );

    // Confirmation link
    const confirmationLink = `http://localhost:3000/utilizadores/setUpAccount?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "luisqueiros21@gmail.com",
        pass: "exws vrnn hmit juit",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email options
    const mailOptions = {
      from: "luisqueiros21@gmail.com",
      to: Utilizador_email,
      subject: `Criação de conta na Vertsa Play`,
      text: `Olá,\n\nCarrega no link em baixo para terminar a configuração da conta na Vertsa Play:\n\n${confirmationLink}\n\nEste link expira dentro de 1 hora.\n\nMelhores Cumprimentos.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    //MENSAGEM NÃO É DE ERRO
    res.render("index", { errorMessage: "Email enviado" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.render("createUser", { errorMessage: "Erro a enviar email" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await Utilizadores.findOne({
      where: { Utilizador_email: req.body.Utilizador_email },
    });
    if (user === null) {
      res.render("login", { errorMessage: "Utilizador não encontrado" });
    } else {
      if (
        await bcrypt.compare(req.body.Utilizador_senha, user.Utilizador_senha)
      ) {
        req.session.user = {
          ID: user.Utilizador_ID,
          email: user.Utilizador_email,
          nome: user.Utilizador_nome,
          tipo: user.Utilizador_tipo,
        };
        res.redirect("../");
        console.log("Success");
      } else {
        res.render("login", { errorMessage: "Email ou senha errada" });
      }
    }
  } catch (error) {
    console.error(error);
    res.render("login", { errorMessage: "Erro a efetuar o login" });
  }
});

router.get("/setUpAccount", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.render("index", {
      errorMessage: "Token em falta, por favor aceda ao link novamente",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);

    const user = await Utilizadores.findOne({
      where: { Utilizador_email: decoded.Utilizador_email },
    });

    if (!user) {
      return res.render("index", { errorMessage: "Utilizador não encontrado" });
    }

    req.session.resetToken = token;
    res.render("setUpAccount");
  } catch (error) {
    console.error(error);
    res.render("index", { errorMessage: "Invalid or expired token." });
  }
});

router.post("/createAccount", async (req, res) => {
  let { Utilizador_nome, telemovel_string, Utilizador_senha, Password2 } =
    req.body;

  if (isPasswordStrong(Utilizador_senha)) {
    if (Utilizador_senha == Password2) {
      // Get token from session (not from URL)
      const token = req.session.resetToken;
      if (!token) {
        return res.render("index", {
          errorMessage: "Token em falta, por favor aceda ao link novamente",
        });
      }
      telemovel_string = telemovel_string.trim();
      const Utilizador_telemovel =
        telemovel_string === "" ? null : telemovel_string;

      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);

        // Find organization by email
        const user = await Utilizadores.findOne({
          where: { Utilizador_email: decoded.Utilizador_email },
        });

        if (!user) {
          return res.render("index", {
            errorMessage: "Utilizador não encontrado",
          });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(Utilizador_senha, 10);

        // Update password in database
        await user.update({
          Utilizador_nome,
          Utilizador_telemovel,
          Utilizador_senha: hashedPassword,
        });

        // Clear token from session to prevent reuse
        req.session.resetToken = null;

        res.redirect("../");
      } catch (error) {
        console.error(error);
        return res.render("index", {
          errorMessage: "Erro, por favor aceda ao link novamente",
        });
      }
    } else {
      return res
        .status(400)
        .render("setUpAccount", { errorMessage: "Passwords do not match" });
    }
  } else {
    res.render("setUpAccount", {
      errorMessage:
        "Senha tem de ter mais de 6 caracteres, uma letra maiúcula, uma letra minúscula e um número",
    });
  }
});

router.post("/deleteUser", async (req, res) => {
  try {
    let user = await Utilizadores.findOne({
      where: { Utilizador_ID: req.body.Utilizador_ID },
    });
    if (user) {
      await user.destroy();
      res.redirect("/utilizadores/showUsers");
    }
  } catch (error) {
    console.error("Erro a remover utilizador:", error);
    res.render("deleteUser", { errorMessage: "Erro a remover utilizador." });
  }
});

function isPasswordStrong(password) {
  return (
    password.length > 6 &&
    password.match(/[a-z]+/) &&
    password.match(/[A-Z]+/) &&
    password.match(/[0-9]+/)
  );
}

module.exports = router;
