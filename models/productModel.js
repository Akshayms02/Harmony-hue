const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
    },
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productQuantity: {
      S: {
        quantity: {
          type: Number,
          default:0,
        }
      },
      M: {
        quantity: {
          type: Number,
          default:0,
        }
      },
      L: {
        quantity: {
          type: Number,
          default:0,
        }
      },
    },
    productDiscount: {
      type: Number,
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
    totalQuantity: {
      type: Number,
     
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
