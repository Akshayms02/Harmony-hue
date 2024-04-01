const categoryHelper = require("../../helper/categoryHelper");
const cartHelper = require("../../helper/cartHelper");
const wishlistHelper = require("../../helper/wishlistHelper");
const productHelper = require("../../helper/productHelper");
const orderHelper = require("../../helper/orderHelper");
const offerHelper = require("../../helper/offerHelper");
const userModel = require("../../models/userModel");
const productModel = require("../../models/productModel");
const categoryModel = require("../../models/categoryModel");
const userHelper = require("../../helper/userHelper");
const bcrypt = require("bcrypt");
const moment = require("moment");

const loadUserHome = async (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  try {
    const userId = req.session.user;
    const categories = await categoryHelper.getAllcategory();

    let cartCount = await cartHelper.getCartCount(userId);

    let wishListCount = await wishlistHelper.getWishListCount(userId);

    let products = await productHelper.getAllActiveProducts();
    for (const product of products) {
      const cartStatus = await cartHelper.isAProductInCart(userId, product._id);
      const wishlistStatus = await wishlistHelper.isInWishlist(
        userId,
        product._id
      );

      // const offerPrice =
      //   product.productPrice -
      //   (product.productPrice * product.productDiscount) / 100;
      // product.discountedPrice = currencyFormatter(Math.round(offerPrice));
      product.cartStatus = cartStatus;
      product.wishlistStatus = wishlistStatus;
      // product.productPrice = currencyFormatter(product.productPrice);
    }
    const offerPrice = await offerHelper.findOffer(products);

    res.render("user/userHome", {
      products: offerPrice,
      userData: req.session.user,
      cartCount,
      wishListCount,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const shopLoad = async (req, res, next) => {
  try {
    if (req.query.search) {
      let payload = req.query.search.trim();
      let searchResult = await productModel
        .find({
          productName: { $regex: new RegExp("^" + payload + ".*", "i") },
        })
        .populate("productCategory")
        .exec();
      if (searchResult) {
        var sorted = true;
      }

      let userId = req.session.user;
      const categories = await categoryHelper.getAllActiveCategory();

      let cartCount = await cartHelper.getCartCount(userId);

      let wishListCount = await wishlistHelper.getWishListCount(userId);

      let products = await productHelper.getAllActiveProducts();
      for (const product of products) {
        const cartStatus = await cartHelper.isAProductInCart(
          userId,
          product._id
        );
        const wishlistStatus = await wishlistHelper.isInWishlist(
          userId,
          product._id
        );
      }
      const offerPrice = await offerHelper.findOffer(searchResult);

      let itemsPerPage = 6;
      let currentPage = parseInt(req.query.page) || 1;
      let startIndex = (currentPage - 1) * itemsPerPage;
      let endIndex = startIndex + itemsPerPage;
      let totalPages = Math.ceil(offerPrice.length / 6);
      console.log(totalPages);
      const currentProduct = offerPrice.slice(startIndex, endIndex);

      res.render("user/shop", {
        products: offerPrice,
        userData: req.session.user,
        cartCount,
        wishListCount,
        categories,
        sorted,
        totalPages,
        payload,
      });
    } else {
      let userId = req.session.user;

      const extractPrice = (price) => parseInt(price.replace(/[^\d]/g, ""));

      const categories = await categoryHelper.getAllcategory();

      let cartCount = await cartHelper.getCartCount(userId);

      let wishListCount = await wishlistHelper.getWishListCount(userId);

      let products = await productHelper.getAllActiveProducts();

      const offerPrice = await offerHelper.findOffer(products);
      let sorted = false;
      let normalSorted;

      if (req.query.filter) {
        if (req.query.filter == "Ascending") {
          console.log("inside ascending");
          offerPrice.sort(
            (a, b) => extractPrice(a.productPrice) - extractPrice(b.productPrice)
          );
          normalSorted="Ascending"
       
        } else if (req.query.filter == "Descending") {
          offerPrice.sort(
            (a, b) => extractPrice(b.productPrice) - extractPrice(a.productPrice)
          );
          normalSorted="Descending"
      
        } else if (req.query.filter == "Alpha") {
          offerPrice.sort((a, b) => {
            const nameA = a.productName.toUpperCase();
            const nameB = b.productName.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          normalSorted="Alpha"
        }
      }

      let itemsPerPage = 6;
      let currentPage = parseInt(req.query.page) || 1;
      let startIndex = (currentPage - 1) * itemsPerPage;
      let endIndex = startIndex + itemsPerPage;
      let totalPages = Math.ceil(offerPrice.length / 6);
      console.log(totalPages);
      const currentProduct = offerPrice.slice(startIndex, endIndex);

      res.render("user/shop", {
        products: currentProduct,
        userData: req.session.user,
        cartCount,
        wishListCount,
        categories,
        normalSorted,
        totalPages: totalPages,sorted,filter:req.query.filter
      });
    }
  } catch (error) {
    next(error);
  }
};

const shopFilterLoad = async (req, res, next) => {
  try {
    console.log("reached here");
    let filteredProducts;
    const extractPrice = (price) => parseInt(price.replace(/[^\d]/g, ""));
    const { search, category, sort, page, limit } = req.query;
    if (category) {
      let userId = req.session.user;
      var categories = await categoryHelper.getAllcategory();

      var cartCount = await cartHelper.getCartCount(userId);

      var wishListCount = await wishlistHelper.getWishListCount(userId);

      var products = await productHelper.getAllActiveProducts();
      console.log(products);

      let categorySortedProducts = await products.filter((product) => {
        return product.productCategory.toString().trim() == category.trim();
      });

      filteredProducts = await offerHelper.findOffer(categorySortedProducts);
      var sorted = false;
    }
    console.log(filteredProducts);
    if (sort) {
      if (sort == "Ascending") {
        console.log("inside ascending");
        filteredProducts.sort(
          (a, b) => extractPrice(a.productPrice) - extractPrice(b.productPrice)
        );
        sorted = "Ascending";
      } else if (sort == "Descending") {
        filteredProducts.sort(
          (a, b) => extractPrice(b.productPrice) - extractPrice(a.productPrice)
        );
        sorted = "Descending";
      } else if (sort == "Alpha") {
        filteredProducts.sort((a, b) => {
          const nameA = a.productName.toUpperCase();
          const nameB = b.productName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        sorted = "Alpha";
      }
    }
    console.log(filteredProducts);
    let itemsPerPage = 6;
    let currentPage = parseInt(req.query.page) || 1;
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let totalPages = Math.ceil(filteredProducts.length / 6);
    const currentProduct = filteredProducts.slice(startIndex, endIndex);
    res.json({
      products: currentProduct,
      totalPages,
      userData: req.session.user,
      cartCount,
      wishListCount,
      categories,
      sorted,
    });
  } catch (error) {
    next(error);
  }
};

const sortedProductsLoad = async (req, res, next) => {
  try {
    if (req.query.category) {
      const products = JSON.parse(req.body.products);
      const specifiedCategoryId = req.query.category;
      console.log(products, specifiedCategoryId);
      const categories = await categoryModel.find();

      const itemsWithSpecifiedCategory = products.filter((item) => {
        if (item.productCategory._id) {
          return (
            item.productCategory._id.toString() ===
            specifiedCategoryId.toString()
          );
        } else {
          return (
            item.productCategory.toString() === specifiedCategoryId.toString()
          );
        }
      });
      console.log(itemsWithSpecifiedCategory);
      for (const item of itemsWithSpecifiedCategory) {
        if (typeof item.productCategory === "string") {
          const category = categories.find(
            (element) => item.productCategory == element._id
          );
          console.log(category);
          item.productCategory = category;
        } else {
          continue;
        }
      }

      // console.log(itemsWithSpecifiedCategory);
      res.json({ products: itemsWithSpecifiedCategory });
    } else if (req.query.price) {
    } else if (req.query.category && req.query.price) {
    }
  } catch (error) {
    next(error);
  }
};

const userProfileLoad = async (req, res, next) => {
  try {
    const userId = req.session.user;
    const cartCount = await cartHelper.getCartCount(userId);
    const wishListCount = await wishlistHelper.getWishListCount(userId);
    const user = await userModel.findOne({ _id: userId });
    const walletData = await userHelper.getWalletDetails(userId);

    for (const amount of walletData.wallet.details) {
      amount.formattedDate = moment(amount.date).format("MMM Do, YYYY");
    }

    const orderDetails = await orderHelper.getOrderDetails(userId);
    for (const order of orderDetails) {
      const dateString = order.orderedOn;
      order.formattedDate = moment(dateString).format("MMMM Do, YYYY");
      order.formattedTotal = currencyFormatter(order.totalAmount);
      let quantity = 0;
      for (const product of order.products) {
        quantity += Number(product.quantity);
      }
      order.quantity = quantity;
      quantity = 0;
    }

    const message = req.flash("message");
    if (user) {
      res.render("user/userProfile", {
        userData: user,
        orderDetails,
        cartCount,
        wishListCount,
        walletData,
        message,
      });
    }
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const body = req.body;
    const userId = req.session.user;
    const result = await userHelper.addAddress(body, userId);
    if (result) {
      res.json({ status: true });
    }
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const addressId = req.params.id;

    const userId = req.session.user;

    const result = await userHelper.deleteAddress(addressId, userId);
    if (result) {
      res.json({ status: true });
    }
  } catch (error) {
    next(error);
  }
};

const updateUserDetails = async (req, res, next) => {
  try {
    const userId = req.session.user;
    const userDetails = req.body;

    const result = await userHelper.updateUserDetails(userId, userDetails);

    if (result.status) {
      res.json({ status: true });
    } else {
      res.json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
};

const forgotPasswordLoad = (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.render("user/forgotPasswordPage");
};

const forgotPasswordChange = async (req, res) => {
  await passwordHelper
    .forgotPassword(req.body.password, req.body.email)
    .then((response) => {})
    .catch((error) => {
      console.log(error);
    });
  req.flash("message", "Your password has been changed");
  res.redirect("/");
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, npassword, cpassword } = req.body;
    const userId = req.session.user;
    const user = await userModel.findOne({ _id: userId });
    console.log(currentPassword);
    if (await bcrypt.compare(currentPassword, user.password)) {
      const newPassword = await bcrypt.hash(npassword, 10);
      user.password = newPassword;
      await user.save();
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    next(error);
  }
};

const priceSort = async (req, res, next) => {
  try {
    const filter = req.params.value;
    const products = JSON.parse(req.body.products);
    console.log(products);
    const extractPrice = (price) => parseInt(price.replace(/[^\d]/g, ""));
    if (filter.toString() === "Ascending") {
      products.sort(
        (a, b) => extractPrice(a.productPrice) - extractPrice(b.productPrice)
      );
    } else {
      products.sort(
        (a, b) => extractPrice(b.productPrice) - extractPrice(a.productPrice)
      );
    }
    const categories = await categoryModel.find();
    for (const item of products) {
      if (typeof item.productCategory === "string") {
        const category = categories.find(
          (element) => item.productCategory == element._id
        );
        console.log(category);
        item.productCategory = category;
      } else {
        continue;
      }
    }
    res.json({ products: products });
  } catch (error) {
    next(error);
  }
};

const alphaSorter = async (req, res, next) => {
  try {
    const products = JSON.parse(req.body.products);
    products.sort((a, b) => {
      const nameA = a.productName.toUpperCase();
      const nameB = b.productName.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    const categories = await categoryModel.find();
    for (const item of products) {
      if (typeof item.productCategory === "string") {
        const category = categories.find(
          (element) => item.productCategory == element._id
        );
        console.log(category);
        item.productCategory = category;
      } else {
        continue;
      }
    }

    res.json({ products: products });
  } catch (error) {
    next(error);
  }
};

const editAddressLoad = async (req, res, next) => {
  try {
    console.log("entered");
    const addressId = req.params.id;
    const userId = req.session.user;

    const result = await userModel.findOne(
      { _id: userId, "address._id": addressId },
      {
        "address.$": 1,
      }
    );
    console.log(result);
    if (result) {
      res.json({ addressData: result, status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    next(error);
  }
};

const editAddress = async (req, res, next) => {
  try {
    console.log("entered6yhtyhur");
    const userId = req.session.user;
    const addressId = req.body.addressId;
    const result = await userHelper.editAddress(req.body, addressId, userId);
    console.log(result);
    if (result.status) {
      req.flash("message", "Address Edited");
      res.redirect("/profile");
    }
  } catch (error) {
    next(error);
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
  loadUserHome,
  shopLoad,
  userProfileLoad,
  addAddress,
  deleteAddress,
  updateUserDetails,
  changePassword,
  forgotPasswordLoad,
  forgotPasswordChange,
  sortedProductsLoad,
  priceSort,
  alphaSorter,
  editAddressLoad,
  editAddress,
  shopFilterLoad,
};
