const cartHelper = require("../../helper/cartHelper");
const wishlistHelper = require("../../helper/wishlistHelper");


const wishListLoad = async (req, res) => {
  try {
    const userData = req.session.user;

    const cartCount = await cartHelper.getCartCount(userData);

    const wishListCount = await wishlistHelper.getWishListCount(userData);

    const wishListItems = await wishlistHelper.getAllWishlistProducts(userData);

    res.render("user/userWishlist", {
      userData: req.session.user,
      cartCount,
      wishListCount,
      wishListItems,
    });
  } catch (error) {
    console.log(error);
  }
};

const addToWishlist = async (req, res) => {
  const userId = req.session.user;
  const productId = req.params.id;

  const result = await wishlistHelper.addToWishlist(userId, productId);
  if (result) {
    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
};

module.exports = {
  wishListLoad,addToWishlist,
}