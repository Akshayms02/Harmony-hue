const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    productDescription: {
      type: String,
    },

    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
      unique: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productQuantity: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    productStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
