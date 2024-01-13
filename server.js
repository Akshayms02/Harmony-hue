const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const nocache = require("nocache");
const userAuthRoute = require("./routes/userAuth");
const userRoute = require("./routes/userRoute");
// const adminRoute = require("./routes/adminRoute");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "/public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));


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

app.use(
  session({
    secret: "1231fdsdfssg33433",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/", nocache());
app.use("/", userAuthRoute);
app.use("/user", userRoute);
// app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log("Server started on http://localhost:3002");
});
