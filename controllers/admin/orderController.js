const orderHelper = require("../../helper/orderHelper");
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
const orderDetails = async(req, res) => {
  try {
    const orderId = req.params.id;
    const orderDetails = await orderHelper.getSingleOrderDetails(orderId);
    const productDetails = await orderHelper.getOrderDetailsOfEachProduct(orderId);

    if (orderDetails && productDetails) {
      res.render("admin/orderDetails", { orderDetails, productDetails });
    }
    console.log(productDetails)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  changeOrderStatus,adminOrderPageLoad,orderDetails
}