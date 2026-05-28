import { useEffect, useState } from "react";

import FetchHelper from "../fetch-helper";

function ProductListProvider({ children }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadProducts() {
    setLoading(true);
    setError(null);

    try {
      const response = await FetchHelper.product.list();

      if (response.ok) {
        setProductList(response.data.data || []);
      } else {
        setError(response.data);
      }
    } catch (error) {
      setError(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return <h3>Načítavam produkty...</h3>;
  }

  if (error) {
    return <h3>Nepodarilo sa načítať produkty.</h3>;
  }

  return children({
    productList,
    loadProducts,
  });
}

export default ProductListProvider;