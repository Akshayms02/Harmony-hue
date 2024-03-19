const productModel = require("../../models/productModel");
const categoryModel = require("../../models/categoryModel");
const orderModel = require("../../models/orderModel");

const loadAdminHome = (req, res, next) => {
  try {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    if (req.session.admin) {
      res.render("admin/adminHome");
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    next(error);
  }
};

const loadDashboard = async (req, res, next) => {
  try {
    // Fetch all orders
    const salesDetails = await orderModel.find();

    // Fetch all products and categories
    const products = await productModel.find();
    const categories = await categoryModel.find();

    // Aggregate for finding the top selling products
    const topSellingProducts = await orderModel.aggregate([
      { $unwind: "$products" }, // Split orders into individual products
      {
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" },
        },
      }, // Group by productId and sum quantities
      { $sort: { totalQuantity: -1 } }, // Sort by total quantity descending
      { $limit: 10 }, // Limit to top 10 products
    ]);

    // Extract product IDs of top selling products
    const productIds = topSellingProducts.map((product) => product._id);

    // Fetch details of top selling products
    const productsData = await productModel.find(
      { _id: { $in: productIds } },
      { productName: 1, image: 1 }
    );

    // Aggregate to find the top selling categories
    const topSellingCategories = await orderModel.aggregate([
      { $unwind: "$products" }, // Split orders into individual products
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "product",
        },
      }, // Lookup products collection to get product details
      { $unwind: "$product" }, // Unwind the product array
      {
        $lookup: {
          from: "categories",
          localField: "product.productCategory",
          foreignField: "_id",
          as: "category",
        },
      }, // Lookup categories collection to get category details
      { $unwind: "$category" }, // Unwind the category array
      {
        $group: {
          _id: "$category._id",
          totalQuantity: { $sum: "$products.quantity" },
        },
      }, // Group by categoryId and sum quantities
      { $sort: { totalQuantity: -1 } }, // Sort by total quantity descending
      { $limit: 10 }, // Limit to top 10 categories
    ]);

    // Fetch details of the top selling categories
    const topSellingCategoriesData = await categoryModel.find({
      _id: { $in: topSellingCategories.map((cat) => cat._id) },
    });

    res.render("admin/dashBoard", {
      salesDetails: salesDetails,
      products: products,
      categories: categories, // Pass categories to the rendering context
      productsData: productsData,
      topSellingCategories: topSellingCategoriesData,
      topSellingProducts: topSellingProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const showChart = async (req, res) => {
  try {
    if (req.body.msg) {
      // Aggregate monthly sales data
      const monthlySalesData = await orderModel.aggregate([
        {
          $match: { "products.status": "delivered" }, // Consider only delivered orders
        },
        {
          $group: {
            _id: { $month: "$orderedOn" }, // Group by month
            totalAmount: { $sum: "$totalAmount" }, // Calculate total sales amount for each month
          },
        },
        {
          $sort: { _id: 1 }, // Sort by month
        },
      ]);
      console.log(monthlySalesData);

      // Aggregate daily sales data
      const dailySalesData = await orderModel.aggregate([
        {
          $match: { "products.status": "delivered" }, // Consider only delivered orders
        },
        {
          $group: {
            _id: { $dayOfMonth: "$orderedOn" }, // Group by day of month
            totalAmount: { $sum: "$totalAmount" }, // Calculate total sales amount for each day
          },
        },
        {
          $sort: { _id: 1 }, // Sort by day of month
        },
      ]);

      const orderStatuses = await orderModel.aggregate([
        {
          $unwind: "$products", // Unwind the products array
        },
        {
          $group: {
            _id: "$products.status", // Group by order status
            count: { $sum: 1 }, // Count occurrences of each status
          },
        },
      ]);
      console.log(orderStatuses);

      // Map order statuses to object format
      const eachOrderStatusCount = {};
      orderStatuses.forEach((status) => {
        eachOrderStatusCount[status._id] = status.count;
      });
      console.log(eachOrderStatusCount);

      res
        .status(200)
        .json({ monthlySalesData, dailySalesData, eachOrderStatusCount });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  loadAdminHome,
  loadDashboard,
  showChart,
};
