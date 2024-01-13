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
  country: {
    type: "string",
    required: false},
  state: {
    type: "string",
    required: false,
  },
  pincode: {
    type: "string",
    required: false,
  },
  status: {
    type: "boolean",
    required: false,
  },
  address: [
    {
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      house: {
        type: "string",
        required: false,
      },
      country: {
        type: "string",
        required: false,
      },
      city: {
        type: "string",
        required: false,
      },
      state: {
        type: "string",
        required: false,
      },
      pincode: {
        type: "string",
        required: false,
      },
    },
  ],
  wallet: {
    amount: {
      type: "Number",
      required:false,
    },
    paymentMethods: {
      type: "string",
      required:false,
    }
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;