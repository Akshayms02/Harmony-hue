const categoryModel = require("../models/categoryModel");

const addCategory = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let name = body.categoryName;
      let description = body.categoryDescription;

      let lowerCaseName = name.toLowerCase();

      let existingCategory = await categoryModel.findOne({
        categoryName: { $regex: new RegExp("^" + lowerCaseName + "$", "i") },
      });

      if (existingCategory) {
        resolve({ status: false });
      } else {
        const newcategory = new categoryModel({
          categoryName: name,
          description: description,
        });
        await newcategory.save();
        resolve({ status: true });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      reject(error);
    }
  });
};

const getAllcategory = () => {
  return new Promise(async (resolve, reject) => {
    await categoryModel.find().then((result) => {
      resolve(result);
    });
  });
};

const softDeleteCategory = async (categoryId) => {
  return new Promise(async (resolve, reject) => {
    let category = await categoryModel.findById({ _id: categoryId });

    category.status = !category.status;
    category.save();
    resolve(category);
  });
};

const getAllActiveCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const categories = await categoryModel.find({ status: true });
      if (categories) {
        resolve(categories);
      } else {
        resolve({ message: "No Active Categories" });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  getAllcategory,
  softDeleteCategory,
  addCategory,
  getAllActiveCategory,
};
