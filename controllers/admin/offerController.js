const offerHelper = require("../../helper/offerHelper");
const productHelper = require("../../helper/productHelper");

const productOfferLoad = async (req, res) => {
  try {
    const offers = await offerHelper.getAllOffersOfProducts();
    const products = await productHelper.getAllProducts();
    const message = req.flash("message");
    if (message.length > 0) {
      console.log(message);
      res.render("admin/productOfferManagement", { offers, products, message });
    } else {
      res.render("admin/productOfferManagement", { offers, products });
    }
  } catch (error) {
    console.log(error);
  }
};

const productAddOffer = async (req, res) => {
  try {
    const offer = await offerHelper.productCreateOffer(req.body);
    if (offer) {
      req.flash("message", "Offer Added");
      res.redirect("/admin/productOffers");
    }
  } catch (error) {
    console.log(error);
  }
};

const productEditLoad = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const response = await offerHelper.getOfferDetails(id);
    if (response) {
      res.json(response);
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const productEditOffer = async (req, res) => {
  try {
    const result = await offerHelper.productEditOffer(req.body);
    if (result) {
      req.flash("message", "Offer edited");
      res.redirect("/admin/productOffers");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  productOfferLoad,
  productAddOffer,
  productEditOffer,
  productEditLoad,
};
