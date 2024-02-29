const express = require("express");
const session = require("express-session");
const path = require("path");
const nocache = require("nocache");
const userRoute = require("./routes/userRoute");
require("dotenv").config();
const adminRoute = require("./routes/adminRoute");
const connectDB = require("./database/dataBase");
const flash = require("express-flash");
const methodOverride = require("method-override");
const app = express();

const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use("/assets", express.static(path.join(__dirname, "/public/assets")));

app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  session({
    secret: "1231fdsdfssg33433",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600 * 1000,
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
  console.log(
    "Server started on User Login: http://localhost:3002 , Admin Login:http://localhost:3002/admin"
  );
});
