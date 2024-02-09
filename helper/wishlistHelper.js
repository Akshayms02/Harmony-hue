const wishlistModel = require("../models/wishlistModel");
const productModel = require("../models/productModel");

const addToWishlist = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    console.log(productId)
    const product = await productModel.findOne({ _id: productId });

    if (!product || !product.productStatus) {
      reject(Error("Product Not Found"));
      return;
    }

    const wishlist = await wishlistModel.updateOne(
      {
        user: userId,
      },
      {
        $push: {
          products: { productItemId: productId },
        },
      },
      {
        upsert: true,
      }
    );

    resolve(wishlist);
  });
};


const isInWishlist = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const wishList = await wishlistModel.findOne({
        user: userId,
        "products.productItemId": productId,
      });

      if (wishList) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};



const getWishListCount = (userId) => {
  return new Promise(async (resolve, reject) => {
    let wishlist = await wishlistModel.findOne({ user: userId });
    let wishlistCount = wishlist?.products.length;
    resolve(wishlistCount);
  });
};

module.exports = {
  addToWishlist,
  isInWishlist,
  getWishListCount,
};
