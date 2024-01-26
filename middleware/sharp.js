const sharp = require("sharp");
const cropImages = async (req, res, next) => {
  try {
    console.log(req.files);
    let ImageArray = req.files;
    const imagePaths = ImageArray.map((file) => file.path);

    // Dynamically crop each image
    const croppedImages = await Promise.all(
      imagePaths.map(async (imagePath) => {
        // Define your cropping parameters
        const cropOptions = {
          left: 10,
          top: 10,
          width: 200,
          height: 200,
        };

        // Perform the cropping operation
        const croppedBuffer = await sharp(imagePath)
          .extract(cropOptions)
          .toBuffer();

        return {
          originalPath: imagePath,
          croppedBuffer,
        };
      })
    );
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  cropImages,
};
