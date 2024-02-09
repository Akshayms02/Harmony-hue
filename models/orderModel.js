const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
      size: {
        type: String,
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
    type: String,
    enum: ["pending","processing","confirmed","outForDelivery", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  orderId: {
    type: Number,
    default: () => Math.floor(100000 + Math.random() * 900000),
  },
  totalAmount: {
    type: Number,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
