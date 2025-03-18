const express = require("express");
require("dotenv").config();
const session = require("express-session");
const path = require("path");
const nocache = require("nocache");
const { userRoute, adminRoute } = require("./routes/");
require("./database/dataBase");
const flash = require("express-flash");
const methodOverride = require("method-override");
const app = express();
const createError = require("http-errors");

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

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; 

  // render the error page
  res.status(err.status || 500);
  res.render('error',{ layout: false});
});

app.listen(PORT, () => {
  console.log(
    "Server started on User Login: http://localhost:3002 , Admin Login:http://localhost:3002/admin"
  );
});

