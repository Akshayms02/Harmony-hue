const cartHelper = require("../../helper/cartHelper");
const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel");
const wishlistHelper = require("../../helper/wishlistHelper");
const offerHelper = require("../../helper/offerHelper");
const ObjectId = require("mongoose").Types.ObjectId;

const userCartLoad = async (req, res) => {
  try {
    const userData = req.session.user;

    const cartItems = await cartHelper.getAllCartItems(userData);

    const offerPrice = await offerHelper.findOfferInCart(cartItems);

    console.log(offerPrice);

    const cartCount = await cartHelper.getCartCount(userData);

    const wishListCount = await wishlistHelper.getWishListCount(userData);

    const ifCouponAppliedInCart = await cartHelper.clearCoupon(userData);

    let totalandSubTotal = await cartHelper.totalSubtotal(userData, cartItems);

    let totalAmountOfEachProduct = [];
    for (i = 0; i < cartItems.length; i++) {
      let total =
        cartItems[i].quantity * parseInt(cartItems[i].product.offerPrice);
      // total = currencyFormatter(total);
      totalAmountOfEachProduct.push(total);
    }

    // totalandSubTotal = currencyFormatter(totalandSubTotal);
    // for (i = 0; i < cartItems.length; i++) {
    //   cartItems[i].product.productPrice = currencyFormatter(
    //     cartItems[i].product.productPrice
    //   );
    // }
    console.log(cartItems);

    res.render("user/userCart", {
      userData: req.session.user,
      cartItems: offerPrice,
      cartCount,
      wishListCount,
      totalAmount: totalandSubTotal,
      totalAmountOfEachProduct,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateCartQuantity = async (req, res) => {
  const productId = req.query.productId;
  const quantity = req.query.quantity;
  const userId = req.session.user;
  const product = await productModel.findOne({ _id: productId }).lean();
  const update = await cartHelper.incDecProductQuantity(
    userId,
    productId,
    quantity
  );
  const offerForProduct = await offerHelper.offerCheckForProduct(product);
  
  const cartItems = await cartHelper.getAllCartItems(userId);
  const offerPrice = await offerHelper.findOfferInCart(cartItems);
  // console.log(offerPrice);

  if (update.status) {
    const cart = await cartModel.aggregate([
      { $unwind: "$products" },
      {
        $match: {
          user: new ObjectId(userId),
          "products.productItemId": new ObjectId(productId),
        },
      },
    ]);
    console.log(offerForProduct)
    console.log(cart);
    if (offerPrice) {
      cart[0].products.totalPrice = currencyFormatter(parseInt(offerForProduct.offerPrice)*parseInt(cart[0].products.quantity));
    } else {
      cart[0].products.totalPrice = currencyFormatter(
        Math.round(update.price - (update.price * update.discount) / 100) *
          cart[0].products.quantity
      );
    }

    const totalSubtotal = await cartHelper.totalSubtotal(userId, cartItems);
    console.log(totalSubtotal);
    console.log(cart);

    res.json({
      status: true,
      message: update.message,
      cartDetails: cart,
      totalSubtotal,
    });
  } else {
    res.json({ status: false, message: update.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const userId = req.session.user;
    const productId = req.params.id;

    const result = await cartHelper.removeItemFromCart(userId, productId);

    if (result) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
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
  userCartLoad,
  updateCartQuantity,
  removeCartItem,
};
