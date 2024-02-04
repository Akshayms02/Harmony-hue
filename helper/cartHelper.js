const cartSchema = require("../model/cartModel");
const productSchema = require("../model/productModel");
const ObjectId = require("mongoose").Types.ObjectId;

const addToUserCart = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    const product = await productSchema.findOne({ _id: productId });

    if (!product.product_status) {
      reject(Error("Product Not Found"));
    }

    const cart = await cartSchema.updateOne(
      { user: userId },
      { $push: { products: { productItemId: productId, quantity: 1 } } },
      { upsert: true }
    );

    resolve(cart);
  });
};

const getCartCount = (userId) => {
  return new Promise(async (resolve, reject) => {
    let count = 0;
    let cart = await cartSchema.findOne({ user: userId });
    if (cart) {
      count = cart.products.length;
    } else {
      count = 0;
    }
    resolve(count);
  });
};

const totalSubtotal = (userId, cartItems) => {
  return new Promise(async (resolve, reject) => {
    let cart = await cartSchema.findOne({ user: userId });
    let total = 0;
    if (cart) {
      if (cartItems.length) {
        for (let i = 0; i < cartItems.length; i++) {
          total =
            total + cartItems[i].quantity * cartItems[i].product.product_price;
        }
      }
      cart.totalAmount = total;
      await cart.save();
      console.log(total);
      resolve(total);
    } else {
      resolve(total);
    }
  });
};

const totalAmount = (userId) => {
  return new Promise(async (resolve, reject) => {
    const cart = await cartSchema.findOne({ user: userId });

    resolve(cart.totalAmount);
  });
};

const getAllCartItems = (userId) => {
  return new Promise(async (resolve, reject) => {
    let userCartItems = await cartSchema.aggregate([
      {
        $match: { user: new ObjectId(userId) },
      },
      {
        $unwind: "$products",
      },
      {
        $project: {
          item: "$products.productItemId",
          quantity: "$products.quantity",
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
          quantity: 1,
          product: {
            $arrayElemAt: ["$product", 0],
          },
        },
      },
    ]);

    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    // console.log(userCartItems);
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    resolve(userCartItems);
  });
};

// isAProductInCart: async (userId, productId) => {
//   try {
//     const cart = await cartSchema.findOne({ user: userId, 'products.productItemId': productId })

//     console.log(cart,'carttttttttttttttttttttttttttttttttttttttttt');

//     if (cart) {
//       return true
//     } else {
//       return false
//     }
//   } catch (error) {
//     console.log(error);
//   }
// },

const isAProductInCart = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await cartSchema.findOne({
        user: userId,
        "products.productItemId": productId,
      });

      if (cart) {
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

const incDecProductQuantity = (userId, productId, quantity) => {
  return new Promise(async (resolve, reject) => {
    const cart = await cartSchema.findOne({ user: userId });

    const product = cart.products.find((items) => {
      return items.productItemId.toString() == productId;
    });

    let newQuantity = product.quantity + parseInt(quantity);

    if (newQuantity < 1 || newQuantity > 10) {
      newQuantity = 1;
    }

    product.quantity = newQuantity;
    await cart.save();
    resolve(newQuantity);
  });
};

const removeAnItemFromCart = (cartId, productId) => {
  return new Promise(async (resolve, reject) => {
    cartSchema
      .updateOne(
        { _id: cartId },
        {
          $pull: { products: { productItemId: productId } },
        }
      )
      .then((result) => {
        resolve(result);
      });
  });
};

const clearTheCart = (userId) => {
  return new Promise(async (resolve, reject) => {
    await cartSchema
      .findOneAndUpdate(
        { user: userId },
        { $set: { products: [] } },
        { new: true }
      )

      .then((result) => {
        resolve(result);
      });
  });
};

module.exports = {
  addToUserCart,
  getCartCount,
  totalSubtotal,
  totalAmount,
  getAllCartItems,
  isAProductInCart,
  incDecProductQuantity,
  removeAnItemFromCart,
  clearTheCart,
};
