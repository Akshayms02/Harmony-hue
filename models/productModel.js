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
    productQuantity: [
      {
        size: {
          type: String,
          enum: ["S", "M", "L"],
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    productDiscount: {
      type: Number,
      default: 0,
    },
    discountExpiry: {
      type: Date,
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

productSchema.pre("save", function (next) {
  const now = new Date();
  if (this.discountExpiry < now) {
    this.productDiscount = 0;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
