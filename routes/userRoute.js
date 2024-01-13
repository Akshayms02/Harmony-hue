const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");

router.get("/verify", userController.verifyUserLoad);
router.post('/verify', userController.verifiedLogUser);
router.get("/home", userController.loadUserHome);










module.exports = router;
