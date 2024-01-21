const express = require("express");
const userAuth = require("../middleware/adminAuth");
const router = express.Router();
// const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const adminAuth=require('../middleware/adminAuth')

router.get('/', adminAuth.isLogout,adminController.loadAdminHome);




module.exports = router;