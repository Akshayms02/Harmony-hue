const express = require("express");
const userAuth = require("../middleware/adminAuth");
const router = express.Router();
// const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const adminAuth=require('../middleware/adminAuth')

router.get('/logout', adminAuth.isLogout, adminController.adminLogout);
router.get('/', adminAuth.isLogout, adminController.loadAdminHome);

router.get('/category', adminController.loadCategory);

router.post('/addCategory', adminController.addCategory);

router.get('/delete-category/:id', adminController.deleteCategory);




module.exports = router;