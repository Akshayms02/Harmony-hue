const nodemailer = require("nodemailer");

const otpGenerator = Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer OTP verification Auth-start
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ratedr12345678910@gmail.com",
    pass: "jwpu ddgw puss fsnh",
  },
});

//Nodemailer OTP verification Auth-End

module.exports = {
  otpGenerator,
  transporter,
};
