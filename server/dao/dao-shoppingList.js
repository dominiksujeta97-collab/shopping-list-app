// Import required modules for working with filesystem, paths and unique IDs
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Path to folder where shopping list JSON files are stored
const shoppingListFolderPath = path.join(__dirname, "storage", "shoppingList");


// GET shopping list
// Reads one shopping list from storage by shopping list ID
function get(shoppingListId) {
  try {
    const filePath = path.join(shoppingListFolderPath, `${shoppingListId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");

    return JSON.parse(fileData);
  } catch (error) {
    // If file does not exist, shopping list was not found
    if (error.code === "ENOENT") return null;

    throw {
      code: "failedToReadShoppingList",
      message: "Failed to read shopping list from storage"
    };
  }
}


// CREATE shopping list
// Generates unique ID and saves new shopping list into storage
function create(shoppingList) {
  try {
    shoppingList.id = crypto.randomBytes(16).toString("hex");

    const filePath = path.join(shoppingListFolderPath, `${shoppingList.id}.json`);
    const fileData = JSON.stringify(shoppingList);

    fs.writeFileSync(filePath, fileData, "utf8");

    return shoppingList;
  } catch (error) {
    throw {
      code: "failedToCreateShoppingList",
      message: "Failed to create shopping list in storage"
    };
  }
}


// UPDATE shopping list
// Reads current shopping list, merges changes and saves updated shopping list
function update(shoppingList) {
  try {
    const currentShoppingList = get(shoppingList.id);
    if (!currentShoppingList) return null;

    const newShoppingList = { ...currentShoppingList, ...shoppingList };

    const filePath = path.join(shoppingListFolderPath, `${shoppingList.id}.json`);
    const fileData = JSON.stringify(newShoppingList);

    fs.writeFileSync(filePath, fileData, "utf8");

    return newShoppingList;
  } catch (error) {
    throw {
      code: "failedToUpdateShoppingList",
      message: "Failed to update shopping list in storage"
    };
  }
}


// REMOVE shopping list
// Deletes shopping list file from storage by shopping list ID
function remove(shoppingListId) {
  try {
    const filePath = path.join(shoppingListFolderPath, `${shoppingListId}.json`);
    fs.unlinkSync(filePath);

    return {};
  } catch (error) {
    // If file does not exist, remove operation is treated as already done
    if (error.code === "ENOENT") {
      return {};
    }

    throw {
      code: "failedToRemoveShoppingList",
      message: "Failed to remove shopping list from storage"
    };
  }
}


// LIST shopping lists
// Reads all shopping list files from storage and returns them as an array
function list() {
  try {
    const files = fs.readdirSync(shoppingListFolderPath).filter((file) => {
      return file.endsWith(".json");
    });

    const shoppingLists = files.map((file) => {
      const filePath = path.join(shoppingListFolderPath, file);
      const fileData = fs.readFileSync(filePath, "utf8");

      return JSON.parse(fileData);
    });

    return shoppingLists;
  } catch (error) {
    throw {
      code: "failedToListShoppingLists",
      message: "Failed to retrieve shopping lists from storage"
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