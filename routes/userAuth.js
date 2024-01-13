const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.loginLoad);
router.post("/", userController.logUser);
router.get("/register", userController.registerLoad);
router.post("/register", userController.insertUser);

module.exports = router;
