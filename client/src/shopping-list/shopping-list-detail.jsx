import { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { FaEdit, FaTrash } from "react-icons/fa";

import FetchHelper from "../fetch-helper";
import ShoppingListItemForm from "./shopping-list-item-form";
import ProductItemDeleteDialog from "./product-item-delete-dialog";

function ShoppingListDetail({ shoppingList, onBack }) {
  const [currentShoppingList, setCurrentShoppingList] = useState(shoppingList);
  const [productList, setProductList] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProductItem, setSelectedProductItem] = useState(null);
  const [selectedProductItemForUpdate, setSelectedProductItemForUpdate] =
    useState(null);

  async function loadShoppingList() {
    const response = await FetchHelper.shoppingList.get({
      shoppingListId: shoppingList.id,
    });

    if (response.ok) {
      setCurrentShoppingList(response.data.data);
    }
  }

  async function loadProducts() {
    const response = await FetchHelper.product.list();

    if (response.ok) {
      setProductList(response.data.data || []);
    }
  }

  useEffect(() => {
    loadProducts();
    loadShoppingList();
  }, []);

  function getProductName(productId) {
    const product = productList.find((product) => product.id === productId);
    return product ? product.name : "Neznámy produkt";
  }

  async function handleChangeStatus(item) {
    const response = await FetchHelper.shoppingList.changeProductStatus({
      shoppingListId: currentShoppingList.id,
      productId: item.productId,
      purchased: !item.purchased,
    });

    if (response.ok) {
      setCurrentShoppingList(response.data.data);
    }
  }

  function handleOpenCreateForm() {
    setSelectedProductItemForUpdate(null);
    setShowItemForm(true);
  }

  function handleOpenUpdateForm(item) {
    setSelectedProductItemForUpdate(item);
    setShowItemForm(true);
  }

  function handleCloseItemForm() {
    setSelectedProductItemForUpdate(null);
    setShowItemForm(false);
  }

  function handleOpenDeleteDialog(item) {
    setSelectedProductItem(item);
    setShowDeleteDialog(true);
  }

  function handleCloseDeleteDialog() {
    setSelectedProductItem(null);
    setShowDeleteDialog(false);
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="fs-3 fw-semibold mb-0">
          {currentShoppingList.name}
        </h1>
      </div>

      <div className="border rounded p-4">
        {currentShoppingList.productList.length === 0 ? (
          <p className="mb-0">
            Tento nákupný zoznam je prázdny.
          </p>
        ) : (
          <table className="w-100">
            <thead>
              <tr style={{ borderBottom: "1px solid #dee2e6" }}>
                <th className="pb-3">Produkt</th>
                <th className="pb-3">Množstvo</th>
                <th className="pb-3">Jednotka</th>
                <th className="pb-3">Kúpené</th>
                <th className="pb-3"></th>
              </tr>
            </thead>

            <tbody>
              {currentShoppingList.productList.map((item) => {
                return (
                  <tr key={item.productId}>
                    <td className="py-3">{getProductName(item.productId)}</td>
                    <td className="py-3">{item.amount}</td>
                    <td className="py-3">{item.unit}</td>

                    <td className="py-3">
                      <Form.Check
                        type="checkbox"
                        checked={item.purchased}
                        onChange={() => handleChangeStatus(item)}
                        className="success-checkbox"
                        style={{ transform: "scale(1.2)" }}
                      />
                    </td>

                    <td className="py-3 text-end">
                      <div className="d-flex gap-3 justify-content-end">
                        <FaEdit
                          style={{ cursor: "pointer", color: "#212529" }}
                          onClick={() => handleOpenUpdateForm(item)}
                        />

                        <FaTrash
                          style={{ cursor: "pointer", color: "#dc3545" }}
                          onClick={() => handleOpenDeleteDialog(item)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="d-flex gap-2 mt-4">
        <Button variant="success" onClick={handleOpenCreateForm}>
          Pridať produkt
        </Button>

        <Button variant="outline-dark" onClick={onBack}>
          Späť
        </Button>
      </div>

      <ShoppingListItemForm
        show={showItemForm}
        shoppingList={currentShoppingList}
        productList={productList}
        productItem={selectedProductItemForUpdate}
        onClose={handleCloseItemForm}
        onSave={setCurrentShoppingList}
      />

      <ProductItemDeleteDialog
        show={showDeleteDialog}
        shoppingList={currentShoppingList}
        productItem={selectedProductItem}
        productName={
          selectedProductItem
            ? getProductName(selectedProductItem.productId)
            : ""
        }
        onClose={handleCloseDeleteDialog}
        onDelete={setCurrentShoppingList}
      />
    </>
  );
}

export default ShoppingListDetail;