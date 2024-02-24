const couponHelper = require("../../helper/couponHelper");

const applyCoupon = async (req, res) => {
  try {

    const userId = req.session.user;
    const couponCode = req.body.couponCode;

    const result = await couponHelper.applyCoupon(userId, couponCode);
    
    console.log(result)
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  applyCoupon,
};
