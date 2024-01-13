const express = require("express");

const app = express();
const PORT = 3002;

app.use(express.urlencoded({ extended: true }));

app.get("/user", (req, res) => {
  res.send("Home");
});
app.get("/user/home", (req, res) => {
  res.send({ data: "user home data" });
});
app.post("/user/signup", (req, res) => {
  res.send({
    message: "Registration successful",
  });
});
app.post("/user/login", (req, res) => {
  res.send({
    message: "Login successful",
  });
});
app.get("/user/logout", (req, res) => {
  res.send({
    message: "Logout successful",
  });
});
app.get("/user/product", (req, res) => {
  res.send({
    productDetails: {
      productId: "string",
      productName: "string",
      description: "string",
      price: "number",
      images: ["string"],
      rating: "number",
      price: "number",
      catergory: "string",
      brand: "string",
      size: ["string"],
      color:["string"]
      
    },
  });
});
app.post("/user/search-product", (req, res) => {
  res.send({
    products: [
      {
        productId: "string",
        name: "string",
        price: "number",
        rating: "",
        images: ["string"],
        price: "number",
        catergory: "string",
        brand: "string",
        size: ["string"],
        color:["string"]
      },
    ],
  });
});
app.get("/user/wishlist", (req, res) => {
  res.send({
    wishlistItems: [
      {
        productId: "string",
        name: "string",
        price: "number",
        image: ["string"],
        color: "price",
        rating: "number",
      },
    ],
  });
});
app.get("/user/cart", (req, res) => {
  res.send({
    cartItems: [
      {
        productId: "string",
        name: "string",
        price: "number",
        quantity: "number",
        color: "string",
        rating: "number",
        images: ["string"],
      },
    ],
  });
});
app.post("/user/payment", (req, res) => {
  res.send({
    message: "Checkout initiated",
  });
});
app.get("/user/checkout", (req, res) => {
  res.send({
    users: {
      address: "string",
    },
  });
});
app.post("/user/checkout", (req, res) => {
  res.send({
    message: "Payment successful",
  });
});
app.get("/user/profile", (req, res) => {
  res.send({
    Users: {
      username: "string",
      email: "string",
      phoneNumber: "number",
      address: "string",
    },
  });
});
app.post("/user/add-address", (req, res) => {
  res.send({
    message: "Address added successfully",
  });
});
app.put("/user/edit-address", (req, res) => {
  res.send({
    message: "updated successfully",
  });
});
app.put("/user/change-password", (req, res) => {
  res.send({
    message: "Password changed successfully",
  });
});
app.get("/user/orders", (req, res) => {
  res.send({
    orders: [
      {
        orderId: "string",
        date: "string (ISO 8601 format)",
        totalAmount: "number (decimal)",
        status: "string",
        name: "string",
        image: "string",
        quantity: "number",
        "total price": "number",
      },
    ],
  });
});
app.post("/admin/login", (req, res) => {
  res.send({
    message: "Admin login successful",
  });
});
app.get("/admin/dashboard", (req, res) => {
  res.send({
    dashboardData: {
      totalOrders: "number",
      totalUsers: "number",
      totalRevenue: "number",
      latestorders: "numbers",
      bestsellers: "numbers",
      ordrerId: "number"
    }
  });
});
app.get("/admin/logout", (req, res) => {
  res.send({
    Message: "successfully logged out",
  });
});
app.get("/admin/orders", (req, res) => {
  res.send({
    orders: [
      {
        orderId: "string",
        date: "string",
        totalAmount: "number",
        status: "string",
        method: "string",
        customer: "string",
      },
    ],
  });
});
app.get("/admin/order-details", (req, res) => {
  res.send({
    orderDetails: {
      orderId: "string",
      date: "string",
      name: "string",
      email: "string",
      mobile: "string",
      totalAmount: "number",
      status: "string",
      address: "string",
      items: [
        {
          productId: "string",
          productName: "string",
          quantity: "number",
          price: "number",
        },
      ],
    },
  });
});
app.put("/admin/edit-status", (req, res) => {
  res.send({
    message: "Order status updated successfully",
  });
});
app.get("/admin/products", (req, res) => {
  res.send({
    products: [
      {
        productId: "string",
        stock: "number",
        price: "number",
        status: "string",
        date: "date",
      },
    ],
  });
});
app.post("/admin/add-products", (req, res) => {
  res.send({
    message: "Product added successfully",
  });
});
app.delete("/admin/delete-products", (req, res) => {
  res.send({
    message: "Product deleted successfully",
  });
});
app.put("/admin/edit-products", (req, res) => {
  res.send({
    message: "Product updated successfully",
  });
});
app.get("/admin/user-list", (req, res) => {
  res.send({
    users: [
      {
        userId: "string",
        name: "string",
        email: "string",
        phone: "number",
        status: "string",
        orders: "string",
        date: "date",
      },
    ],
  });
});
app.get("/admin/user", (req, res) => {
  res.send({
    user: {
      userId: "string",
      name: "string",
      email: "string",
      status: "string",
      address: "string",
      phone: "number",
      ordercount: "number",
    },
  });
});
app.get("/admin/user-details", (req, res) => {
  res.send({
    user: {
      userId: "string",
      orderId: "string",
      username: "string",
      email: "string",
      status: "string",
      address: "string",
      phone: "number",
      status: "string",
      " total": "number",
      date: "date",
    },
  });
});
app.put("/admin/block-user", (req, res) => {
  res.send({
    message: "User blocked successfully",
  });
});
app.post("/admin/add-coupon", (req, res) => {
  res.send({
    message: "Coupon added successfully",
  });
});
app.post("/admin/add-banner", (req, res) => {
  res.send({
    message: "Banner added successfully",
  });
});
app.post("/admin/wallet", (req, res) => {
  res.send({
    message: "Money added succesfully",
  });
});
app.delete("/admin/delete-banner", (req, res) => {
  res.send({
    message: "Your banner was deleted",
  });
});
app.post("/admin/add-category", (req, res) => {
  res.send({
    message: "Your Category was added",
  });
});
app.put("/admin/edit-category", (req, res) => {
  res.send({
    message: "Your Category was updated",
  });
});
app.delete("/admin/delete-coupon", (req, res) => {
  res.send({
    message: "Your coupon was deleted",
  });
});
app.post("/user/add-review", (req, res) => {
  res.send({
    message: "Your review was added",
  });
});
app.post("/user/add-wishlist", (req, res) => {
  res.send({
    message: "The product was added to the wishlist",
  });
});

app.listen(PORT, () => {
  console.log("Server started on http://localhost:3002/user");
});
