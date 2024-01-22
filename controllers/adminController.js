const categoryHelper = require("../helper/categoryHelper");

const loadAdminHome = (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.render("admin/adminHome");
};

const adminLogout = (req, res) => {
  res.setHeader("Cache-control", "no-cache", "no-store", "must-revalidate");

  if (req.session.admin) {
    req.session.destroy((error) => {
      if (error) {
        res.redirect("/admin");
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
};

const loadCategory = async (req, res) => {
  await categoryHelper.getAllcategory().then((response) => {
    res.render("admin/category", { categories: response });
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
      res.json({ error: false, message: "Category is Unlisted", listed: false });
    }

  });
};

module.exports = {
  loadAdminHome,
  addCategory,
  adminLogout,
  loadCategory,
  deleteCategory,
};
