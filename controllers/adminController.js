const userModel = require('../models/userModel');

const loadAdminHome = (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.render('admin/adminHome');
}


module.exports = {
  loadAdminHome,
};