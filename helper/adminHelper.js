const userModel = require("../models/userModel");


// function for getting all users data.
const findAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    await userModel
      .find()
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

// function for blocking and unblocking a user.
const blockOrUnblock = async (userId) => {
  return new Promise(async (resolve, reject) => {
    const user = await userModel.findById(userId);
    user.isActive = !user.isActive;
    await user.save();
    if (!user.isActive) {
      delete req.session.user;
    }
    resolve(user);
  });
};

module.exports = {
  findAllUsers,blockOrUnblock,
};
