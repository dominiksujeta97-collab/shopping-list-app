import { useState } from "react";

import Button from "react-bootstrap/Button";

import ProductListProvider from "./product-list-provider";
import ProductItem from "./product-item";
import ProductForm from "./product-form";
import ProductDeleteDialog from "./product-delete-dialog";

function ProductList() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function handleCreate() {
    setSelectedProduct(null);
    setShowProductForm(true);
  }

  function handleUpdate(product) {
    setSelectedProduct(product);
    setShowProductForm(true);
  }

  function handleDelete(product) {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  }

  function handleCloseForm() {
    setSelectedProduct(null);
    setShowProductForm(false);
  }

  function handleCloseDeleteDialog() {
    setSelectedProduct(null);
    setShowDeleteDialog(false);
  }

  return (
    <ProductListProvider>
      {({ productList, loadProducts }) => {
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-3 fw-semibold mb-0">Produkty</h1>

              <Button variant="success" onClick={handleCreate}>
                Pridať produkt
              </Button>
            </div>

            {productList.length === 0 && (
              <p>Zatiaľ nemáte uložené žiadne produkty.</p>
            )}

            {productList.map((product) => {
              return (
                <ProductItem
                  key={product.id}
                  product={product}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              );
            })}

            <ProductForm
              show={showProductForm}
              product={selectedProduct}
              onClose={handleCloseForm}
              onSave={loadProducts}
            />

            <ProductDeleteDialog
              show={showDeleteDialog}
              product={selectedProduct}
              onClose={handleCloseDeleteDialog}
              onDelete={loadProducts}
            />
          </>
        );
      }}
    </ProductListProvider>
  );
}

export default ProductList;