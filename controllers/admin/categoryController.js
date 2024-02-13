const categoryHelper = require("../../helper/categoryHelper");
const categoryModel = require("../../models/categoryModel");

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
    console.log("Hi");
    res.redirect("/admin/category");
  }
};

module.exports = {
  loadCategory,
  addCategory,
  deleteCategory,
  editCategoryLoad,
  editCategoryPost,
};
