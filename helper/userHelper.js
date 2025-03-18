const userModel = require("../models/userModel");
const passwordHelper = require("../helper/passwordHelper");
const bcrypt = require("bcryptjs");

const loginHelper = (userData) => {
  return new Promise(async (resolve, reject) => {
    let user = await userModel.findOne({ email: userData.email });
    let response = {};
    if (user) {
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
      }
    );

    resolve(result);
  });
};

const deleteAddress = (addressId, userId) => {
  return new Promise(async (resolve, reject) => {
    const result = await userModel.updateOne(
      { _id: userId },
      {
        $pull: { address: { _id: addressId } },
      }
    );

    if (result) {
      resolve(result);
    } else {
      reject(Error("Something went wrong"));
    }
  });
};

const updateUserDetails = (userId, userDetails) => {
  return new Promise(async (resolve, reject) => {
    const user = await userModel.findById(userId);

    let response = {};
    if (user) {
      if (user.isActive) {
        const success = await bcrypt.compare(
          userDetails.password,
          user.password
        );

        if (success) {
          if (userDetails.name) {
            user.name = userDetails.name;
          }
          if (userDetails.email) {
            user.email = userDetails.email;
          }
          if (userDetails.mobile) {
            user.mobile = userDetails.mobile;
          }
          if (
            userDetails.npassword &&
            userDetails.npassword === userDetails.cpassword
          ) {
            user.password = await bcrypt.hash(userDetails.npassword, 10);
          }
          await user.save();
          response.status = true;
          resolve(response);
        } else {
          response.message = "Incorrect Password";
          resolve(response);
        }
      }
    }
  });
};

const getWalletDetails = async (userId) => {
  return new Promise(async (resolve, reject) => {
    const result = await userModel.findOne({ _id: userId });

    if (result) {
      resolve(result);
    } else {
      console.log("not found");
    }
  });
};

const editAddress = async (body, addressId, userId) => {
  try {
    return new Promise(async(resolve, reject) => {
      const result = await userModel.findOne(
        { _id: userId, "address._id": addressId }
      );
      
      if (result) {
        const updateFields = {
          $set: {
            "address.$.name": body.name,
            "address.$.city": body.city,
            "address.$.state": body.state,
            "address.$.country": body.country,
            "address.$.pincode": body.postalCode
          }
        };
      
        const edited = await userModel.updateOne(
          { _id: userId, "address._id": addressId },
          updateFields
        );
      
        if (edited) {
         resolve({ status: true }) ;
        }
      }
    }) 
  } catch (error) {}
};

module.exports = {
  loginHelper,
  signupHelper,
  getAllUsers,
  addAddress,
  deleteAddress,
  updateUserDetails,
  getWalletDetails,
  editAddress,
};
