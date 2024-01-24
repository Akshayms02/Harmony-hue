const productModel = require('../models/productModel');


const getAllProducts= () => {
  return new Promise(async(resolve,reject) =>{
      const product = await productModel.aggregate([{
          $lookup:{
              from:'categories',
              localField:"productCategory",
              foreignField:"_id",
              as:"category"
          }
      }])
        .then((result) => {
          console.log(result);
          resolve(result)
      })
      .catch((error) =>{
          console.log(error);
      }) 
  })
}

const addProduct= (data, files) => {
  return new Promise(async (resolve, reject) => {
    let imageUrls = [];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let imageUrl = file.filename;
      imageUrls.push(imageUrl);
    }

    await productModel.create({
      productName: data.name,
      productDescription: data.description,
      productCategory: data.productCategory,
      productPrice: data.price,
      productQuantity: data.quantity,
      productDiscount: data.discount,
      image: imageUrls,
    }).then((result) => {
      resolve(result);
    }).catch((error) => {
      console.log(error);
    });
  });
}


module.exports = {
  getAllProducts,addProduct,
}