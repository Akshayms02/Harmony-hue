const cartHelper = require("../../helper/cartHelper");
const wishlistHelper = require("../../helper/wishlistHelper");

const productModel = require("../../models/productModel");

const productViewLoad = async (req, res) => {
  const id = req.params.id;
  const userData = req.session.user;

  let cartCount = await cartHelper.getCartCount(userData);

  let wishListCount = await wishlistHelper.getWishListCount(userData);

  const product = await productModel
    .findById({ _id: id })
    .populate("productCategory")
    .lean();

  const cartStatus = await cartHelper.isAProductInCart(userData, product._id);

  const wishlistStatus = await wishlistHelper.isInWishlist(
    userData,
    product._id
  );
  const offerPrice =
    product.productPrice -
    (product.productPrice * product.productDiscount) / 100;
  product.cartStatus = cartStatus;
  product.wishlistStatus = wishlistStatus;
  product.discountedPrice = currencyFormatter(Math.round(offerPrice));
  product.productPrice = currencyFormatter(product.productPrice);

  res.render("user/viewProduct", {
    product,
    cartCount,
    wishListCount,
    userData,
  });
};

const addToCart = async (req, res) => {
  const userId = req.session.user;

  const productId = req.params.id;
  const size = req.params.size;

  const result = await cartHelper.addToCart(userId, productId, size);

  if (result) {
    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
};

const searchProduct = async (req, res, next) => {
  let payload = req.body.payload.trim();
  try {
    let searchResult = await productModel
      .find({ productName: { $regex: new RegExp("^" + payload + ".*", "i") } })
      .exec();
    searchResult = searchResult.slice(0, 5);
    res.json({ searchResult });
  } catch (error) {
    // res.status(500).render("error", { error, layout: false });
    console.log(error)
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
  productViewLoad,addToCart,searchProduct,
};
