const express = require("express");
const session = require("express-session");
const path = require("path");
const nocache = require("nocache");
const userRoute = require("./routes/userRoute");
require("dotenv").config();
const adminRoute = require("./routes/adminRoute");
const mongoose = require("mongoose");
const flash = require("express-flash");
const methodOverride = require('method-override');

mongoose.connect("mongodb://127.0.0.1:27017/HarmonyHue");
mongoose.connection.on("connected", () => {
  console.log("Connected to mongoDB");
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected to mongoDB");
});

mongoose.connection.on("error", () => {
  console.log("error");
});

const app = express();

const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use("/assets", express.static(path.join(__dirname, "/public/assets")));

app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  session({
    secret: "1231fdsdfssg33433",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600 * 1000,
    },
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use("/", nocache());

app.use("/", userRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log("Server started on http://localhost:3002");
});
