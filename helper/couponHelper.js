const couponModel = require("../models/couponModel");
const cartModel = require("../models/cartModel");
const voucherCode = require("voucher-code-generator");
const ObjectId = require("mongoose").Types.ObjectId;
const moment=require("moment")

const addCoupon = (couponData) => {
  return new Promise(async (resolve, reject) => {
   
    const dateString = couponData.couponExpiry;
    // const [day, month, year] = dateString.split(/[-/]/);

    // const paddedMonth = month.padStart(2, "0");
    // const paddedDay = day.padStart(2, "0");

    // const dateString = new Date(`${year}-${paddedMonth}-${paddedDay}`);
    const date = moment(dateString, 'YYYY-MM-DD');
    const convertedDate = date.toISOString();

    let couponCode = voucherCode.generate({
      length: 6,
      count: 1,
      charset: voucherCode.charset("alphabetic"),
    });

    const coupon = new couponModel({
      couponName: couponData.couponName,
      code: couponCode[0],
      discount: couponData.couponAmount,
      expiryDate: convertedDate,
    });

    await coupon
      .save()
      .then(() => {
        resolve(coupon._id);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const findAllCoupons = () => {
  return new Promise(async (resolve, reject) => {
    await couponModel
      .find()
      .lean()
      .then((result) => {
        resolve(result);
      });
  });
};

const getCouponData = (couponId) => {
  return new Promise(async (resolve, reject) => {
    await couponModel
      .findOne({ _id: couponId })
      .lean()
      .then((result) => {
        resolve(result);
      });
  });
};

const editTheCouponDetails = (editedCouponData) => {
  return new Promise(async (resolve, reject) => {
    let coupon = await couponModel.findById({
      _id: editedCouponData.couponId,
    });
    coupon.couponName = editedCouponData.couponName;
    coupon.discount = editedCouponData.couponAmount;
    coupon.expiryDate = editedCouponData.couponExpiry;

    await coupon.save();
    resolve(coupon);
  });
};

const deleteSelectedCoupon = (couponId) => {
  return new Promise(async (resolve, reject) => {
    let result = await couponModel.findOneAndDelete({ _id: couponId });
    resolve(result);
  });
};

const  applyCoupon = (userId, couponCode) => {
  return new Promise(async (resolve, reject) => {
    let coupon = await couponModel.findOne({ code: couponCode })
    if (coupon && coupon.isActive === "Active") {
      if (!coupon.usedBy.includes(userId)) {
        let cart = await cartModel.findOne({ user: new ObjectId(userId)});
        console.log(cart)
        const discount = coupon.discount;

        cart.totalAmount = cart.totalAmount - discount;
        cart.coupon = couponCode;

        await cart.save();
        console.log(cart)

        coupon.usedBy.push(userId);
        await coupon.save();

        resolve({
          discount,
          cart,
          status: true,
          message: "Coupon applied successfully",
        });
      } else {
        resolve({ status: false, message: "This coupon is already used" });
      }
    } else {
      resolve({ status: false, message: "Invalid Coupon code" });
    }
  });
};

module.exports = {
  addCoupon,
  findAllCoupons,
  getCouponData,
  editTheCouponDetails,
  deleteSelectedCoupon,
  applyCoupon,
};
