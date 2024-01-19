const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  mobile: {
    type: "Number",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  isAdmin: {
    type: "Number",
    required: true,
  },
  
});

const User = mongoose.model("User", userSchema);

module.exports = User;