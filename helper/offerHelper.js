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
module.exports = {
  getAllOffersOfProducts,
  productCreateOffer,
  productEditOffer,
  getOfferDetails,
};
