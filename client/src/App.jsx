import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout";
import ShoppingList from "./shopping-list/shopping-list";
import ProductList from "./product/product-list";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ShoppingList />} />
          <Route path="products" element={<ProductList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;