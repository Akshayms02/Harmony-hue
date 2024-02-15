const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const placeOrder = (body, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await cartModel.findOne({ user: userId });
      const address = await userModel.findOne(
        { _id: userId, "address._id": body.addressId },
        {
          "address.$": 1,
          _id: 0,
        }
      );
      const user = await userModel.findOne({ _id: userId });
      console.log(cart);
      let products = [];
      for (const product of cart.products) {
        products.push({
          product: product.productItemId,
          quantity: product.quantity,
          size: product.size,
          productPrice: product.price
        });
        let changeStock = await productModel.updateOne({ _id: product.productItemId, "productQuantity.size": product.size }, { $inc: { "productQuantity.$.quantity": - product.quantity,totalQuantity:-product.quantity } });
      }

      if (cart && address) {
        const result = orderModel.create({
          user: userId,
          products: products,
          address: {
            name: address.address[0].name,
            house: address.address[0].house,
            city: address.address[0].city,
            state: address.address[0].state,
            country: address.address[0].country,
            pincode: address.address[0].pincode,
            mobile: user.mobile,
          },
          paymentMethod: body.paymentOption,
          totalAmount: cart.totalAmount,
        });
        
        resolve(result);
      }

    } catch (error) {
      console.log(error);
    }
  });
};

const getOrderDetails = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orderDetails = await orderModel.find({ user: userId });
      console.log(orderDetails);
      resolve(orderDetails);
    } catch (error) {
      console.log(error);
    }
  });
};

const cancelOrder = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await orderModel.findOne({ _id: orderId });
      if (order) {
        order.status = "cancelled";
        order.save();
        resolve(order);
      } else {
        reject(Error("Order not found"));
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    const result = await orderModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userOrderDetails",
        },
      },
    ]);
    if (result) {
      resolve(result);
    }
  });
};
const changeOrderStatus = (orderId, changeStatus) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await orderModel.findOne({ _id: orderId });
      order.status = changeStatus;
      await order.save();
      resolve(order);
    } catch (error) {
      reject(new Error("Something wrong!!!"));
    }
  });
};

module.exports = {
  placeOrder,
  getOrderDetails,
  cancelOrder,
  getAllOrders,
  changeOrderStatus,
};


