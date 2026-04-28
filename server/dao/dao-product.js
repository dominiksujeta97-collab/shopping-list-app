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
    throw { code: "failedToReadProduct", product: error.product };
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
    throw { code: "failedToCreateProduct", product: error.product };
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
    throw { code: "failedToUpdateProduct", product: error.product };
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
    throw { code: "failedToRemoveProduct", product: error.product };
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
    throw { code: "failedToListProducts", product: error.product };
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