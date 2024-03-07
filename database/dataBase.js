const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL);
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