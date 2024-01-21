const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const forgotPassword = (newPassword, email) => {
  return new Promise(async (resolve, reject) => {
    newPassword = await bcrypt.hash(newPassword, 10);
    let user = await userModel.findOne({ email: email });
    user.password = newPassword;
    await user.save();
    resolve(user);
  });
};

const securePassword = async (password) => {
  try {
    const sPassword = await bcrypt.hash(password, 10);
    return sPassword;
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  forgotPassword,securePassword,
}