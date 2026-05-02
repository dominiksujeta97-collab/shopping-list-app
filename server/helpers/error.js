// Create validation error
// Used when dtoIn does not match AJV validation schema
function createValidationError(validationError) {
  return {
    code: "dtoInIsNotValid",
    message: "Input data is not valid",
    validationError: validationError
  };
}


// Create not found error
// Used for missing product or shopping list records
function createNotFoundError(code, message) {
  return {
    code: code,
    message: message
  };
}


// Send error response
// Maps application error codes to proper HTTP status codes
function sendErrorResponse(res, error) {
  if (error.code === "dtoInIsNotValid") {
    return res.status(400).json(error);
  }

  if (
    error.code === "productAlreadyInShoppingList" ||
    error.code === "productIsUsedInShoppingList"
  ) {
    return res.status(400).json(error);
  }

  if (error.code === "productNotInShoppingList") {
    return res.status(404).json(error);
  }

  if (error.code === "productNotFound" || error.code === "shoppingListNotFound") {
    return res.status(404).json(error);
  }

  return res.status(500).json(error);
}


// Export helper functions
module.exports = {
  createValidationError,
  createNotFoundError,
  sendErrorResponse
};