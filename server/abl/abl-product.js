const AJV = require("ajv");
const ProductDAO = require("../dao/dao-product");
const errorHelper = require("../helpers/error");

const ajv = new AJV();

// Schemas
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

// Create product
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

// Get product by ID
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

// List products
function list() {
  return ProductDAO.list();
}

// Update product
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

// Remove product
function remove(dtoIn) {
  const valid = ajv.validate(deleteProductSchema, dtoIn);

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