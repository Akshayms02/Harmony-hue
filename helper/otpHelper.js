const nodemailer = require("nodemailer");
const userModel = require("../models/userModel");
const twilio = require("twilio");

const otpGenerator = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer OTP verification Auth-start
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ratedr12345678910@gmail.com",
    pass: "jwpu ddgw puss fsnh",
  },
});

//Nodemailer OTP verification Auth-End

const accountSid = "AC4b43fa74b607a2e8dcd0a16a216074dd";
const authToken = "a4d1f93b99cdc17ac61ba194dd6ed2ff";
const twilioPhoneNumber = "+14432963010";
const client = twilio(accountSid, authToken);

// Function to send an SMS using Twilio
const sendSMS = (toPhoneNumber, message) => {
  client.messages
    .create({
      body: message,
      from: twilioPhoneNumber,
      to: toPhoneNumber,
    })
    .then((message) => console.log(`SMS sent: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error.message}`));
};
//Twilio Mobile OTP verification function-end

const otpSender = (userData) => {
  const otp = otpGenerator();
  const otpCreationTimer = Date.now();
  console.log(otp);
  return new Promise((resolve, reject) => {

    let response = {};
    response.user = userData;
    response.otp = otp;
    response.otpTimer = otpCreationTimer+90*1000;
    //Sending SMS through Twilio
    const toEmail = userData.email;
    const toMobile = userData.mobile;
    const recipientPhoneNumber = `+91${toMobile}`;
    sendSMS(recipientPhoneNumber, otp);

    // Sending mail through Nodemailer
    const mailOptions = {
      from: "ratedr@12345678910@gmail.com",
      to: toEmail,
      subject: "Your OTP",
      text: `Your one-time password (OTP) is: ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });

    resolve(response);
  });
};

module.exports = {
  otpSender,
};
