const express = require("express");
const userAuth = require("../middleware/userAuth");
const router = express.Router();
const userController = require("../controllers/userController");
const sharp = require("../middleware/sharp");

router.get("/", userAuth.isLogin, userController.loginLoad);

router.post("/", userController.logUser);

router.get(
  "/forgot-password",
  userAuth.isLogin,
  userController.forgotPasswordLoad
);

router.get("/logout", userAuth.isLogout, userController.userLogout);

router.post("/forgot-password", userController.forgotPasswordChange);

router.get("/register", userAuth.isLogin, userController.registerLoad);

router.post("/register", userController.sendOtp);

router.get(
  "/verify",
  userAuth.isLogin,
  userAuth.isRegistered,
  userController.verifySignUpLoad
);

router.post("/verify", userAuth.otpAuthenticator, userController.signUpUser);

router.get("/userHome", userAuth.isLogout, userController.loadUserHome);

router.get("/userHome/productView/:id", userController.productViewLoad);

router.get("/cart",userAuth.isLogout, userController.userCartLoad);

router.get("/wishlist",userAuth.isLogout, userController.wishListLoad);

router.post("/addToCart/:id", userController.addToCart);

router.post("/addToWishlist/:id", userController.addToWishlist);



module.exports = router;
