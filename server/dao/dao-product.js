// Import required modules for working with filesystem, paths and unique IDs
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Path to folder where product JSON files are stored
const productFolderPath = path.join(__dirname, "storage", "productList");


// GET product
// Reads one product from storage by product ID
function get(productId) {
  try {
    const filePath = path.join(productFolderPath, `${productId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");

    return JSON.parse(fileData);
  } catch (error) {
    // If file does not exist, product was not found
    if (error.code === "ENOENT") return null;

    throw {
      code: "failedToReadProduct",
      message: "Failed to read product from storage"
    };
  }
}


// CREATE product
// Generates unique ID and saves new product into storage
function create(product) {
  try {
    product.id = crypto.randomBytes(16).toString("hex");

    const filePath = path.join(productFolderPath, `${product.id}.json`);
    const fileData = JSON.stringify(product);

    fs.writeFileSync(filePath, fileData, "utf8");

    return product;
  } catch (error) {
    throw {
      code: "failedToCreateProduct",
      message: "Failed to create product in storage"
    };
  }
}


// UPDATE product
// Reads current product, merges changes and saves updated product
function update(product) {
  try {
    const currentProduct = get(product.id);
    if (!currentProduct) return null;

    const newProduct = { ...currentProduct, ...product };

    const filePath = path.join(productFolderPath, `${product.id}.json`);
    const fileData = JSON.stringify(newProduct);

    fs.writeFileSync(filePath, fileData, "utf8");

    return newProduct;
  } catch (error) {
    throw {
      code: "failedToUpdateProduct",
      message: "Failed to update product in storage"
    };
  }
}


// REMOVE product
// Deletes product file from storage by product ID
function remove(productId) {
  try {
    const filePath = path.join(productFolderPath, `${productId}.json`);
    fs.unlinkSync(filePath);

    return {};
  } catch (error) {
    // If file does not exist, remove operation is treated as already done
    if (error.code === "ENOENT") {
      return {};
    }

    throw {
      code: "failedToRemoveProduct",
      message: "Failed to remove product from storage"
    };
  }
}


// LIST products
// Reads all product files from storage and returns them as an array
function list() {
  try {
    const files = fs.readdirSync(productFolderPath);

    const productList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(productFolderPath, file),
        "utf8"
      );

      return JSON.parse(fileData);
    });

    return productList;
  } catch (error) {
    throw {
      code: "failedToListProducts",
      message: "Failed to retrieve products from storage"
    };
  }
}


// Export DAO functions
module.exports = {
  get,
  create,
  update,
  remove,
  list
};