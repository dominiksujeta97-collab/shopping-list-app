const express = require("express");
const cors = require("cors");

const productController = require("./controller/controller-product");
const shoppingListController = require("./controller/controller-shoppingList");

const app = express();
const PORT = 3000;

// CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
  })
);

// Middleware
app.use(express.json());

// Controllers
app.use("/products", productController);
app.use("/shopping-lists", shoppingListController);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});