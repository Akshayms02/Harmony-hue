const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/adminController");
const authContoller = require("../controllers/admin/authController");
const categoryController = require("../controllers/admin/categoryController");
const orderController = require("../controllers/admin/orderController");
const productController = require("../controllers/admin/productController");
const usersController = require("../controllers/admin/usersController");
const couponController = require("../controllers/admin/couponController");
const offerController = require("../controllers/admin/offerController");
const adminAuth = require("../middleware/adminAuth");
const multer = require("../middleware/multer");
const sharp = require("../middleware/sharp");

router.get("/", adminAuth.isLogin, authContoller.adminLoginLoad);

router.post("/", authContoller.adminLoginPost);

router.get("/logout", adminAuth.isLogout, authContoller.adminLogout);

router.get("/adminhome", adminAuth.isLogout, adminController.loadAdminHome);

router.get("/category", adminAuth.isLogout, categoryController.loadCategory);

router.post("/addCategory", adminAuth.isLogout, categoryController.addCategory);

router.get(
  "/editCategory",
  adminAuth.isLogout,
  categoryController.editCategoryLoad
);

router.put("/editCategory/:id", categoryController.editCategoryPost);

router.get(
  "/delete-category/:id",
  adminAuth.isLogout,
  categoryController.deleteCategory
);

router.get(
  "/productList",
  adminAuth.isLogout,
  productController.productListLoad
);

router.get("/addProduct", adminAuth.isLogout, productController.addProductLoad);

router.post(
  "/addProduct",
  multer.productUpload.array("images"),
  sharp.resizeImages,
  productController.addProductPost
);

router.patch("/deleteproduct/:id", productController.deleteProduct);

router.get(
  "/editProduct/:id",
  adminAuth.isLogout,
  productController.editProductLoad
);

router.put(
  "/editProduct/:id",
  multer.productUpload.array("images"),
  sharp.resizeImages,
  productController.editProductPost
);

router.get("/userList", adminAuth.isLogout, usersController.userListLoad);

router.patch("/blockUnblockuser/:id", usersController.userBlockUnblock);

router.get("/orders", adminAuth.isLogout, orderController.adminOrderPageLoad);

router.put("/orderStatusChange", orderController.changeOrderStatus);

router.get("/orderDetails/:id", orderController.orderDetails);

router.patch(
  "/orderStatusChangeForEachProduct/:orderId/:productId",
  orderController.changeOrderStatusOfEachProduct
);

router.get("/coupons", adminAuth.isLogout, couponController.couponListLoad);

router.post("/addCoupon", couponController.addCoupon);

router.get(
  "/editCoupon/:id",
  adminAuth.isLogout,
  couponController.getEditCoupon
);

router.post("/editCoupon", couponController.editCoupon);

router.delete("/deleteCoupon/:id", couponController.deleteCoupon);

router.get(
  "/productOffers",
  adminAuth.isLogout,
  offerController.productOfferLoad
);

router.post("/productAddOffer", offerController.productAddOffer);

router.get(
  "/productEditOffer/:id",
  adminAuth.isLogout,
  offerController.productEditLoad
);

router.post("/productEditOffer", offerController.productEditOffer);

router.get(
  "/categoryOffers",
  adminAuth.isLogout,
  offerController.categoryOfferLoad
);

router.post("/categoryAddOffer", offerController.addCategoryOffer);

router.get("/categoryEditOffer/:id", adminAuth.isLogout, offerController.categoryEditLoad);

router.post("/categoryEditOffer", offerController.categoryEditOffer);

router.get("/salesReport", orderController.loadSalesReport);

router.post("/salesReport", orderController.loadSalesReportDateSort);

module.exports = router;
