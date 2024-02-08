const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
      price: {
        type: Number,
      },
    },
  ],
  address: {
    name: String,
    house: String,
    state: String,
    country: String,
    city: String,
    pincode: Number,
    mobile: Number,
  },
  paymentMethod: {
    type: String,
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  },
  deliveredOn: {
    type: Date,
  },
  status: {
    type: Number,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
