const adminModel = require("../../models/adminModel");

const adminLoginLoad = (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  if (req.session.admin) {
    res.redirect("/admin/adminhome");
  }
  const message = req.flash("message");
  res.render("admin/adminLogin", { message: message });
};

const adminLoginPost = async (req, res) => {
  const result = await adminModel.findOne({ email: req.body.email });
  if (result) {
    if (req.body.password === result.password) {
      req.session.admin = result._id;
      res.redirect("/admin/adminhome");
    } else {
      req.flash("message", "Incorrect Password");
      res.redirect("/admin");
    }
  } else {
    req.flash("message", "Invalid Email");
    res.redirect("/admin");
  }
};

const adminLogout = (req, res) => {
  res.setHeader("Cache-control", "no-cache", "no-store", "must-revalidate");

  if (req.session.admin) {
    delete req.session.admin;
    req.flash("message", "Logged Out Successfully");
    res.redirect("/admin");
  } else {
    res.redirect("/admin");
  }
};

module.exports = {
  adminLoginLoad,
  adminLoginPost,
  adminLogout,
}