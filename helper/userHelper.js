const userModel = require("../models/userModel");
const passwordHelper = require("../helper/passwordHelper");
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
            response.user = user._id;
            response.loggedIn = true;
            resolve(response);
          } else {
            response.errorMessage = "Invalid username or password";
            resolve(response);
          }
        });
      } else {
        response.errorMessage = "Your Account has been Blocked";
        resolve(response);
      }
    } else {
      response.errorMessage = "Invalid username or password";
      resolve(response);
    }
  });
};

const signupHelper = (userData) => {
  return new Promise(async (resolve, reject) => {
    const userExist = await userModel.findOne({
      $or: [{ email: userData.email }, { mobile: userData.mobile }],
    });
    if (!userExist) {
      userData.password = await passwordHelper.securePassword(
        userData.password
      );
      userModel
        .create({
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
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

const getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    const users = await userModel.find();
    resolve(users);
  });
};

const addAddress = (body, userId) => {
  return new Promise(async (resolve, reject) => {
    const result = await userModel.updateOne(
      { _id: userId },
      {
          $push: { address: body },
      }, 
    );
    console.log(result);
    resolve(result);
  });
};

module.exports = {
  loginHelper,
  signupHelper,
  getAllUsers,
  addAddress,
};
