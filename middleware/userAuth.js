const isLogin = (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/userHome");
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

const isLogout = (req, res, next) => {
  try {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

const otpAuthenticator = (req, res, next) => {
  
  if (Date.now() >= req.session.otpExpirationTime) {
    res.redirect(`/verify?message=${"Invalid OTP"}`);
  } else {
    next();
  }
}

module.exports = {
  isLogin,isLogout,otpAuthenticator
};
