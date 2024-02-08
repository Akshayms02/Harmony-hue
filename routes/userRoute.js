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

router.get("/userHome/productView/:id",userAuth.isLogout, userController.productViewLoad);

router.get("/cart",userAuth.isLogout, userController.userCartLoad);

router.get("/wishlist",userAuth.isLogout, userController.wishListLoad);

router.post("/addToCart/:id/:size", userController.addToCart);

router.patch("/updateCartQuantity", userController.updateCartQuantity);

router.delete("/removeCart/:id", userController.removeCartItem);

router.post("/addToWishlist/:id", userController.addToWishlist);

router.put("/addAddress", userController.addAddress);

router.put("/deleteAddress/:id", userController.deleteAddress);

router.get("/profile", userAuth.isLogout, userController.userProfileLoad);

router.put("/updateUserDetails", userController.updateUserDetails);



module.exports = router;
