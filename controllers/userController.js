const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const securePassword = async (password) => {
  try {
    const sPassword = await bcrypt.hash(password, 10);
    return sPassword;
  } catch (error) {
    console.log(error);
  }
};

const registerLoad = (req, res) => {
  if (req.session.user) {
    res.redirect("/userhome");
  } else if (req.session.admin) {
    res.redirect("/adminhome");
  } else {
    res.render("user/register");
  }
};

const loginLoad = (req, res) => {
  if (req.session.user) {
    res.redirect("/userhome");
  } else if (req.session.admin) {
    res.redirect("/adminhome");
  } else {
    res.render("user/login");
  }
};

const insertUser = async (req, res) => {
  try {
    const sPassword = await securePassword(req.body.password);
    console.log("data entered");
    const userIn = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: sPassword,
      isAdmin: 0,
    };
    const result = await userModel.create(userIn);
    console.log("data stored");
  } catch (error) {
    console.log(error);
  }
};

const logUser = async (req, res) => {
  const logEmail = req.body.email;
  const logPass = req.body.password;
  try {
    const loggedUser = await userModel.findOne({
      email: logEmail,
    });
    if (loggedUser) {
      const sPassword = await bcrypt.compare(logPass, loggedUser.password);
      if (sPassword) {
        if (loggedUser.isAdmin === 1) {
          req.session.admin = loggedUser._id;
          res.redirect("/admin/verify");
        } else {
          req.session.user = loggedUser._id;
          res.redirect("/user/verify");
        }
      } else {
        // res.render("login", { errorMessage: "Invalid Password" });
        res.send("Invalid password");
      }
    } else {
      // res.render("login", { errorMessage: "Login Failed" });
      res.send("login failed");
    }
  } catch (error) {
    console.log(error);
  }
};

const loadUserHome = async (req, res) => {
  if (req.session.user) {
    // const userData = await userModel.findOne({ _id: req.session.user });
    // res.render("userHome", { user: userData });
    res.send("Hello welcome");
  }
};

const verifyUserLoad = (req, res) => {
  req.session.otp = 123456;
  res.render("user/verifyOtp");
};

const verifiedLogUser = async (req, res) => {
  console.log("entered")
  const { otp } = await req.body;
  console.log(otp);
  if (otp === req.session.otp) {
    // res.redirect('/user/userhome');
    res.send("Verified");
  }
};

module.exports = {
  loginLoad,
  registerLoad,
  insertUser,
  logUser,
  loadUserHome,
  verifyUserLoad,
  verifiedLogUser,
};
