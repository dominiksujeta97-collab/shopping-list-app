const express = require("express");
const router = express.Router();

const ProductABL = require("../abl/abl-product");
const errorHelper = require("../helpers/error");

// Create product
router.post("/create", (req, res) => {
  try {
    const result = ProductABL.create(req.body);

    res.status(200).json({
      message: "Product created successfully",
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
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
    errorHelper.sendErrorResponse(res, error);
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
    errorHelper.sendErrorResponse(res, error);
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
    errorHelper.sendErrorResponse(res, error);
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
    errorHelper.sendErrorResponse(res, error);
  }
});

module.exports = router;