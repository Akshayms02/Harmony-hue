const express = require("express");
const userAuth = require("../middleware/userAuth");
const router = express.Router();
const authController = require("../controllers/user/authContoller");
const cartController = require("../controllers/user/cartController");
const orderController = require("../controllers/user/orderController");
const productController = require("../controllers/user/productController");
const userController = require("../controllers/user/userController");
const wishlistController = require("../controllers/user/wishlistController");
const couponController = require("../controllers/user/couponController");


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

router.post("/resendOtp", userAuth.otpAuthenticator, authController.resendOtp);

router.post("/verify", userAuth.otpAuthenticator, authController.signUpUser);

router.get("/userHome", userAuth.isLogout, userController.loadUserHome);

router.get("/shop", userAuth.isLogout, userController.shopLoad);

router.get("/shopFilter", userAuth.isLogout, userController.shopFilterLoad);

router.get(
  "/userHome/productView/:id",
  userAuth.isLogout,
  productController.productViewLoad
);

router.get("/cart", userAuth.isLogout, cartController.userCartLoad);

router.get("/wishlist", userAuth.isLogout, wishlistController.wishListLoad);

router.post("/addToCart/:id/:size", productController.addToCart);

router.patch("/updateCartQuantity", cartController.updateCartQuantity);

router.delete("/removeCart/:id", cartController.removeCartItem);

router.post("/addToWishlist/:id", wishlistController.addToWishlist);

router.put("/removeFromWishlist", wishlistController.removeFromWishlist);

router.put("/addAddress", userController.addAddress);

router.get("/editAddress/:id", userController.editAddressLoad);

router.post("/editAddress", userController.editAddress);


router.put("/deleteAddress/:id", userController.deleteAddress);

router.get("/profile", userAuth.isLogout, userController.userProfileLoad);

router.get("/orderDetails/:id", userAuth.isLogout, orderController.orderDetails);

router.put("/updateUserDetails", userController.updateUserDetails);

router.put("/changePassword", userController.changePassword);

router.get("/checkout", userAuth.isLogout, orderController.checkoutLoad);

router.post("/placeOrder", orderController.placeOrder);

router.get(
  "/orderSuccessPage",
  userAuth.isLogout,
  orderController.orderSuccessPageLoad
);

router.get("/orderFailedPage", userAuth.isLogout, orderController.orderFailedPageLoad);

router.patch("/cancelOrder/:id", orderController.cancelOrder);

router.patch("/cancelSingleOrder", orderController.cancelSingleOrder);

router.patch("/returnSingleOrder", orderController.returnSingleOrder);



router.post("/applyCoupon", couponController.applyCoupon);

router.post("/searchProduct", productController.searchProduct);

router.post("/createOrder", orderController.createOrder);

router.post('/paymentSuccess', orderController.paymentSuccess);

router.post("/sortedProducts", userController.sortedProductsLoad);


router.post("/createRazorpayOrder", orderController.retryPayment);




module.exports = router;
