const express = require("express");

const productController = require("./controller/controller-product");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Controllers
app.use("/products", productController);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});