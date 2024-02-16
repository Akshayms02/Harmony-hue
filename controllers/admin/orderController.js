const orderHelper = require("../../helper/orderHelper");
const userModel = require("../../models/userModel");
const moment = require("moment");

const adminOrderPageLoad = async (req, res) => {
  try {
    const allOrders = await orderHelper.getAllOrders();
    for (const order of allOrders) {
      const dateString = order.orderedOn;
      order.formattedDate = moment(dateString).format("MMMM Do, YYYY");
    }

    res.render("admin/orderList", { allOrders });
  } catch (error) {
    console.log(error);
  }
};

const changeOrderStatus = async (req, res, next) => {
  try {
    const response = await orderHelper.changeOrderStatus(
      req.body.orderId,
      req.body.status
    );
    res.json({
      error: false,
      message: "order status updated",
      status: response.orderStatus,
    });
  } catch (error) {
    return next(error);
  }
};

const changeOrderStatusOfEachProduct = async (req, res) => {
  const orderId = req.params.orderId;
  const productId = req.params.productId;
  const status = req.body.status;
  const result = await orderHelper.changeOrderStatusOfEachProduct(orderId, productId, status);
  if (result) {
    res.json({ status: true });

  } else {
    res.json({status:false})
  }
};

const orderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
   
    const productDetails = await orderHelper.getOrderDetailsOfEachProduct(
      orderId
    );
    const user = await userModel.findOne({ _id: productDetails[0].user });
    for (const product of productDetails) {
      const dateString = product.orderedOn;
      product.formattedDate = moment(dateString).format("MMMM Do, YYYY");
      product.formattedTotal = currencyFormatter(product.totalAmount);
      product.products.formattedProductPrice = currencyFormatter(
        product.products.productPrice
      );
    }

    if (orderDetails && productDetails) {
      res.render("admin/orderDetails", { orderDetails, productDetails, user });
    }
    console.log(productDetails);
  } catch (error) {
    console.log(error);
  }
};

const currencyFormatter = (amount) => {
  return Number(amount).toLocaleString("en-in", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });
};

module.exports = {
  changeOrderStatus,
  adminOrderPageLoad,
  orderDetails,
  changeOrderStatusOfEachProduct,
};
