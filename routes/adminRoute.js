const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");
const multer = require("../middleware/multer");

router.get("/logout", adminAuth.isLogout, adminController.adminLogout);

router.get("/", adminAuth.isLogout, adminController.loadAdminHome);

router.get("/category", adminController.loadCategory);

router.post("/addCategory", adminController.addCategory);

router.get("/editCategory", adminController.editCategoryLoad);

router.put("/editCategory/:id", adminController.editCategoryPost);

router.get("/delete-category/:id", adminController.deleteCategory);

router.get("/productList", adminController.productListLoad);

router.get("/addProduct", adminController.addProductLoad);

router.post(
  "/addProduct",
  multer.productUpload.array('images'),
  adminController.addProductPost
);

router.patch('/deleteproduct/:id', adminController.deleteProduct);

router.get('/editProduct/:id', adminController.editProductLoad);

router.put('/editProduct/:id', multer.productUpload.array('images'), adminController.editProductPost);

router.get('/userList', adminController.userListLoad);

router.patch('/blockUnblockuser/:id', adminController.userBlockUnblock);

module.exports = router;
