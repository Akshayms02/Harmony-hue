const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const couponModel = require("../models/couponModel");
const walletHelper = require("../helper/walletHelper");
const ObjectId = require("mongoose").Types.ObjectId;

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
          productPrice: product.price,
        });

        let changeStock = await productModel.updateOne(
          { _id: product.productItemId, "productQuantity.size": product.size },
          {
            $inc: {
              "productQuantity.$.quantity": -product.quantity,
              totalQuantity: -product.quantity,
            },
          }
        );
      }
      if (cart.coupon != null) {
        console.log("entered");
        const result = await couponModel.findOne({ code: cart.coupon });
        var couponAmount = result.discount;
      } else {
        var couponAmount = 0;
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
          couponAmount: couponAmount,
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
      const orderDetails = await orderModel
        .find({ user: userId })
        .sort({ orderedOn: -1 });

      resolve(orderDetails);
    } catch (error) {
      console.log(error);
    }
  });
};

const getOrderDetailsOfEachProduct = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orderDetails = await orderModel.aggregate([
        {
          $match: {
            _id: new ObjectId(orderId),
          },
        },
        {
          $unwind: "$products",
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "orderedProduct",
          },
        },
        {
          $unwind: "$orderedProduct",
        },
      ]);
      let check = true;
      let count = 0;

      for (const order of orderDetails) {
        if (order.products.status == "delivered") {
          check = true;
          count++;
        } else if (order.products.status == "cancelled") {
          check = true;
        } else {
          check = false;
          break;
        }
      }
      if (check == true && count >= 1) {
        orderDetails.deliveryStatus = true;
      }
      console.log(orderDetails)

      resolve(orderDetails);
    } catch (error) {
      console.log(error);
    }
  });
};

const getSingleOrderDetails = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const singleOrderDetails = await orderModel.aggregate([
        {
          $match: {
            _id: new ObjectId(orderId),
          },
        },
        {
          $project: {
            user: 1,
            totalAmount: 1,
            paymentMethod: 1,
            orderedOn: 1,
            status: 1,
          },
        },
      ]);
      console.log(singleOrderDetails);
      resolve(singleOrderDetails);
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
        for (const singleProduct of order.products) {
          singleProduct.status = "cancelled";
        }
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
    const result = await orderModel
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userOrderDetails",
          },
        },
      ])
      .sort({ orderedOn: -1 });
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

const cancelSingleOrder = (orderId, singleOrderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cancelled = await orderModel.findOneAndUpdate(
        {
          _id: new ObjectId(orderId),
          "products._id": new ObjectId(singleOrderId),
        },
        {
          $set: { "products.$.status": "cancelled" },
        },
        {
          new: true,
        }
      );
      const result = await orderModel.aggregate([
        {
          $unwind: "$products",
        },
        {
          $match: {
            _id: new ObjectId(orderId),
            "products._id": new ObjectId(singleOrderId),
          },
        },
      ]);
      const singleProductId = result[0].products.product;
      const singleProductSize = result[0].products.size;
      const singleProductQuantity = result[0].products.quantity;

      const stockIncrease = await productModel.updateOne(
        { _id: singleProductId, "productQuantity.size": singleProductSize },
        {
          $inc: {
            "productQuantity.$.quantity": singleProductQuantity,
            totalQuantity: singleProductQuantity,
          },
        }
      );

      resolve(cancelled);
    } catch (error) {
      console.log(error);
    }
  });
};
const returnSingleOrder = (orderId, singleOrderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cancelled = await orderModel.findOneAndUpdate(
        {
          _id: new ObjectId(orderId),
          "products._id": new ObjectId(singleOrderId),
        },
        {
          $set: { "products.$.status": "return pending" },
        },
        {
          new: true,
        }
      );
      const result = await orderModel.aggregate([
        {
          $unwind: "$products",
        },
        {
          $match: {
            _id: new ObjectId(orderId),
            "products._id": new ObjectId(singleOrderId),
          },
        },
      ]);
      const singleProductId = result[0].products.product;
      const singleProductSize = result[0].products.size;
      const singleProductQuantity = result[0].products.quantity;

      const stockIncrease = await productModel.updateOne(
        { _id: singleProductId, "productQuantity.size": singleProductSize },
        {
          $inc: {
            "productQuantity.$.quantity": singleProductQuantity,
            totalQuantity: singleProductQuantity,
          },
        }
      );

      resolve(cancelled);
    } catch (error) {
      console.log(error);
    }
  });
};

const changeOrderStatusOfEachProduct = (orderId, productId, status,price) => {
  return new Promise(async (resolve, reject) => {
    try {
    
      const result = await orderModel.findOneAndUpdate(
        { _id: new ObjectId(orderId), "products._id": new ObjectId(productId) },
        {
          $set: { "products.$.status": status },
        },
        {new:true}
      );

      if (status === "returned") {
        const walletUpdation = await walletHelper.walletAmountAdding(result.user,price);
      }



      console.log(result);
      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

const salesReport = async () => {
  try {
    const result = await orderModel.aggregate([
      { $unwind: "$products" },
      { $match: { "products.status": "delivered" } },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
    ]);

    return result;
  } catch (error) {
    console.log("Error:", error);
    throw error; // Re-throwing the error to be caught elsewhere if needed.
  }
};

const salesReportDateSort = async (startDate, endDate) => {
  try {
    const startDateSort = new Date(startDate);
    const endDateSort = new Date(endDate);

    const result = await orderModel.aggregate([
      {
        $match: {
          orderedOn: { $gte: startDateSort, $lte: endDateSort },
        },
      },
      { $unwind: "$products" },
      { $match: { "products.status": "delivered" } },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $sort: { orderedOn: 1 } }, // 1 for ascending order, -1 for descending
    ]);
    console.log(result);
    return result;
  } catch (error) {
    console.log("Error:", error);
    throw error; // Re-throwing the error to be caught elsewhere if needed.
  }
};

module.exports = {
  placeOrder,
  getOrderDetails,
  getOrderDetailsOfEachProduct,
  cancelOrder,
  getAllOrders,
  changeOrderStatus,
  getSingleOrderDetails,
  cancelSingleOrder,
  changeOrderStatusOfEachProduct,
  returnSingleOrder,
  salesReport,
  salesReportDateSort,
};
