const categoryHelper = require("../../helper/categoryHelper");
const cartHelper = require("../../helper/cartHelper");
const wishlistHelper = require("../../helper/wishlistHelper");
const productHelper = require("../../helper/productHelper");
const orderHelper = require("../../helper/orderHelper");
const userModel = require("../../models/userModel");
const userHelper = require("../../helper/userHelper");
const bcrypt = require("bcrypt");
const moment = require("moment");

const loadUserHome = async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  try {
    let userId = req.session.user;
    const categories = await categoryHelper.getAllcategory();

    let cartCount = await cartHelper.getCartCount(userId);

    let wishListCount = await wishlistHelper.getWishListCount(userId);

    let products = await productHelper.getAllActiveProducts();
    for (const product of products) {
      const cartStatus = await cartHelper.isAProductInCart(userId, product._id);
      const wishlistStatus = await wishlistHelper.isInWishlist(
        userId,
        product._id
      );

      const offerPrice =
        product.productPrice -
        (product.productPrice * product.productDiscount) / 100;
      product.discountedPrice = currencyFormatter(Math.round(offerPrice));
      product.cartStatus = cartStatus;
      product.wishlistStatus = wishlistStatus;
      product.productPrice = currencyFormatter(product.productPrice);
    }

    res.render("user/userHome", {
      products,
      userData: req.session.user,
      cartCount,
      wishListCount,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};

const userProfileLoad = async (req, res) => {
  try {
    const userId = req.session.user;
    const cartCount = await cartHelper.getCartCount(userId);
    const wishListCount = await wishlistHelper.getWishListCount(userId);
    const user = await userModel.findOne({ _id: userId });
    const orderDetails = await orderHelper.getOrderDetails(userId);
    for (const order of orderDetails) {
      const dateString = order.orderedOn;
      order.formattedDate = moment(dateString).format("MMMM Do, YYYY");
      order.formattedTotal = currencyFormatter(order.totalAmount);
      let quantity = 0;
      for (const product of order.products) {
        quantity += Number(product.quantity);
      }
      order.quantity = quantity;
      quantity = 0;
    }
    console.log(orderDetails)
    if (user) {
      res.render("user/userProfile", {
        userData: user,
        orderDetails,
        cartCount,
        wishListCount,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const addAddress = async (req, res) => {
  const body = req.body;
  const userId = req.session.user;
  const result = await userHelper.addAddress(body, userId);
  if (result) {
    res.json({ status: true });
  }
};

const deleteAddress = async (req, res) => {
  const addressId = req.params.id;

  const userId = req.session.user;

  const result = await userHelper.deleteAddress(addressId, userId);
  if (result) {
    res.json({ status: true });
  }
};

const updateUserDetails = async (req, res) => {
  const userId = req.session.user;
  const userDetails = req.body;

  const result = await userHelper.updateUserDetails(userId, userDetails);

  if (result.status) {
    res.json({ status: true });
  } else {
    res.json({ message: result.message });
  }
};

const forgotPasswordLoad = (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.render("user/forgotPasswordPage");
};

const forgotPasswordChange = async (req, res) => {
  await passwordHelper
    .forgotPassword(req.body.password, req.body.email)
    .then((response) => {})
    .catch((error) => {
      console.log(error);
    });
  req.flash("message", "Your password has been changed");
  res.redirect("/");
};

const changePassword = async (req, res) => {
  const { currentPassword, npassword, cpassword } = req.body;
  const userId = req.session.user;
  const user = await userModel.findOne({ _id: userId });
  console.log(currentPassword);
  if (await bcrypt.compare(currentPassword, user.password)) {
    const newPassword = await bcrypt.hash(npassword, 10);
    user.password = newPassword;
    await user.save();
    res.json({ status: true });
  } else {
    res.json({ status: false });
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
  loadUserHome,
  userProfileLoad,
  addAddress,
  deleteAddress,
  updateUserDetails,
  changePassword,
  forgotPasswordLoad,
  forgotPasswordChange,
};
