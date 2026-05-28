import { useState } from "react";

import Button from "react-bootstrap/Button";

import ShoppingListProvider from "./shopping-list-provider";
import ShoppingListItem from "./shopping-list-item";
import ShoppingListForm from "./shopping-list-form";
import ShoppingListDeleteDialog from "./shopping-list-delete-dialog";
import ShoppingListDetail from "./shopping-list-detail";

function ShoppingList() {
  const [showShoppingListForm, setShowShoppingListForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedShoppingList, setSelectedShoppingList] = useState(null);
  const [selectedDetailShoppingList, setSelectedDetailShoppingList] =
    useState(null);

  function handleCreate() {
    setSelectedShoppingList(null);
    setShowShoppingListForm(true);
  }

  function handleUpdate(shoppingList) {
    setSelectedShoppingList(shoppingList);
    setShowShoppingListForm(true);
  }

  function handleDelete(shoppingList) {
    setSelectedShoppingList(shoppingList);
    setShowDeleteDialog(true);
  }

  function handleOpenDetail(shoppingList) {
    setSelectedDetailShoppingList(shoppingList);
  }

  function handleBackToList() {
    setSelectedDetailShoppingList(null);
  }

  function handleCloseForm() {
    setSelectedShoppingList(null);
    setShowShoppingListForm(false);
  }

  function handleCloseDeleteDialog() {
    setSelectedShoppingList(null);
    setShowDeleteDialog(false);
  }

  return (
    <ShoppingListProvider>
      {({ shoppingListList, loadShoppingLists }) => {
        if (selectedDetailShoppingList) {
          return (
            <ShoppingListDetail
              shoppingList={selectedDetailShoppingList}
              onBack={handleBackToList}
            />
          );
        }

        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-3 fw-semibold mb-0">
                Moje nákupné zoznamy
                {shoppingListList.length > 0 &&
                  ` (${shoppingListList.length})`}
              </h1>

              <Button variant="success" onClick={handleCreate}>
                Vytvoriť nový zoznam
              </Button>
            </div>

            {shoppingListList.length === 0 && (
              <p>Zatiaľ nemáte uložené žiadne nákupné zoznamy.</p>
            )}

            {shoppingListList.map((shoppingList) => {
              return (
                <ShoppingListItem
                  key={shoppingList.id}
                  shoppingList={shoppingList}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onOpenDetail={handleOpenDetail}
                />
              );
            })}

            <ShoppingListForm
              show={showShoppingListForm}
              shoppingList={selectedShoppingList}
              onClose={handleCloseForm}
              onSave={loadShoppingLists}
            />

            <ShoppingListDeleteDialog
              show={showDeleteDialog}
              shoppingList={selectedShoppingList}
              onClose={handleCloseDeleteDialog}
              onDelete={loadShoppingLists}
            />
          </>
        );
      }}
    </ShoppingListProvider>
  );
}

export default ShoppingList;