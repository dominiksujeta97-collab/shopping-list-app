// Import required modules for validation, data access and error handling
const AJV = require("ajv");
const ProductDAO = require("../dao/dao-product");
const ShoppingListDAO = require("../dao/dao-shoppingList");
const errorHelper = require("../helpers/error");

// Initialize AJV validator
const ajv = new AJV();


// ========================
// Validation Schemas
// ========================

// Schema for creating a product
const createProductSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 50
    }
  },
  required: ["name"],
  additionalProperties: false
};

// Schema for retrieving a product by ID
const getProductSchema = {
  type: "object",
  properties: {
    productId: {
      type: "string",
      minLength: 1
    }
  },
  required: ["productId"],
  additionalProperties: false
};

// Schema for updating a product
const updateProductSchema = {
  type: "object",
  properties: {
    productId: {
      type: "string",
      minLength: 1
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 50
    }
  },
  required: ["productId", "name"],
  additionalProperties: false
};

// Schema for deleting a product
const deleteProductSchema = {
  type: "object",
  properties: {
    productId: {
      type: "string",
      minLength: 1
    }
  },
  required: ["productId"],
  additionalProperties: false
};


// ========================
// ABL Functions
// ========================

// CREATE product
// Validates input and creates a new product in storage
function create(dtoIn) {
  const valid = ajv.validate(createProductSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const product = {
    name: dtoIn.name
  };

  return ProductDAO.create(product);
}


// GET product by ID
// Retrieves a product and checks if it exists
function get(dtoIn) {
  const valid = ajv.validate(getProductSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const product = ProductDAO.get(dtoIn.productId);

  if (!product) {
    throw errorHelper.createNotFoundError(
      "productNotFound",
      "Product with given ID does not exist"
    );
  }

  return product;
}


// LIST products
// Returns all products from storage
function list() {
  return ProductDAO.list();
}


// UPDATE product
// Updates product name based on productId
function update(dtoIn) {
  const valid = ajv.validate(updateProductSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const productData = {
    id: dtoIn.productId,
    name: dtoIn.name
  };

  const product = ProductDAO.update(productData);

  if (!product) {
    throw errorHelper.createNotFoundError(
      "productNotFound",
      "Product with given ID does not exist"
    );
  }

  return product;
}


// REMOVE product
// Deletes product only if it is not used in any shopping list
function remove(dtoIn) {
  const valid = ajv.validate(deleteProductSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  // Check if product exists
  const product = ProductDAO.get(dtoIn.productId);

  if (!product) {
    throw errorHelper.createNotFoundError(
      "productNotFound",
      "Product with given ID does not exist"
    );
  }

  // Business rule: product cannot be deleted if used in any shopping list
  const shoppingLists = ShoppingListDAO.list();

  const productIsUsed = shoppingLists.some((shoppingList) =>
    shoppingList.productList.some((item) => item.productId === dtoIn.productId)
  );

  if (productIsUsed) {
    throw {
      code: "productIsUsedInShoppingList",
      message: "Product cannot be deleted because it is used in a shopping list"
    };
  }

  // Remove product from storage
  ProductDAO.remove(dtoIn.productId);

  return {};
}


module.exports = {
  create,
  get,
  list,
  update,
  remove
};