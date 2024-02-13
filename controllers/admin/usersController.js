
const userModel = require("../../models/userModel");
const userHelper = require("../../helper/userHelper"); 

const userListLoad = async (req, res) => {
  const users = await userHelper.getAllUsers();
  res.render("admin/usersList", { users: users });
};

const userBlockUnblock = async (req, res) => {
  const id = req.params.id;
  const result = await userModel.findOne({ _id: id });
  result.isActive = !result.isActive;
  result.save();
  if (!result.isActive) {
    delete req.session.user;
  }
  let message;
  if (result.isActive) {
    message = "User Unblocked";
  } else {
    message = "User Blocked";
  }
  res.json({ message: message });
};

module.exports = {
  userListLoad,userBlockUnblock,
}