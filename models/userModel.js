const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  address: [
    {
      name: String,
      house: String,
      state: String,
      country: String,
      city: String,
      pincode: Number,
      addressType: Number,
    },
  ],
  wallet: {
    balance: { type: Number, default: 0 },
    details: [
      {
        type: { type: String, enum: ["credit", "debit", "refund"] },
        amount: { type: Number },
        date: { type: Date },
        transactionId: {
          type: Number,
          default: function () {
            return Math.floor(100000 + Math.random() * 900000);
          },
        },
      },
    ],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
