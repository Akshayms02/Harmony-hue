
const loadAdminHome = (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  if (req.session.admin) {
    res.render("admin/adminHome");
  } else {
    res.redirect("/admin");
  }
};

module.exports = {
  loadAdminHome,
}