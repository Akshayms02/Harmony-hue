const express = require("express");
const userAuth = require("../middleware/userAuth");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userAuth.isLogin, userController.loginLoad);
router.post("/", userController.logUser);
router.get("/register", userAuth.isLogin, userController.registerLoad);
router.post("/register", userController.insertUser);
router.get("/verify", userAuth.isLogin, userController.verifyUserLoad);
router.post(
  "/verify",
  userAuth.otpAuthenticator,
  userController.verifiedLogUser
);
router.get("/userHome", userAuth.isLogout, userController.loadUserHome);

module.exports = router;
