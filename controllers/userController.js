const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const otpHelper = require("../helper/otpHelper");
const passwordHelper = require("../helper/passwordHelper");
const userHelper = require("../helper/userHelper");
const categoryHelper = require("../helper/categoryHelper");
const productHelper = require("../helper/productHelper");
const cartHelper = require("../helper/cartHelper");
const wishlistHelper = require("../helper/wishlistHelper");

const registerLoad = (req, res) => {
  res.setHeader(
    "Cache-control",
    "no-store, no-cache, must-revalidate, private"
  );

  if (req.session.user) {
    res.redirect("/userhome");
  } else {
    res.render("user/register");
  }
};

const loginLoad = (req, res) => {
  res.setHeader(
    "Cache-control",
    "no-store, no-cache, must-revalidate, private"
  );
  if (req.session.user) {
    res.redirect("/userhome");
  } else {
    const message = req.flash("message");
    res.render("user/login", { message });
  }
};

const signUpUser = async (req, res) => {
  try {
    if (req.session.otp === req.body.otp) {
      const response = await userHelper.signupHelper(req.session.userData);
      if (!response.userExist) {
        req.flash("message", "Registration Successful. Continue to login");
        delete req.session.userData;
        req.session.registered = "Registered";
        res.redirect("/");
      } else {
        req.flash("message", "You are an existing user. Please log in.");

        res.redirect("/");
      }
    } else {
      res.redirect(`/verify?message=${"Invalid OTP"}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect("/register");
  }
};

const logUser = async (req, res) => {
  await userHelper
    .loginHelper(req.body)
    .then((response) => {
      if (response.loggedIn) {
        if (response.user) {
          req.session.user = response.user;
          console.log("user session created");
          res.redirect("/userHome");
        } else {
          req.flash("message", response.errorMessage);
          res.redirect("/");
        }
      } else {
        req.flash("message", response.errorMessage);
        res.redirect("/");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const userLogout = (req, res) => {
  try {
    res.setHeader("Cache-control", "no-cache", "no-store", "must-revalidate");

    if (req.session.user) {
      delete req.session.user;
      req.flash("message", "Logged out succesfully");
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

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

const sendOtp = async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  const userData = req.body;
  await otpHelper
    .otpSender(userData)
    .then((response) => {
      req.session.otpExpiryTime = response.otpTimer;
      req.session.userData = response.user;
      req.session.otp = response.otp;
    })
    .catch((error) => {
      console.log(error);
    });
  res.redirect("/verify");
};

const verifySignUpLoad = (req, res) => {
  if (req.query.message) {
    res.render("user/verifyOtp", { message: req.query.message });
  } else {
    res.render("user/verifyOtp");
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

const productViewLoad = async (req, res) => {
  const id = req.params.id;
  const userData = req.session.user;

  let cartCount = await cartHelper.getCartCount(userData);

  let wishListCount = await wishlistHelper.getWishListCount(userData);

  const product = await productModel.findById({ _id: id }).lean();

  const cartStatus = await cartHelper.isAProductInCart(userData, product._id);

  const wishlistStatus = await wishlistHelper.isInWishlist(
    userData,
    product._id
  );
  const offerPrice =
    product.productPrice -
    (product.productPrice * product.productDiscount) / 100;
  product.cartStatus = cartStatus;
  product.wishlistStatus = wishlistStatus;
  product.discountedPrice = currencyFormatter(Math.round(offerPrice));
  product.productPrice = currencyFormatter(product.productPrice);

  res.render("user/viewProduct", {
    product,
    cartCount,
    wishListCount,
    userData,
  });
};

const userCartLoad = async (req, res) => {
  try {
    const userData = req.session.user;

    const cartItems = await cartHelper.getAllCartItems(userData);

    const cartCount = await cartHelper.getCartCount(userData);

    const wishListCount = await wishlistHelper.getWishListCount(userData);

    let totalandSubTotal = await cartHelper.totalSubtotal(userData, cartItems);

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
    console.log(cartItems);

    res.render("user/userCart", {
      userData: req.session.user,
      cartItems,
      cartCount,
      wishListCount,
      totalAmount: totalandSubTotal,
      totalAmountOfEachProduct,
    });
  } catch (error) {
    console.log(error);
  }
};

const addToCart = async (req, res) => {
  const userId = req.session.user;

  const productId = req.params.id;
  const size = req.params.size;

  const result = await cartHelper.addToCart(userId, productId, size);

  if (result) {
    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
};

const updateCartQuantity = async (req, res) => {
  const productId = req.query.productId;
  const quantity = req.query.quantity;
  const userId = req.session.user;
  const update = await cartHelper.incDecProductQuantity(
    userId,
    productId,
    quantity
  );
  if (update) {
    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const userId = req.session.user;
    const productId = req.params.id;

    const result = await cartHelper.removeItemFromCart(userId, productId);

    if (result) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const wishListLoad = async (req, res) => {
  try {
    const userData = req.session.user;

    const cartCount = await cartHelper.getCartCount(userData);

    const wishListCount = await wishlistHelper.getWishListCount(userData);

    const wishListItems = await wishlistHelper.getAllWishlistProducts(userData);

    res.render("user/userWishlist", {
      userData: req.session.user,
      cartCount,
      wishListCount,
      wishListItems,
    });
  } catch (error) {
    console.log(error);
  }
};

const addToWishlist = async (req, res) => {
  const userId = req.session.user;
  const productId = req.params.id;

  const result = await wishlistHelper.addToWishlist(userId, productId);
  if (result) {
    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
};

const userProfileLoad = async (req, res) => {
  const userId = req.session.user;
  const user = await userModel.findOne({ _id: userId });
  if (user) {
    res.render("user/userProfile", { userData: user });
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

const currencyFormatter = (amount) => {
  return Number(amount).toLocaleString("en-in", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });
};
module.exports = {
  loginLoad,
  registerLoad,
  signUpUser,
  logUser,
  loadUserHome,
  forgotPasswordLoad,
  forgotPasswordChange,
  sendOtp,
  verifySignUpLoad,
  userLogout,
  productViewLoad,
  userCartLoad,
  currencyFormatter,
  wishListLoad,
  addToCart,
  addToWishlist,
  updateCartQuantity,
  removeCartItem,
  userProfileLoad,
  addAddress,
  deleteAddress,
  updateUserDetails,
};
