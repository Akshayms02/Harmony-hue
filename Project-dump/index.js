const ObjectId = require("mongoose").Types.ObjectId;
const ObjectId = require("mongoose").Types.ObjectId;
const deleteImages = async (req, res) => {
  try {
    console.log("========inside the deletion");

    const ObjectId = "mongoose".Types.ObjectId;

    const imageId = req.params.imageId; // Get image ID
    console.log(imageId, "image id");
    console.log(typeof imageId, " typpe of image id");
    const productId = req.params.productId;
    console.log(productId, "product id=====");
    console.log(typeof productId, "type of product id=====");

    try {
      await Product.updateOne(
        { _id: new ObjectId(productId) },
        { $pull: { images: { public_id: imageId } } }
      );

      console.log("Image deleted successfully");
      res.status(200).json({ deletedImageId: imageId });
    } catch (error) {
      console.log("Error can't delete", error);
      res.status(500).json({ error: "Error while deleting the image" });
    }
  } catch (error) {
    console.log("Error while deleting the image", error);
    res.status(500).send("Error while deleting the image");
  }
};
