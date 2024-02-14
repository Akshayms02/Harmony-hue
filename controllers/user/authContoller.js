const userHelper = require("../../helper/userHelper");
const userModel = require("../../models/userModel");
const otpHelper = require("../../helper/otpHelper");

const loginLoad = (req, res) => {
  res.setHeader(
    "Cache-control",
    "no-store, no-cache, must-revalidate, private"
  );
  if (req.session.user) {
    res.redirect("/userhome");
  } else {
    const message = req.flash("message");
    res.render("user/login", { message });
  }
};

const logUser = async (req, res) => {
  await userHelper
    .loginHelper(req.body)
    .then((response) => {
      if (response.loggedIn) {
        if (response.user) {
          req.session.user = response.user;
          console.log("user session created");
          res.redirect("/userHome");
        } else {
          req.flash("message", response.errorMessage);
          res.redirect("/");
        }
      } else {
        req.flash("message", response.errorMessage);
        res.redirect("/");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const userLogout = (req, res) => {
  try {
    res.setHeader("Cache-control", "no-cache", "no-store", "must-revalidate");

    if (req.session.user) {
      delete req.session.user;
      req.flash("message", "Logged out succesfully");
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

const registerLoad = (req, res) => {
  res.setHeader(
    "Cache-control",
    "no-store, no-cache, must-revalidate, private"
  );

  if (req.session.user) {
    res.redirect("/userhome");
  } else {
    res.render("user/register");
  }
};

const signUpUser = async (req, res) => {
  try {
    console.log(req.session.otp, req.body.otp,req.session.otpExpiryTime);
    if (req.session.otp === req.body.otp) {
      const response = await userHelper.signupHelper(req.session.userData);
      if (!response.userExist) {
        req.flash("message", "Registration Successful. Continue to login");
        delete req.session.userData;
        req.session.registered = "Registered";
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

const resendOtp = (req, res) => {
  try {
    const userData = req.session.userData;
    delete req.session.otpExpiryTime;
    delete req.session.otp;
    otpHelper
      .otpSender(userData)
      .then((response) => {
        console.log(response);
        req.session.otpExpiryTime = response.otpTimer;
        req.session.userData = response.user;
        req.session.otp = response.otp;
        req.session.save()
      })
      .catch((error) => {
        console.log(error);
      });
    res.json({ status: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginLoad,
  logUser,
  userLogout,
  registerLoad,
  signUpUser,
  sendOtp,
  verifySignUpLoad,
  resendOtp,
};
