// Create validation error
function createValidationError(validationError) {
  return {
    code: "dtoInIsNotValid",
    message: "Input data is not valid",
    validationError: validationError
  };
}

// Create not found error
function createNotFoundError(code, message) {
  return {
    code: code,
    message: message
  };
}

// Send error response
function sendErrorResponse(res, error) {
  if (error.code === "productNotFound") {
    return res.status(404).json(error);
  }

  if (error.code === "dtoInIsNotValid") {
    return res.status(400).json(error);
  }

  return res.status(500).json(error);
}

module.exports = {
  createValidationError,
  createNotFoundError,
  sendErrorResponse
};