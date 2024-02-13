const express = require("express");
const userAuth = require("../middleware/userAuth");
const router = express.Router();
const authController = require("../controllers/user/authContoller");
const cartController = require("../controllers/user/cartController");
const orderController = require("../controllers/user/orderController");
const productController = require("../controllers/user/productController");
const userController = require("../controllers/user/userController");
const wishlistController = require("../controllers/user/wishlistController");
// const userController = require("../controllers/userController");
// const sharp = require("../middleware/sharp");

router.get("/", userAuth.isLogin, authController.loginLoad);

router.post("/", authController.logUser);

router.get(
  "/forgot-password",
  userAuth.isLogin,
  userController.forgotPasswordLoad
);

router.get("/logout", userAuth.isLogout, authController.userLogout);

router.post("/forgot-password", userController.forgotPasswordChange);

router.get("/register", userAuth.isLogin, authController.registerLoad);

router.post("/register", authController.sendOtp);

router.get(
  "/verify",
  userAuth.isLogin,
  userAuth.isRegistered,
  authController.verifySignUpLoad
);

router.post("/verify", userAuth.otpAuthenticator, authController.signUpUser);

router.get("/userHome", userAuth.isLogout, userController.loadUserHome);

router.get("/userHome/productView/:id",userAuth.isLogout, productController.productViewLoad);

router.get("/cart",userAuth.isLogout,cartController.userCartLoad);

router.get("/wishlist",userAuth.isLogout, wishlistController.wishListLoad);

router.post("/addToCart/:id/:size", productController.addToCart);

router.patch("/updateCartQuantity",cartController.updateCartQuantity);

router.delete("/removeCart/:id",cartController.removeCartItem);

router.post("/addToWishlist/:id", wishlistController.addToWishlist);

router.put("/addAddress", userController.addAddress);

router.put("/deleteAddress/:id", userController.deleteAddress);

router.get("/profile", userAuth.isLogout, userController.userProfileLoad);

router.put("/updateUserDetails", userController.updateUserDetails);

router.get("/checkout", userAuth.isLogout,orderController.checkoutLoad);

router.post("/placeOrder", orderController.placeOrder);

router.get("/orderSuccessPage",userAuth.isLogout, orderController.orderSuccessPageLoad);

router.patch("/cancelOrder/:id", orderController.cancelOrder);



module.exports = router;
