const express = require("express");
const userAuth = require("../middleware/userAuth");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userAuth.isLogin, userController.loginLoad);
router.post("/", userController.logUser);
router.get(
  "/forgot-password",
  userAuth.isLogin,
  userController.forgotPasswordLoad
);
router.post("/forgot-password", userController.forgotPasswordChange);
router.get("/register", userAuth.isLogin, userController.registerLoad);
router.post("/register", userController.sendOtp);
router.get("/verify", userAuth.isLogin, userController.verifySignUpLoad);
router.post("/verify", userAuth.otpAuthenticator, userController.signUpUser);


router.get("/userHome", userAuth.isLogout, userController.loadUserHome);

module.exports = router;
