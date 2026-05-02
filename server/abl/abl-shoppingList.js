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

// Schema for creating a shopping list
const createShoppingListSchema = {
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

// Schema for getting a shopping list by ID
const getShoppingListSchema = {
  type: "object",
  properties: {
    shoppingListId: {
      type: "string",
      minLength: 1
    }
  },
  required: ["shoppingListId"],
  additionalProperties: false
};

// Schema for deleting a shopping list
const deleteShoppingListSchema = {
  type: "object",
  properties: {
    shoppingListId: {
      type: "string",
      minLength: 1
    }
  },
  required: ["shoppingListId"],
  additionalProperties: false
};

// Schema for updating shopping list name
const updateShoppingListSchema = {
  type: "object",
  properties: {
    shoppingListId: {
      type: "string",
      minLength: 1
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 50
    }
  },
  required: ["shoppingListId", "name"],
  additionalProperties: false
};

// Schema for adding a product item into shopping list
const addProductSchema = {
  type: "object",
  properties: {
    shoppingListId: {
      type: "string",
      minLength: 1
    },
    productId: {
      type: "string",
      minLength: 1
    },
    amount: {
      type: "number",
      minimum: 0.01
    },
    unit: {
      type: "string",
      enum: ["ks", "g", "kg", "ml", "l"]
    }
  },
  required: ["shoppingListId", "productId", "amount", "unit"],
  additionalProperties: false
};

// Schema for removing a product item from shopping list
const removeProductSchema = {
  type: "object",
  properties: {
    shoppingListId: {
      type: "string",
      minLength: 1
    },
    productId: {
      type: "string",
      minLength: 1
    }
  },
  required: ["shoppingListId", "productId"],
  additionalProperties: false
};

// Schema for updating amount and unit of a product item
const updateProductInShoppingListSchema = {
  type: "object",
  properties: {
    shoppingListId: {
      type: "string",
      minLength: 1
    },
    productId: {
      type: "string",
      minLength: 1
    },
    amount: {
      type: "number",
      minimum: 0.01
    },
    unit: {
      type: "string",
      enum: ["ks", "g", "kg", "ml", "l"]
    }
  },
  required: ["shoppingListId", "productId", "amount", "unit"],
  additionalProperties: false
};

// Schema for changing purchased status of a product item
const changeProductStatusSchema = {
  type: "object",
  properties: {
    shoppingListId: {
      type: "string",
      minLength: 1
    },
    productId: {
      type: "string",
      minLength: 1
    },
    purchased: {
      type: "boolean"
    }
  },
  required: ["shoppingListId", "productId", "purchased"],
  additionalProperties: false
};


// ========================
// ABL Functions
// ========================

// CREATE shopping list
// Creates a new shopping list with empty productList
function create(dtoIn) {
  const valid = ajv.validate(createShoppingListSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const shoppingList = {
    name: dtoIn.name,
    productList: []
  };

  return ShoppingListDAO.create(shoppingList);
}

// GET shopping list by ID
// Retrieves a shopping list and checks if it exists
function get(dtoIn) {
  const valid = ajv.validate(getShoppingListSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const shoppingList = ShoppingListDAO.get(dtoIn.shoppingListId);

  if (!shoppingList) {
    throw errorHelper.createNotFoundError(
      "shoppingListNotFound",
      "Shopping list with given ID does not exist"
    );
  }

  return shoppingList;
}

// LIST shopping lists
// Returns all shopping lists from storage
function list() {
  return ShoppingListDAO.list();
}

// REMOVE shopping list
// Deletes shopping list from storage
function remove(dtoIn) {
  const valid = ajv.validate(deleteShoppingListSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const shoppingList = ShoppingListDAO.get(dtoIn.shoppingListId);

  if (!shoppingList) {
    throw errorHelper.createNotFoundError(
      "shoppingListNotFound",
      "Shopping list with given ID does not exist"
    );
  }

  ShoppingListDAO.remove(dtoIn.shoppingListId);

  return {};
}

// UPDATE shopping list
// Updates shopping list name
function update(dtoIn) {
  const valid = ajv.validate(updateShoppingListSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const shoppingListData = {
    id: dtoIn.shoppingListId,
    name: dtoIn.name
  };

  const shoppingList = ShoppingListDAO.update(shoppingListData);

  if (!shoppingList) {
    throw errorHelper.createNotFoundError(
      "shoppingListNotFound",
      "Shopping list with given ID does not exist"
    );
  }

  return shoppingList;
}

// ADD product to shopping list
// Adds existing product into productList and prevents duplicates in the same shopping list
function addProduct(dtoIn) {
  const valid = ajv.validate(addProductSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const shoppingList = ShoppingListDAO.get(dtoIn.shoppingListId);

  if (!shoppingList) {
    throw errorHelper.createNotFoundError(
      "shoppingListNotFound",
      "Shopping list with given ID does not exist"
    );
  }

  // Check if referenced product exists
  const product = ProductDAO.get(dtoIn.productId);

  if (!product) {
    throw errorHelper.createNotFoundError(
      "productNotFound",
      "Product with given ID does not exist"
    );
  }

  // Business rule: one product can be added only once to the same shopping list
  const productAlreadyInList = shoppingList.productList.some(
    (item) => item.productId === dtoIn.productId
  );

  if (productAlreadyInList) {
    throw {
      code: "productAlreadyInShoppingList",
      message: "Product already exists in shopping list"
    };
  }

  // New product item is always not purchased by default
  shoppingList.productList.push({
    productId: dtoIn.productId,
    amount: dtoIn.amount,
    unit: dtoIn.unit,
    purchased: false
  });

  return ShoppingListDAO.update(shoppingList);
}

// REMOVE product from shopping list
// Removes product item from productList
function removeProduct(dtoIn) {
  const valid = ajv.validate(removeProductSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const shoppingList = ShoppingListDAO.get(dtoIn.shoppingListId);

  if (!shoppingList) {
    throw errorHelper.createNotFoundError(
      "shoppingListNotFound",
      "Shopping list with given ID does not exist"
    );
  }

  // Find product item in shopping list
  const productIndex = shoppingList.productList.findIndex(
    (item) => item.productId === dtoIn.productId
  );

  if (productIndex === -1) {
    throw {
      code: "productNotInShoppingList",
      message: "Product does not exist in shopping list"
    };
  }

  shoppingList.productList.splice(productIndex, 1);

  return ShoppingListDAO.update(shoppingList);
}

// UPDATE product in shopping list
// Updates amount and unit of existing product item
function updateProduct(dtoIn) {
  const valid = ajv.validate(updateProductInShoppingListSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const shoppingList = ShoppingListDAO.get(dtoIn.shoppingListId);

  if (!shoppingList) {
    throw errorHelper.createNotFoundError(
      "shoppingListNotFound",
      "Shopping list with given ID does not exist"
    );
  }

  // Find product item in shopping list
  const productIndex = shoppingList.productList.findIndex(
    (item) => item.productId === dtoIn.productId
  );

  if (productIndex === -1) {
    throw {
      code: "productNotInShoppingList",
      message: "Product does not exist in shopping list"
    };
  }

  shoppingList.productList[productIndex] = {
    ...shoppingList.productList[productIndex],
    amount: dtoIn.amount,
    unit: dtoIn.unit
  };

  return ShoppingListDAO.update(shoppingList);
}

// CHANGE product purchased status
// Updates purchased value of existing product item
function changeProductStatus(dtoIn) {
  const valid = ajv.validate(changeProductStatusSchema, dtoIn);

  if (!valid) {
    throw errorHelper.createValidationError(ajv.errors);
  }

  const shoppingList = ShoppingListDAO.get(dtoIn.shoppingListId);

  if (!shoppingList) {
    throw errorHelper.createNotFoundError(
      "shoppingListNotFound",
      "Shopping list with given ID does not exist"
    );
  }

  // Find product item in shopping list
  const productIndex = shoppingList.productList.findIndex(
    (item) => item.productId === dtoIn.productId
  );

  if (productIndex === -1) {
    throw {
      code: "productNotInShoppingList",
      message: "Product does not exist in shopping list"
    };
  }

  shoppingList.productList[productIndex] = {
    ...shoppingList.productList[productIndex],
    purchased: dtoIn.purchased
  };

  return ShoppingListDAO.update(shoppingList);
}

module.exports = {
  create,
  get,
  list,
  remove,
  update,
  addProduct,
  removeProduct,
  updateProduct,
  changeProductStatus
};