const sharp = require("sharp");
const fs = require("fs");
const resizeImages = async (req, res, next) => {
  try {
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      const resizedBuffer = await sharp(file.path)
        .resize({ width: 636, height: 500 }) // Adjust dimensions as needed
        .toBuffer();

      const resizedPath = `./public/uploads/resized/${file.filename}`; // Adjust path as needed
      fs.writeFileSync(resizedPath, resizedBuffer);

      file.path = resizedPath; // Update path to resized image
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error resizing images");
  }
};

module.exports = {
  resizeImages,
};
