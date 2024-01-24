const productModel = require('../models/productModel');


const getAllProducts= () => {
  return new Promise(async(resolve,reject) =>{
      const product = await productModel.aggregate([{
          $lookup:{
              from:'Category',
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
      productName: data.product_name,
      productDescription: data.product_description,
      productCategory: data.product_category,
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