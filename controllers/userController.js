const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const twilio = require("twilio");
const nodemailer = require("nodemailer");
const otpHelper = require("../helper/otpHelper");
const passwordHelper = require("../helper/passwordHelper");
const userHelper = require("../helper/userHelper");

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
    res.redirect("/admin");
  } else {
    const message = req.flash("message");
    res.render("user/login", { message });
  }
};

const signUpUser = async (req, res) => {
  try {
    const response = await userHelper.signupHelper(req.body);
    if (!response.userExist) {
      req.flash("message", "Registration Successful. Continue to login");
      res.redirect("/");
    } else {
      req.flash("message", "You are an existing user. Please log in.");

      res.redirect("/");
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
        res.render("user/login", { errorMessage: response.errorMessage });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
//   const { email } = req.body;
//   req.session.email = email;
//   const logEmail = req.body.email;
//   const logPass = req.body.password;
//   try {
//     const loggedUser = await userModel.findOne({
//       email: logEmail,
//     });
//     if (loggedUser) {
//       const sPassword = await bcrypt.compare(logPass, loggedUser.password);
//       if (sPassword) {
//         if (loggedUser.isAdmin === 1) {
//           req.session.admin = loggedUser._id;
//           res.redirect("/admin");
//         } else {
//           res.redirect("/verify");
//         }
//       } else {
//         // res.render("login", { errorMessage: "Invalid Password" });
//         res.send("Invalid password");
//       }
//     } else {
//       // res.render("login", { errorMessage: "Login Failed" });
//       res.send("login failed");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const loadUserHome = async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  if (req.session.user) {
    // const userData = await userModel.findOne({ _id: req.session.user });
    // res.render("userHome", { user: userData });
    res.render("user/userHome");
  } else {
    res.redirect("/");
  }
};

const verifyUserLoad = async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  if (req.query.message) {
    res.render("user/verifyOtp", { message: req.query.message });
  } else {
    //Generating OTP
    const messageToSend = otpGenerator.otpGenerator;
    console.log(messageToSend);

    req.session.otp = messageToSend;
    req.session.otpExpirationTime = Date.now() + 20 * 1000;
    setTimeout(() => {
      req.session.otp = null;
      console.log("OTP Expired");
    }, 20 * 1000);
    console.log("OTP Created");

    const userData = await userModel.findOne({ email: req.session.email });
    const toEmail = userData.email;
    const toMobile = userData.mobile;
    const recipientPhoneNumber = `+91${toMobile}`;

    //Sending OTP to Mobile Number using Twilio
    sendSMS(recipientPhoneNumber, messageToSend);

    //Setting the mail options
    const mailOptions = {
      from: "ratedr@12345678910@gmail.com",
      to: toEmail,
      subject: "Your OTP",
      text: `Your one-time password (OTP) is: ${messageToSend}`,
    };
    // Sending OTP to the user's mail ID
    otpHelper.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });
    res.render("user/verifyOtp");
  }
};

const verifiedLogUser = async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  const otp = await req.body.otp;
  if (otp === req.session.otp) {
    console.log("entered");
    const userData = await userModel.findOne({ email: req.session.email });
    req.session.user = userData._id;
    res.redirect("/userHome");
  } else {
    // res.render("user/verifyOtp", { message: "Invalid OTP" });
    res.redirect(`/verify?message=${"Invalid OTP"}`);
  }
};

module.exports = {
  loginLoad,
  registerLoad,
  signUpUser,
  logUser,
  loadUserHome,
  verifyUserLoad,
  verifiedLogUser,
};
