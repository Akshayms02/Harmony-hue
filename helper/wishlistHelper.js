const wishlistModel = require("../model/wishlistModel");
const productModel = require("../model/productModel");
const ObjectId = require("mongoose").Types.ObjectId;

const addItemToWishlist = (productId, userId) => {
  return new Promise(async (resolve, reject) => {
    const product = await productModel.findOne({ _id: productId });

    if (!product || !product.product_status) {
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

//   isInWishlist :async (userId,productId) =>{
//     console.log(userId,'{{{{{{{{{{{{{{{{{{{');
//     console.log(productId,'{{{{{{{{{{{{{{{{{{{');
//     try{
//         const wishList = await wishlistModel.findOne({
//             user: userId,
//             'products.productItemId': productId
//           });

//         console.log(wishList,'lllllllllltttttttttttttttt');

//         if(wishList){
//             return true
//         }else{
//             return false
//         }
//     }catch(error){
//         console.log(error);
//     }
//   }
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

const getAllWishlistProducts = (userId) => {
  return new Promise(async (resolve, reject) => {
    let wishlistProducts = await wishlistModel.aggregate([
      {
        $match: {
          user: new ObjectId(userId),
        },
      },

      {
        $unwind: "$products",
      },
      {
        $project: {
          item: "$products.productItemId",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "item",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          item: 1,
          product: {
            $arrayElemAt: ["$product", 0],
          },
        },
      },
    ]);
    resolve(wishlistProducts);
  });
};

const removeProductFromWishlist = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    await wishlistModel
      .updateOne(
        {
          user: new ObjectId(userId),
        },
        {
          $pull: {
            products: {
              productItemId: productId,
            },
          },
        }
      )
      .then((result) => {
        resolve(result);
      });
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
  addItemToWishlist,
  isInWishlist,
  getAllWishlistProducts,
  removeProductFromWishlist,
  getWishListCount,
};
