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
  
  if (Date.now() >= req.session.otpExpiryTime) {
    res.redirect(`/verify?message=${"Invalid OTP"}`);
  } else {
    next();
  }
}

const isRegistered = (req, res, next) => {
  if (req.session.registered) {
    delete req.session.registered;
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = {
  isLogin,isLogout,otpAuthenticator,isRegistered,
};
