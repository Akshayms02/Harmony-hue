const categoryHelper = require("../helper/categoryHelper");
const productHelper = require("../helper/productHelper");
const categoryModel = require("../models/categoryModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const userHelper = require("../helper/userHelper");

const loadAdminHome = (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.render("admin/adminHome");
};

const adminLogout = (req, res) => {
  res.setHeader("Cache-control", "no-cache", "no-store", "must-revalidate");

  if (req.session.admin) {
    delete req.session.admin;
    req.flash("message", "Logged Out Successfully");
    res.redirect("/");
  } else {
    res.redirect("/");
  }
};

const loadCategory = (req, res) => {
  categoryHelper.getAllcategory().then((response) => {
    const message = req.flash("message");
    res.render("admin/category", { categories: response, message: message });
  });
};

const addCategory = async (req, res) => {
  await categoryHelper.addCategory(req.body).then((response) => {
    res.json(response);
  });
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  await categoryHelper.softDeleteCategory(categoryId).then((response) => {
    if (response.status) {
      res.json({ error: false, message: "Category is listed", listed: true });
    } else {
      res.json({
        error: false,
        message: "Category is Unlisted",
        listed: false,
      });
    }
  });
};

const editCategoryLoad = async (req, res) => {
  const catId = req.query.catId;

  const catDetails = await categoryModel.findById({ _id: catId });

  res.render("admin/editCategory", { details: catDetails });
};

const editCategoryPost = async (req, res) => {
  const check = await categoryModel.findOne({
    categoryName: req.body.categoryName,
  });

  const checks = await categoryModel.findOne({ _id: req.params.id });

  if (!check) {
    checks.categoryName = req.body.categoryName;
    checks.description = req.body.categoryDescription;
    await checks.save();

    res.redirect("/admin/category");
  } else if (req.params.id == check._id) {
    check.categoryName = req.body.categoryName;
    check.description = req.body.categoryDescription;
    await check.save();

    res.redirect("/admin/category");
  } else {
    req.flash("message", "Category already Exists");
    console.log("Hi")
    res.redirect("/admin/category");
  }
};

const productListLoad = async (req, res) => {
  const products = await productHelper.getAllProducts();
  res.render("admin/productList", { products: products });
};

const addProductLoad = (req, res) => {
  categoryHelper.getAllcategory().then((response) => {
    console.log(response);
    res.render("admin/addProduct", { category: response });
  });
};

const addProductPost = (req, res) => {
  const body = req.body;
  const files = req.files;
  productHelper
    .addProduct(body, files)
    .then((response) => {
      res.redirect("/admin/productList");
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteProduct = (req, res) => {
  const id = req.params.id;
  productHelper
    .productListUnlist(id)
    .then((response) => {
      if (response.productStatus) {
        res.json({ message: "Listed Successfuly" });
      } else {
        res.json({ message: "Unlisted Succesfuly" });
      }
    })
    .catch((error) => {
      res.json({ error: "Failed" });
    });
};

const editProductLoad = async (req, res) => {
  const id = req.params.id;
  const category = await categoryHelper.getAllcategory();
  const productDetail = await productModel.findOne({ _id: id });
  res.render("admin/editProduct", {
    product: productDetail,
    category: category,
  });
};

const editProductPost = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.redirect("/admin/productList");
    }
    product.productName = req.body.productName;
    product.productDescription = req.body.productDescription;
    product.productPrice = req.body.productPrice;
    product.productQuantity = req.body.productQuantity;
    product.productCategory = req.body.productCategory;
    product.productDiscount = req.body.productDiscount;
    if (req.files) {
      const filenames = await productHelper.editImages(
        product.image,
        req.files
      );
      product.image = filenames;
    }
    await product.save();
    res.redirect("/admin/productList");
  } catch (err) {
    console.log(err);
  }
};

const userListLoad = async (req, res) => {
  const users = await userHelper.getAllUsers();
  res.render("admin/usersList", { users: users });
};

const userBlockUnblock = async (req, res) => {
  const id = req.params.id;
  const result = await userModel.findOne({ _id: id });
  result.isActive = !result.isActive;
  result.save();
  let message;
  if (result.isActive) {
    message = "User Unblocked";
  } else {
    message = "User Blocked";
  }
  res.json({ message: message });
};

module.exports = {
  loadAdminHome,
  addCategory,
  adminLogout,
  loadCategory,
  deleteCategory,
  editCategoryLoad,
  editCategoryPost,
  productListLoad,
  addProductLoad,
  addProductPost,
  deleteProduct,
  editProductLoad,
  editProductPost,
  userListLoad,
  userBlockUnblock,
};
