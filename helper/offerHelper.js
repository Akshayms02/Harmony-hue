const {
  ActivityInstance,
} = require("twilio/lib/rest/taskrouter/v1/workspace/activity");
const offerModel = require("../models/offerModel");

const getAllOffersOfProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const offers = await offerModel
        .find({ "productOffer.offerStatus": true })
        .populate("productOffer.product");
      for (const offer of offers) {
        offer.formattedStartingDate = formatDate(offer.startingDate.toString());
        offer.formattedEndingDate = formatDate(offer.endingDate.toString());
      }
      if (offers) {
        resolve(offers);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const productCreateOffer = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offer = await offerModel.create({
        offerName: data.offerName,
        startingDate: data.startDate,
        endingDate: data.endDate,
        "productOffer.product": data.productName,
        "productOffer.discount": data.discountAmount,
        "productOffer.offerStatus": true,
      });
      resolve(offer);
    } catch (error) {
      console.log(error);
    }
  });
};

const productEditOffer = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offerEdit = await offerModel.updateOne(
        { _id: data.offerId },
        {
          $set: {
            offerName: data.offerName,
            startingDate: data.startDate,
            endingDate: data.endDate,
            "productOffer.product": data.productName,
            "productOffer.discount": data.discountAmount,
            "productOffer.offerStatus": true,
          },
        }
      );
      if (offerEdit) {
        resolve(offerEdit);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const getOfferDetails = (offerId) => {
  return new Promise(async (resolve, reject) => {
    const result = await offerModel.findOne({ _id: offerId }).lean();

    result.formattedStartingDate = formatDate(result.startingDate.toString());
    result.formattedEndingDate = formatDate(result.endingDate.toString());

    if (result) {
      resolve(result);
    }
  });
};

const getAllOffersOfCategories = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const offers = await offerModel
        .find({ "categoryOffer.offerStatus": true })
        .populate("categoryOffer.category");
      for (const offer of offers) {
        offer.formattedStartingDate = formatDate(offer.startingDate.toString());
        offer.formattedEndingDate = formatDate(offer.endingDate.toString());
      }
      if (offers) {
        resolve(offers);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const createCategoryOffer = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await offerModel.create({
        offerName: data.offerName,
        startingDate: data.startDate,
        endingDate: data.endDate,
        "categoryOffer.category": data.categoryName,
        "categoryOffer.discount": data.discountAmount,
        "categoryOffer.offerStatus": true,
      });
      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

const editCategoryOffer = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await offerModel.updateOne(
        { _id: data.offerId },
        {
          $set: {
            offerName: data.offerName,
            startingDate: data.startDate,
            endingDate: data.endDate,
            "categoryOffer.category": data.categoryName,
            "categoryOffer.discount": data.discountAmount,
            "categoryOffer.offerStatus": true,
          },
        }
      );
      resolve(result)
    } catch (error) {
      console.log(error);
    }
  });
};

const findOffer = (products) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentDate = new Date();
      const offer = await getActiveOffer(currentDate);
      console.log(offer);
      for (let i = 0; i < products.length; i++) {
        const productOffer = offer.find((item) =>
          item.productOffer?.product?.toString()==products[i]._id
        );
        console.log("fyghjgg");
        console.log(productOffer);
        const categoryOffer = offer.find((item) =>
          item.categoryOffer?.category?.toString()==
            products[i].productCategory._id  
        );
        
        if (productOffer!=undefined && categoryOffer!=undefined) {
          if (
            productOffer.productOffer.discount >
            categoryOffer.categoryOffer.discount
          ) {
            const offerPrice =
              products[i].productPrice -
              (products[i].productPrice * productOffer.productOffer.discount) /
                100;
            products[i].offerPrice = currencyFormatter(Math.round(offerPrice));
          } else {
            const offerPrice =
              products[i].productPrice -
              (products[i].productPrice *
                categoryOffer.categoryOffer.discount) /
                100;
            products[i].offerPrice = currencyFormatter(Math.round(offerPrice));
          }
        } else if (productOffer!=undefined) {
          const offerPrice =
            products[i].productPrice -
            (products[i].productPrice * productOffer.productOffer.discount) /
              100;
          products[i].offerPrice = currencyFormatter(Math.round(offerPrice));
        } else if (categoryOffer!=undefined) {
          const offerPrice =
            products[i].productPrice -
            (products[i].productPrice * categoryOffer.categoryOffer.discount) /
              100;
          products[i].offerPrice = currencyFormatter(Math.round(offerPrice));
        } else {
          const offerPrice =
            products[i].productPrice -
            (products[i].productPrice * products[i].productDiscount) / 100;
          products[i].offerPrice = currencyFormatter(Math.round(offerPrice));
        }
        products[i].productPrice = currencyFormatter(products[i].productPrice);
      }
      resolve(products);
    } catch (error) {
      console.log(error);
    }
  });
};

const getActiveOffer = (currentDate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await offerModel
        .find({
          startingDate: { $lte: currentDate },
          endingDate: { $gte: currentDate },
          status: true,
        })
        // .populate("productOffer.product")
        // .populate("categoryOffer.category");

      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

function formatDate(dateString) {
  // Create a Date object from the string
  const date = new Date(dateString);

  // Get the year, month, and day components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed

  // Format the date in YYYY/MM/DD format
  return `${year}/${month}/${day}`;
}

const currencyFormatter = (amount) => {
  return Number(amount).toLocaleString("en-in", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });
};

module.exports = {
  getAllOffersOfProducts,
  productCreateOffer,
  productEditOffer,
  getOfferDetails,
  getAllOffersOfCategories,
  createCategoryOffer,
  editCategoryOffer,
  findOffer,
};
