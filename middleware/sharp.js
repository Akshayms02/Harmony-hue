const sharp = require("sharp");
const resizeImages = async (req, res, next) => {
  // Get uploaded images from Multer
  const uploadedImages = req.files;

  // Resize each image asynchronously
  const promises = uploadedImages.map((image) =>
    sharp(image.path)
      .resize({ width: 300, height: 200 }) 
      .toFile(`public/uploads/resized_${image.originalname}`)
      .catch((err) => console.error(err))
  );

  // Wait for all resizes to finish
  await Promise.all(promises);

  // Update request object with resized images and proceed
  req.files = uploadedImages.map((image) => ({
    ...image,
    path: `resized_${image.originalname}`,
  }));
  console.log("Hi im cropped");
  next();
};

module.exports = {
  resizeImages,
};
