const express = require("express");
const router = express.Router();

const ProductABL = require("../abl/abl-product");

// Create product
router.post("/create", (req, res) => {
  try {
    const result = ProductABL.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

// Get product by ID
router.get("/get", (req, res) => {
  try {
    const result = ProductABL.get(req.query);

    res.status(200).json({
      data: result
    });
  } catch (error) {
    if (error.code === "productNotFound") {
      return res.status(404).json(error);
    }

    res.status(400).json(error);
  }
});

// List products
router.get("/list", (req, res) => {
  try {
    const result = ProductABL.list();

    res.status(200).json({
      data: result
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update product
router.post("/update", (req, res) => {
  try {
    const result = ProductABL.update(req.body);

    res.status(200).json({
      message: "Product updated successfully",
      data: result
    });
  } catch (error) {
    if (error.code === "productNotFound") {
      return res.status(404).json(error);
    }

    res.status(400).json(error);
  }
});

// Remove product
router.post("/delete", (req, res) => {
  try {
    const result = ProductABL.remove(req.body);

    res.status(200).json({
      message: "Product deleted successfully",
      data: result
    });
  } catch (error) {
    if (error.code === "productNotFound") {
      return res.status(404).json(error);
    }

    res.status(400).json(error);
  }
});

module.exports = router;