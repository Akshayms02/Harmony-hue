const couponHelper = require("../../helper/couponHelper");

const applyCoupon = async (req, res) => {
  try {
    const price = parseInt(req.query.price);
    const userId = req.session.user;
    const couponCode = req.body.couponCode;
    if (price > 1500) {
      const result = await couponHelper.applyCoupon(userId, couponCode);
      console.log(result);
      if (result.status) {
        res.json({ result:result,status:true,message:"Coupon Applied Successfuly" }); 
      } else {
        res.json({ result:result,status:true,message:result.message }); 
      }
  
    } else {
      res.json({ message: "Please purchase for 1500 above to apply coupon" ,status:false});
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  applyCoupon,
};
