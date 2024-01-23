const express = require("express");
const userAuth = require("../middleware/adminAuth");
const router = express.Router();
// const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

router.get("/logout", adminAuth.isLogout, adminController.adminLogout);

router.get("/", adminAuth.isLogout, adminController.loadAdminHome);

router.get("/category", adminController.loadCategory);

router.post("/addCategory", adminController.addCategory);

router.get("/editCategory", adminController.editCategoryLoad);

router.put("/editCategory/:id", adminController.editCategoryPost);

router.get("/delete-category/:id", adminController.deleteCategory);

router.get("/productList",adminController.productListLoad)

module.exports = router;
