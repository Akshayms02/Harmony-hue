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
      ]);

      const activeProducts = result
        .map((item) => {
          const category = item.category[0];
          if (category && category.status) {
            if (item.productStatus) {
              return item;
            }
          }
          return null;
        })
        .filter(Boolean);

      // console.log(activeProducts);
      resolve(activeProducts);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

const  addProduct = (data, files) => {
  return new Promise(async (resolve, reject) => {
    let imageUrls = [];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let imageUrl = file.filename;
      imageUrls.push(imageUrl);
    }

    await productModel
      .create({
        productName: data.name,
        productDescription: data.description,
        productCategory: data.productCategory,
        productPrice: data.price,
        productQuantity: data.quantity,
        productDiscount: data.discount,
        image: imageUrls,
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
      let imageUrls = [];
      for (let i = 0; i < newImages.length; i++) {
        let image = newImages[i];
        let imageUrl = image.filename;
        imageUrls.push(imageUrl);
      }
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
      resolve(imageUrls);
    } else {
      // using old images
      resolve(oldImages);
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

module.exports = {
  getAllProducts,
  addProduct,
  productListUnlist,
  editImages,
  getAllActiveProducts,
};
