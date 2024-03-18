const cartHelper = require("../../helper/cartHelper");
const orderHelper = require("../../helper/orderHelper");
const couponHelper = require("../../helper/couponHelper");
const offerHelper = require("../../helper/offerHelper");
const userModel = require("../../models/userModel");
const couponModel = require("../../models/couponModel");
const cartModel = require("../../models/cartModel");
const Razorpay = require("razorpay");

var razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const amount = parseInt(req.body.totalPrice);
    console.log(amount);
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: req.session.user,
    });

    console.log(order);

    res.json({ orderId: order });
  } catch (error) {
    console.log(error);
  }
};

const paymentSuccess = (req, res) => {
  try {
    const { paymentid, signature, orderId } = req.body;
    const { createHmac } = require("node:crypto");

    const hash = createHmac("sha256", process.env.KEY_SECRET)
      .update(orderId + "|" + paymentid)
      .digest("hex");

    if (hash === signature) {
      console.log("success");
      res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      console.log("error");
      res.json({ success: false, message: "Invalid payment details" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const checkoutLoad = async (req, res) => {
  const userId = req.session.user;
  let cartItems = await cartHelper.getAllCartItems(userId);
  let cart = await cartModel.findOne({ user: userId });
  const offerPrice = await offerHelper.findOfferInCart(cartItems);
  let totalandSubTotal = await cartHelper.totalSubtotal(userId, cartItems);
  const userData = await userModel.findOne({ _id: userId });
  const coupons = await couponHelper.findAllCoupons();
  // console.log(userData);
  console.log(cartItems)
  if (cart.coupon != null) {
    const appliedCoupon = await couponModel.findOne({ code: cart.coupon });
    cartItems[0].couponAmount = appliedCoupon.discount;

    let totalAmountOfEachProduct = [];
    for (i = 0; i < cartItems.length; i++) {
      let total =
        cartItems[i].quantity * parseInt(cartItems[i].product.offerPrice);
      total = currencyFormatter(total);
      totalAmountOfEachProduct.push(total);
    }
    totalandSubTotal = totalandSubTotal;
    console.log(cartItems);
    if (cartItems) {
      res.render("user/checkout", {
        cartItems,
        totalAmountOfEachProduct,
        totalandSubTotal,
        userData,
        coupons,
      });
    }
  } else {
    let totalAmountOfEachProduct = [];
    for (i = 0; i < cartItems.length; i++) {
      let total =
        cartItems[i].quantity * parseInt(cartItems[i].product.offerPrice);
      total = currencyFormatter(total);
      totalAmountOfEachProduct.push(total);
    }
    totalandSubTotal = currencyFormatter(totalandSubTotal);

    if (cartItems) {
      res.render("user/checkout", {
        cartItems,
        totalAmountOfEachProduct,
        totalandSubTotal,
        userData,
        coupons,
      });
    }
  }
};

const placeOrder = async (req, res) => {
  const body = req.body;
  const userId = req.session.user;

  const result = await orderHelper.placeOrder(body, userId);
  if (result) {
    const cart = await cartHelper.clearAllCartItems(userId);
    if (cart) {
      res.json({ url: "/orderSuccessPage" });
    }
  }
};

const orderSuccessPageLoad = (req, res) => {
  res.render("user/orderSuccessPage");
};

const cancelOrder = async (req, res) => {
  try {
    console.log("entered");
    const orderId = req.params.id;
    const result = await orderHelper.cancelOrder(orderId);

    if (result) {
      res.json({ status: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const orderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderDetails = await orderHelper.getSingleOrderDetails(orderId);
    const productDetails = await orderHelper.getOrderDetailsOfEachProduct(
      orderId
    );
    const offerPrice = await offerHelper.findOfferInOrderDetails(
      productDetails
    );

    if (orderDetails && productDetails) {
      res.render("user/orderDetails", {
        orderDetails,
        productDetails: offerPrice,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const cancelSingleOrder = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const singleOrderId = req.query.singleOrderId;
    const result = await orderHelper.cancelSingleOrder(orderId, singleOrderId);
    if (result) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const returnSingleOrder = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const singleOrderId = req.query.singleOrderId;
    const result = await orderHelper.returnSingleOrder(orderId, singleOrderId);
    if (result) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const currencyFormatter = (amount) => {
  return Number(amount).toLocaleString("en-in", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });
};

module.exports = {
  checkoutLoad,
  cancelOrder,
  orderSuccessPageLoad,
  placeOrder,
  orderDetails,
  cancelSingleOrder,
  createOrder,
  paymentSuccess,
  returnSingleOrder,
};
