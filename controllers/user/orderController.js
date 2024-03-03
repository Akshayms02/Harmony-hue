const cartHelper = require("../../helper/cartHelper");
const orderHelper = require("../../helper/orderHelper");
const couponHelper = require("../../helper/couponHelper");
const userModel = require("../../models/userModel");
const Razorpay = require("razorpay");

const { KEY_ID, KEY_SECRET } = process.env;

var razorpay = new Razorpay({
  key_id: "rzp_test_8NIpILQrGaZLRj",
  key_secret: "sNRox6FKchnUjeUZkg7Yb9yF",
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

    const hash = createHmac("sha256", "sNRox6FKchnUjeUZkg7Yb9yF")
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
  const cartItems = await cartHelper.getAllCartItems(userId);
  let totalandSubTotal = await cartHelper.totalSubtotal(userId, cartItems);
  const userData = await userModel.findOne({ _id: userId });
  const coupons = await couponHelper.findAllCoupons();
  console.log(userData);

  console.log(cartItems);
  let totalAmountOfEachProduct = [];
  for (i = 0; i < cartItems.length; i++) {
    cartItems[i].product.productPrice = Math.round(
      cartItems[i].product.productPrice -
        (cartItems[i].product.productPrice *
          cartItems[i].product.productDiscount) /
          100
    );
    let total =
      cartItems[i].quantity * parseInt(cartItems[i].product.productPrice);
    total = currencyFormatter(total);
    totalAmountOfEachProduct.push(total);
  }
  totalandSubTotal = currencyFormatter(totalandSubTotal);
  for (i = 0; i < cartItems.length; i++) {
    cartItems[i].product.productPrice = currencyFormatter(
      cartItems[i].product.productPrice
    );
  }
  if (cartItems) {
    res.render("user/checkout", {
      cartItems,
      totalAmountOfEachProduct,
      totalandSubTotal,
      userData,
      coupons,
    });
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

    if (orderDetails && productDetails) {
      res.render("user/orderDetails", { orderDetails, productDetails });
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
};
