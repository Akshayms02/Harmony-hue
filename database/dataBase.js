const mongoose = require("mongoose");

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

module.exports = mongoose;