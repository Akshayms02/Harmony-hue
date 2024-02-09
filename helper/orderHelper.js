const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");

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
        });
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
      
      console.log(address + "Hey");
    } catch (error) {
      console.log(error);
    }
  });
};

const getOrderDetails = (userId) => {
  return new Promise(async(resolve, reject) => {
    try {
      const orderDetails = await orderModel.find({ user: userId });
      console.log(orderDetails);
      resolve(orderDetails);
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = {
  placeOrder,getOrderDetails,
};
