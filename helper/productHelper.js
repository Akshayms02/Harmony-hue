const productModel = require("../models/productModel");
const fs = require("fs");

const getAllProducts = () => {
  return new Promise(async (resolve, reject) => {
    const product = await productModel
      .aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "productCategory",
            foreignField: "_id",
            as: "category",
          },
        },
      ])
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const getAllActiveProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await productModel.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "productCategory",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $match: {
            productStatus: true,
            "category.status": true,
          },
        },
      ]);

      resolve(result);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};



const addProduct = (data, files) => {
  return new Promise(async (resolve, reject) => {
    const resizedImageUrls = files.map((file) => file.path);
    let totalQuantity =
      parseInt(data.smallQuantity) +
      parseInt(data.mediumQuantity) +
      parseInt(data.largeQuantity);

    await productModel
      .create({
        productName: data.name,
        productDescription: data.description,
        productCategory: data.productCategory,
        productPrice: data.price,
        "productQuantity.S.quantity": data.smallQuantity,
        "productQuantity.M.quantity": data.mediumQuantity,
        "productQuantity.L.quantity": data.largeQuantity,
        productDiscount: data.discount,
        totalQuantity: totalQuantity,
        image: resizedImageUrls.map((path) => path.substring(2)),
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const editImages = async (oldImages, newImages) => {
  return new Promise((resolve, reject) => {
    if (newImages && newImages.length > 0) {
      // if new files are uploaded
      const resizedImageUrls = newImages.map((file) => file.path);

      // delete old images
      if (oldImages && oldImages.length > 0) {
        for (let i = 0; i < oldImages.length; i++) {
          fs.unlink("public/uploads/" + oldImages[i], (err) => {
            if (err) {
              reject(err);
            }
          });
        }
      }
      resolve(resizedImageUrls, { status: true });
    } else {
      // using old images
      resolve(oldImages, { status: false });
    }
  });
};

const productListUnlist = (id) => {
  return new Promise(async (resolve, reject) => {
    const result = await productModel.findOne({ _id: id });
    result.productStatus = !result.productStatus;
    result.save();
    resolve(result);
  });
};

const checkDuplicateFunction = (body, productId) => {
  return new Promise(async (resolve, reject) => {
    const checker = await productModel.findOne({ _id: productId });
    const check = await productModel.findOne({
      productName: body.productName,
    });

    if (!check) {
      resolve({ status: 1 });
    } else if (productId == check._id) {
      resolve({ status: 2 });
    } else {
      resolve({ status: 3 });
    }
  });
};

module.exports = {
  getAllProducts,
  addProduct,
  productListUnlist,
  editImages,
  getAllActiveProducts,
  checkDuplicateFunction,
};
