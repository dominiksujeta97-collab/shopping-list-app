// Import required modules for routing and error handling
const express = require("express");
const router = express.Router();

const ProductABL = require("../abl/abl-product");
const errorHelper = require("../helpers/error");


// CREATE product
// Handles request for creating a new product
router.post("/create", (req, res) => {
  try {
    const result = ProductABL.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
  }
});


// GET product by ID
// Handles request for retrieving one product by productId
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


// LIST products
// Handles request for retrieving all products
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


// UPDATE product
// Handles request for updating product name
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


// REMOVE product
// Handles request for deleting a product
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