const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    products: [
      {
        productItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const wishlist = mongoose.model("wishList", wishListSchema);

module.exports = wishlist;
