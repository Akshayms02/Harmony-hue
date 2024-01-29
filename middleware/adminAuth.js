const isLogin = (req, res, next) => {
  try {
    if (req.session.admin) {
      res.redirect("/admin/adminhome");
     
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

const isLogout = (req,res,next) => {
  try {
    if (req.session.admin) {
      next();
    } 
    else {
      res.redirect("/admin");
    }
  }
  catch (error) {
    console.log(error)
  }
}

module.exports = {
  isLogin,isLogout,
}