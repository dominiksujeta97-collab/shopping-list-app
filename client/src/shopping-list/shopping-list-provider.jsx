import { useEffect, useState } from "react";

import FetchHelper from "../fetch-helper";

function ShoppingListProvider({ children }) {
  const [shoppingListList, setShoppingListList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadShoppingLists() {
    setLoading(true);
    setError(null);

    try {
      const response = await FetchHelper.shoppingList.list();

      if (response.ok) {
        setShoppingListList(response.data.data || []);
      } else {
        setError(response.data);
      }
    } catch (error) {
      setError(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadShoppingLists();
  }, []);

  if (loading) {
    return <h3>Načítavam nákupné zoznamy...</h3>;
  }

  if (error) {
    return <h3>Nepodarilo sa načítať nákupné zoznamy.</h3>;
  }

  return children({
    shoppingListList,
    loadShoppingLists,
  });
}

export default ShoppingListProvider;