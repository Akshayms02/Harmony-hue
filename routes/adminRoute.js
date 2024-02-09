const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");
const multer = require("../middleware/multer");
const sharp = require("../middleware/sharp");

router.get("/", adminAuth.isLogin, adminController.adminLoginLoad);

router.post("/", adminController.adminLoginPost);

router.get("/adminhome", adminController.loadAdminHome);

router.get("/logout", adminAuth.isLogout, adminController.adminLogout);

router.get("/category", adminAuth.isLogout, adminController.loadCategory);

router.post("/addCategory", adminAuth.isLogout, adminController.addCategory);

router.get(
  "/editCategory",
  adminAuth.isLogout,
  adminController.editCategoryLoad
);

router.put("/editCategory/:id", adminController.editCategoryPost);

router.get("/delete-category/:id", adminController.deleteCategory);

router.get("/productList", adminAuth.isLogout, adminController.productListLoad);

router.get("/addProduct", adminAuth.isLogout, adminController.addProductLoad);

router.post(
  "/addProduct",
  multer.productUpload.array("images"),
  sharp.resizeImages,
  adminController.addProductPost
);

router.patch("/deleteproduct/:id", adminController.deleteProduct);

router.get("/editProduct/:id", adminController.editProductLoad);

router.put(
  "/editProduct/:id",
  multer.productUpload.array("images"),sharp.resizeImages,
  adminController.editProductPost
);

router.get("/userList", adminAuth.isLogout, adminController.userListLoad);

router.patch("/blockUnblockuser/:id", adminController.userBlockUnblock);

router.get("/orders", adminController.adminOrderPageLoad);

router.put("/orderStatusChange", adminController.changeOrderStatus);

module.exports = router;
