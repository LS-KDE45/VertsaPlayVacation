// Import dependencies
const express = require("express");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const session = require("express-session");

const sequelize = require("./config/database");

sequelize
  .authenticate()
  .then(() => console.log("db connected"))
  .catch((err) => console.log("Error: " + err));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // set to `true` if using HTTPS
      httpOnly: true, // good security practice to prevent JavaScript access
      maxAge: 1000 * 60 * 60, // session cookie expires after 1 hour
      sameSite: "Lax", // this helps with cross-site requests } // Set to `true` if using HTTPS
    },
  })
);

//handlebars
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//static folder
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.nome = req.session.user ? req.session.user.nome : null; // Access the correct session variable
  res.locals.tipo = req.session.user ? req.session.user.tipo : null;
  next();
});

// Middleware to refresh session before it expires
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    // Reset the session expiration by updating the session on each request
    req.session.cookie.maxAge = 1000 * 60 * 60; // Reset to 1 hour
  }
  next();
});

//index
app.get("/", (req, res) => res.render("index"));

app.use("/utilizadores", require("./routes/utilizadores"));
app.use("/ferias", require("./routes/ferias"));

const PORT = process.env.PORT || 3000;
console.log(PORT);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
