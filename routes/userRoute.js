const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");

router.get("/verify", userController.verifyUserLoad);
router.get("/", userController.loadUserHome);









module.exports = router;
