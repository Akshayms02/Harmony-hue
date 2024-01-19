const express = require("express");
const userAuth = require("../middleware/adminAuth");
const router = express.Router();
// const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");

router.get('/', adminController.loadAdminHome);




module.exports = router;