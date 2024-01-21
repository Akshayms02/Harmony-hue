const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const loginHelper = (userData) => {
  return new Promise(async (resolve, reject) => {
    let user = await userModel.findOne({ email: userData.email });
    let response = {};
    if (user) {
      console.log(user);
      if (user.isActive) {
        bcrypt.compare(userData.password, user.password).then((result) => {
          if (result) {
            response.user = user;
            response.loggedIn = true;
            resolve(response);
          } else {
            response.logginMessage = "Invalid username or password";
            resolve(response);
          }
        });
      } else {
        response.logginMessage = "blocked user";
        resolve(response);
      }
    } else {
      response.logginMessage = "Invalid username or password";
      resolve(response);
    }
  });
};

const signupHelper = (userData) => {
  return new Promise(async (resolve, reject) => {
    const isUserExist = await userModel.findOne({
      $or: [{ email: userData.email }, { phone: userData.phone }],
    });
    if (!isUserExist) {
      userData.password = await bcrypt.hash(userData.password, 10);

      User.create({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      })
        .then((data) => {
          console.log(data);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      resolve({ userExist: true });
    }
  });
};

const forgotPassword = (newPassword, Mobile) => {
  return new Promise(async (resolve, reject) => {
    newPassword = await bcrypt.hash(newPassword, 10);
    let user = await userModel.findOne({ Mobile: Mobile });
    user.password = newPassword;
    await user.save();
    resolve(user);
  });
};

module.exports = {
  loginHelper,
  signupHelper,
  forgotPassword,
};
