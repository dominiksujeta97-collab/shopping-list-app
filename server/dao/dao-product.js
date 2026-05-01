//Importing required modules
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const productFolderPath = path.join(__dirname, "storage", "productList");

//Function GET product 
function get(productId) {
  try {
    const filePath = path.join(productFolderPath, `${productId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { 
      code: "failedToReadProduct",
      message: "Failed to read product from storage"
    };
  }
}

//Function CREATE product
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

//Function UPDATE product
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

//Function REMOVE product
function remove(productId) {
  try {
    const filePath = path.join(productFolderPath, `${productId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { 
      code: "failedToRemoveProduct",
      message: "Failed to remove product from storage"
    };
  }
}

//Function LIST products
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

//Exporting functions
module.exports = {
  get,
  create,
  update,
  remove,
  list,
};