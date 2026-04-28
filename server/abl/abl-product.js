const AJV = require("ajv");
const ProductDAO = require("../dao/dao-product");

const ajv = new AJV();

//Schemas
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

const updateProductSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 1
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 50
    }
  },
  required: ["id", "name"],
  additionalProperties: false
};

const deleteProductSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 1
    }
  },
  required: ["id"],
  additionalProperties: false
};

//Create product
function create (dtoIn) {
    const valid = ajv.validate(createProductSchema, dtoIn);

    if (!valid) {
        throw {
            code: "dtoInIsNotValid",
            message: "Input data is not valid",
            validationErrors: ajv.errors
        };
    }

    const product = {
        name: dtoIn.name
    };

    return ProductDAO.create(product);
}

// Get product by ID
function get(dtoIn) {
  const productId = dtoIn.id;

  if (!productId) {
    throw {
      code: "dtoInIsNotValid",
      message: "Product ID is required"
    };
  }

  const product = ProductDAO.get(productId);

  if (!product) {
    throw {
      code: "productNotFound",
      message: "Product with given ID does not exist"
    };
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
    throw {
      code: "dtoInIsNotValid",
      message: "Input data is not valid",
      validationError: ajv.errors
    };
  }

  const product = ProductDAO.update(dtoIn);

  if (!product) {
    throw {
      code: "productNotFound",
      message: "Product with given ID does not exist"
    };
  }

  return product;
}

// Remove product
function remove(dtoIn) {
  const valid = ajv.validate(deleteProductSchema, dtoIn);

  if (!valid) {
    throw {
      code: "dtoInIsNotValid",
      message: "Input data is not valid",
      validationError: ajv.errors
    };
  }

  const product = ProductDAO.get(dtoIn.id);

  if (!product) {
    throw {
      code: "productNotFound",
      message: "Product with given ID does not exist"
    };
  }

  ProductDAO.remove(dtoIn.id);

  return {};
}



module.exports = {
    create,
    get,
    list,
    update,
    remove
};