const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const otpGenerator=require('../helper/otpGenerator')

// Nodemailer OTP verification Auth-start
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ratedr12345678910@gmail.com",
    pass: "jwpu ddgw puss fsnh",
  },
});

//Nodemailer OTP verification Auth-End

//Twilio Mobile OTP verification function-start

// Twilio credentials from your Twilio account
const accountSid = "AC4b43fa74b607a2e8dcd0a16a216074dd";
const authToken = "a4d1f93b99cdc17ac61ba194dd6ed2ff";
const twilioPhoneNumber = "+14432963010";
const client = twilio(accountSid, authToken);

// Function to send an SMS using Twilio
function sendSMS(toPhoneNumber, message) {
  client.messages
    .create({
      body: message,
      from: twilioPhoneNumber,
      to: toPhoneNumber,
    })
    .then((message) => console.log(`SMS sent: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error.message}`));
}
//Twilio Mobile OTP verification function-end

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
  const { email } = req.body;
  req.session.email = email;
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
          // req.session.admin = loggedUser._id;
          res.redirect("/verify");
        } else {
          res.redirect("/verify");
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
    res.render("user/userHome");
  }
  else {
    res.redirect('/')
  }
};

const verifyUserLoad = async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  if (req.query.message) {
    res.render("user/verifyOtp", { message: req.query.message });
  } else {
    const message = otpGenerator.otpGenerator
    console.log(message);
    const messageToSend = message;
    req.session.otp = messageToSend;
    setTimeout(() => {
      console.log("OTP Expired" + req.session.otp);
      req.session.destroy()
      if (req.session)
      {
      console.log(req.session.otp)
        }
    }, 20000);

    const userData = await userModel.findOne({ email: req.session.email });
    const toEmail = userData.email;
    const toMobile = userData.mobile;
    const recipientPhoneNumber = `+91${toMobile}`;

    const mailOptions = {
      from: "ratedr@12345678910@gmail.com",
      to: toEmail,
      subject: "Your OTP",
      text: `Your one-time password (OTP) is: ${messageToSend}`,
    };
    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });
    sendSMS(recipientPhoneNumber, messageToSend);

    res.render("user/verifyOtp");
  }
};

const verifiedLogUser = async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  const otp = await req.body.otp;
  if (otp === req.session.otp) {
    console.log("entered");
    const userData = await userModel.findOne({ email: req.session.email });
    req.session.user = userData._id;
    res.redirect("/userHome");
  } else {
    // res.render("user/verifyOtp", { message: "Invalid OTP" });
    res.redirect(`/user/verify?message=${"Invalid OTP"}`);
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
