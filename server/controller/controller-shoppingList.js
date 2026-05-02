// Import required modules for routing and error handling
const express = require("express");
const router = express.Router();

const ShoppingListABL = require("../abl/abl-shoppingList");
const errorHelper = require("../helpers/error");


// CREATE shopping list
// Handles request for creating a new shopping list
router.post("/create", (req, res) => {
  try {
    const result = ShoppingListABL.create(req.body);

    res.status(201).json({
      message: "Shopping list created successfully",
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
  }
});


// GET shopping list by ID
// Handles request for retrieving one shopping list by ID
router.get("/get", (req, res) => {
  try {
    const result = ShoppingListABL.get(req.query);

    res.status(200).json({
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
  }
});


// LIST shopping lists
// Handles request for retrieving all shopping lists
router.get("/list", (req, res) => {
  try {
    const result = ShoppingListABL.list();

    res.status(200).json({
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
  }
});


// REMOVE shopping list
// Handles request for deleting a shopping list
router.post("/delete", (req, res) => {
  try {
    const result = ShoppingListABL.remove(req.body);

    res.status(200).json({
      message: "Shopping list deleted successfully",
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
  }
});


// UPDATE shopping list
// Handles request for updating shopping list name
router.post("/update", (req, res) => {
  try {
    const result = ShoppingListABL.update(req.body);

    res.status(200).json({
      message: "Shopping list updated successfully",
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
  }
});


// ADD product to shopping list
// Handles request for adding a product item into shopping list
router.post("/add-product", (req, res) => {
  try {
    const result = ShoppingListABL.addProduct(req.body);

    res.status(200).json({
      message: "Product added to shopping list successfully",
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
  }
});


// REMOVE product from shopping list
// Handles request for removing a product item from shopping list
router.post("/remove-product", (req, res) => {
  try {
    const result = ShoppingListABL.removeProduct(req.body);

    res.status(200).json({
      message: "Product removed from shopping list successfully",
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
  }
});


// UPDATE product in shopping list
// Handles request for updating amount and unit of a product item
router.post("/update-product", (req, res) => {
  try {
    const result = ShoppingListABL.updateProduct(req.body);

    res.status(200).json({
      message: "Product in shopping list updated successfully",
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
  }
});


// CHANGE product purchased status
// Handles request for updating purchased state of a product item
router.post("/change-product-status", (req, res) => {
  try {
    const result = ShoppingListABL.changeProductStatus(req.body);

    res.status(200).json({
      message: "Product status changed successfully",
      data: result
    });
  } catch (error) {
    errorHelper.sendErrorResponse(res, error);
  }
});

module.exports = router;