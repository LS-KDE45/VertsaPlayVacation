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
    .catch((err) => console.log("Error: " + err))
);

router.get("/deleteUsers", (req, res) =>
  Utilizadores.findAll({ raw: true })
    .then((Utilizador) => {
      res.render("deleteUser", {
        Utilizador,
      });
    })
    .catch((err) => console.log("Error: " + err))
);

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
      return res.status(400).json({ error: "User already exists." });
    }
    // Generate a secure confirmation token (expires in 1 hour)
    const token = jwt.sign(
      { Utilizador_email: Utilizador_email },
      process.env.SESSION_SECRET,
      { expiresIn: "1h" }
    );

    // Confirmation link
    const confirmationLink = `http://localhost:3000/utilizadores/setUpAccount?token=${token}`;

    // Configure the SMTP transporter
    /*const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "queirossluiss@gmail.com",
        pass: "xcom jqxp bvoy ezvl",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    */

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
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Find organization by email
    const user = await Utilizadores.findOne({
      where: { Utilizador_email: req.body.Utilizador_email },
    });
    if (user === null) {
      res.status(400).send("User not found");
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
        console.log("Your Email or password was incorrect");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid password.");
  }
});

router.get("/setUpAccount", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Invalid or missing confirmation token.");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);

    // Find organization by email
    const user = await Utilizadores.findOne({
      where: { Utilizador_email: decoded.Utilizador_email },
    });

    if (!user) {
      return res.status(400).send("User not found or already confirmed.");
    }

    // Mark user as confirmed
    //await org.update({ isConfirmed: true });

    // Store token in session to prevent tampering
    req.session.resetToken = token;
    res.render("setUpAccount");

    // Redirect to password setup page (no email in URL)
    //res.redirect("/set-password");
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid or expired token.");
  }
});

router.post("/createAccount", async (req, res) => {
  let { Utilizador_nome, telemovel_string, Utilizador_senha, Password2 } =
    req.body;

  if (Utilizador_senha == Password2) {
    // Get token from session (not from URL)
    const token = req.session.resetToken;
    if (!token) {
      return res.status(400).send("Invalid or missing reset token.");
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
        return res.status(400).send("User not found.");
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

      res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
      console.error(error);
      res.status(400).send("Invalid or expired token.");
    }
  } else {
    return res
      .status(400)
      .render("setUpAccount", { error: "Passwords do not match" });
  }
});

router.post("/deleteUser", async (req, res) => {
  try {
    let user = await Utilizadores.findOne({
      where: { Utilizador_ID: req.body.Utilizador_ID },
    });
    if (user) {
      await user.destroy();
      res.render("index");
    }
  } catch (error) {
    console.error("Erro a remover utilizador:", error);
    res.status(500).json({ error: "Erro a remover utilizador." });
  }
});

module.exports = router;
