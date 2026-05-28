async function Call(baseUri, useCase, dtoIn, method) {
  let response;

  if (!method || method === "get") {
    response = await fetch(
      `${baseUri}/${useCase}${
        dtoIn && Object.keys(dtoIn).length
          ? `?${new URLSearchParams(dtoIn)}`
          : ""
      }`
    );
  } else {
    response = await fetch(`${baseUri}/${useCase}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dtoIn),
    });
  }

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

const baseUri = "";

const FetchHelper = {
  product: {
    list: async (dtoIn) => {
      return await Call(baseUri, "products/list", dtoIn, "get");
    },

    create: async (dtoIn) => {
      return await Call(baseUri, "products/create", dtoIn, "post");
    },

    update: async (dtoIn) => {
      return await Call(baseUri, "products/update", dtoIn, "post");
    },

    delete: async (dtoIn) => {
      return await Call(baseUri, "products/delete", dtoIn, "post");
    },
  },

  shoppingList: {
    list: async (dtoIn) => {
      return await Call(baseUri, "shopping-lists/list", dtoIn, "get");
    },

    get: async (dtoIn) => {
      return await Call(baseUri, "shopping-lists/get", dtoIn, "get");
    },

    create: async (dtoIn) => {
      return await Call(baseUri, "shopping-lists/create", dtoIn, "post");
    },

    update: async (dtoIn) => {
      return await Call(baseUri, "shopping-lists/update", dtoIn, "post");
    },

    delete: async (dtoIn) => {
      return await Call(baseUri, "shopping-lists/delete", dtoIn, "post");
    },

    addProduct: async (dtoIn) => {
      return await Call(
        baseUri,
        "shopping-lists/add-product",
        dtoIn,
        "post"
      );
    },

    updateProduct: async (dtoIn) => {
      return await Call(
        baseUri,
        "shopping-lists/update-product",
        dtoIn,
        "post"
      );
    },

    removeProduct: async (dtoIn) => {
      return await Call(
        baseUri,
        "shopping-lists/remove-product",
        dtoIn,
        "post"
      );
    },

    changeProductStatus: async (dtoIn) => {
      return await Call(
        baseUri,
        "shopping-lists/change-product-status",
        dtoIn,
        "post"
      );
    },
  },
};

export default FetchHelper;