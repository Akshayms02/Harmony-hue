const cartModel = require("../models/cartModel");
const ObjectId = require("mongoose").Types.ObjectId;

const addToCart = (userId, productId, size) => {
  return new Promise(async (resolve, reject) => {
    const cart = await cartModel.updateOne(
      { user: userId },
      {
        $push: {
          products: { productItemId: productId, quantity: 1, size: size },
        },
      },
      { upsert: true }
    );
    console.log(cart);

    resolve(cart);
  });
};

const getCartCount = (userId) => {
  return new Promise(async (resolve, reject) => {
    let count = 0;
    let cart = await cartModel.findOne({ user: userId });
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
    let cart = await cartModel.findOne({ user: userId });
    let total = 0;
    if (cart) {
      if (cartItems.length) {
        for (let i = 0; i < cartItems.length; i++) {
          total =
            total +
            cartItems[i].quantity *
              parseInt(
                cartItems[i].product.productPrice -
                  (cartItems[i].product.productPrice *
                    cartItems[i].product.productDiscount) /
                    100
              );
        }
      }
      cart.totalAmount = parseFloat(total);

      await cart.save();

      resolve(total);
    } else {
      resolve(total);
    }
  });
};

const getAllCartItems = (userId) => {
  return new Promise(async (resolve, reject) => {
    let userCartItems = await cartModel.aggregate([
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
          size:"$products.size",
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
          size: 1,
          product: {
            $arrayElemAt: ["$product", 0],
          },
        },
      },
    ]);

    resolve(userCartItems);
  });
};

const isAProductInCart = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(userId)
      const cart = await cartModel.findOne({
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
    const cart = await cartModel.findOne({ user: userId });

    const product = cart.products.find((items) => {
      return items.productItemId.toString() == productId;
    });

    let newQuantity = product.quantity + parseInt(quantity);

    if (newQuantity < 1) {
      newQuantity = 1;
    }

    product.quantity = newQuantity;
    await cart.save();
    resolve(newQuantity);
  });
};

const removeItemFromCart = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    cartModel
      .updateOne(
        { user: userId },
        {
          $pull: { products: { productItemId: productId } },
        }
      )
      .then((result) => {
        resolve(result);
      });
  });
};

module.exports = {
  addToCart,
  getCartCount,
  totalSubtotal,
  getAllCartItems,
  isAProductInCart,
  incDecProductQuantity,
  removeItemFromCart,
};
