const couponHelper=require("../../helper/couponHelper")

const couponListLoad = async (req, res) => {
  try {
    let allCoupons = await couponHelper.findAllCoupons();

    for (let i = 0; i < allCoupons.length; i++) {
      allCoupons[i].discount = currencyFormatter(allCoupons[i].discount);
      allCoupons[i].expiryDate = dateFormatter(allCoupons[i].expiryDate);
    }

    res.render("admin/couponlist", {
      coupons: allCoupons,
    });
  } catch (error) {
    console.log(error)
  }
};

const addCoupon = async (req, res) => {
  try {
    const coupon = await couponHelper.addCoupon(req.body);
    res.redirect("/admin/coupons");
  } catch (error) {
  console.log(error);
  }
};

const getEditCoupon = async (req, res) => {
  try {
    const couponData = await couponHelper.getCouponData(req.params.id);

    couponData.expiryDate = dateFormatter(couponData.expiryDate);

    res.json({ couponData });
  } catch (error) {
    console.log(error);
  }
};

const editCoupon = async (req, res) => {
  try {
    let editedCoupon = await couponHelper.editTheCouponDetails(req.body);

    res.redirect("/admin/coupons");
  } catch (error) {
    console.log(error);
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const result = await couponHelper.deleteSelectedCoupon(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    console.log(error);
  }
};

function currencyFormatter(amount) {
  return Number(amount).toLocaleString("en-in", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });
}

function dateFormatter(date) {
  return date.toISOString().slice(0, 10);
}


module.exports = {
  couponListLoad,deleteCoupon,editCoupon,addCoupon,getEditCoupon,
}