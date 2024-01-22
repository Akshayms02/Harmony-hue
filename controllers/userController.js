const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const otpHelper = require("../helper/otpHelper");
const passwordHelper = require("../helper/passwordHelper");
const userHelper = require("../helper/userHelper");

const registerLoad = (req, res) => {
  if (req.session.user) {
    res.redirect("/userhome");
  } else if (req.session.admin) {
    res.redirect("/admin");
  } else {
    res.render("user/register");
  }
};

const loginLoad = (req, res) => {
  if (req.session.user) {
    res.redirect("/userhome");
  } else if (req.session.admin) {
    res.redirect("/admin");
  } else {
    const message = req.flash("message");
    res.render("user/login", { message });
  }
};

const signUpUser = async (req, res) => {
  try {
    if (req.session.otp === req.body.otp) {
      const response = await userHelper.signupHelper(req.session.userData);
      if (!response.userExist) {
        req.flash("message", "Registration Successful. Continue to login");
        res.redirect("/");
      } else {
        req.flash("message", "You are an existing user. Please log in.");

        res.redirect("/");
      }
    } else {
      res.redirect(`/verify?message=${"Invalid OTP"}`);
    }
  } catch (error) {
    console.log(error);
    res.redirect("/register");
  }
};

const logUser = async (req, res) => {
  await userHelper
    .loginHelper(req.body)
    .then((response) => {
      if (response.loggedIn) {
        if (response.user.isAdmin === 1) {
          req.session.admin = response.user._id;
          res.redirect("/admin");
        } else {
          req.session.user = response.user._id;
          res.redirect("/userHome");
        }
      } else {
        req.flash('message',response.errorMessage)
        res.redirect('/');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const loadUserHome = async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  if (req.session.user) {
    const userData = await userModel.findOne({ _id: req.session.user });
    res.render("user/userHome", { user: userData });

  } else {
    res.redirect("/");
  }
};

const sendOtp = async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  const userData = req.body;
  await otpHelper
    .otpSender(userData)
    .then((response) => {
      req.session.otpExpiryTime = response.otpTimer;
      req.session.userData = response.user;
      req.session.otp = response.otp;
    })
    .catch((error) => {
      console.log(error);
    });
  res.redirect("/verify");
};

const verifySignUpLoad = (req, res) => {
  if (req.query.message) {
    res.render("user/verifyOtp", { message: req.query.message });
  } else {
    res.render("user/verifyOtp");
  }
};

const forgotPasswordLoad = (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.render("user/forgotPasswordPage");
};

const forgotPasswordChange = async (req, res) => {
  await passwordHelper
    .forgotPassword(req.body.password, req.body.email)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  req.flash("message", "Your password has been changed");
  res.redirect("/");
};

module.exports = {
  loginLoad,
  registerLoad,
  signUpUser,
  logUser,
  loadUserHome,
  forgotPasswordLoad,
  forgotPasswordChange,
  sendOtp,
  verifySignUpLoad,
 
};
