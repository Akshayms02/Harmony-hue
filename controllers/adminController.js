const userModel = require('../models/userModel');

const loadAdminHome = (req,res) => {
  res.render('admin/adminHome');
}


module.exports = {
  loadAdminHome,
};