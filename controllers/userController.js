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
      console.log(response);
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
    let userId = req.session.user._id;
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
      console.log("hey")
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
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  req.flash("message", "Your password has been changed");
  res.redirect("/");
};

const productViewLoad = async (req, res) => {
  const id = req.params.id;
  const userData = req.session.user;

  let cartCount = await cartHelper.getCartCount(userData._id);

  let wishListCount = await wishlistHelper.getWishListCount(userData._id);

  const product = await productModel.findById({ _id: id }).lean();

  const cartStatus = await cartHelper.isAProductInCart(userData._id, product._id);
  console.log(cartStatus);
  const wishlistStatus = await wishlistHelper.isInWishlist(
    userData._id,
    product._id
  );
  product.cartStatus = cartStatus;
  product.wishlistStatus = wishlistStatus;
  product.productPrice = currencyFormatter(product.productPrice)

  console.log(product);


  res.render("user/viewProduct", { product, cartCount, wishListCount });
};

const userCartLoad = async (req, res) => {
  try {
    const userData = req.session.user;

    const cartItems = await cartHelper.getAllCartItems(userData._id);

    const cartCount = await cartHelper.getCartCount(userData._id);

    const wishListCount = await wishlistHelper.getWishListCount(userData._id);

    let totalandSubTotal = await cartHelper.totalSubtotal(
      userData._id,
      cartItems
    );
    totalandSubTotal = currencyFormatter(totalandSubTotal);
    

    res.render("user/userCart", {
      userData: req.session.user,
      cartItems,
      cartCount,
      wishListCount,
      totalAmount: totalandSubTotal,
    });
  } catch (error) {
    console.log(error);
  }
};

const addToCart = async (req, res) => {
  const userId = req.session.user._id;
  const productId = req.params.id;

  const result = await cartHelper.addToCart(userId, productId);

  if (result) {
    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
};
const wishListLoad = async (req, res) => {
  try {
    const userData = req.session.user;

    const cartCount = await cartHelper.getCartCount(userData._id);

    const wishListCount = await wishlistHelper.getWishListCount(userData._id);

    const wishListItems = await wishlistHelper.getAllWishlistProducts(userData._id);

    res.render("user/userWishlist", {
      userData: req.session.user,
      cartCount,
      wishListCount,
      wishListItems,
    });
  } catch (error) {
    console.log(error);
  }
}

const addToWishlist = async (req, res) => {
  const userId = req.session.user._id;
  const productId = req.params.id;

  const result = await wishlistHelper.addToWishlist(userId, productId);
  if (result) {
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
};
