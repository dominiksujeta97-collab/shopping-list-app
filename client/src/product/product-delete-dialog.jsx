import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";

import FetchHelper from "../fetch-helper";

function ProductDeleteDialog({ show, product, onClose, onDelete }) {
  const [error, setError] = useState(null);
  const [deleteBlocked, setDeleteBlocked] = useState(false);

  async function handleDelete() {
    setError(null);
    setDeleteBlocked(false);

    const response = await FetchHelper.product.delete({
      productId: product.id,
    });

    if (response.ok) {
      onDelete();
      onClose();
    } else if (response.data.code === "productIsUsedInShoppingList") {
      setDeleteBlocked(true);

      const shoppingListName = response.data.shoppingListName;

      setError(
        shoppingListName
          ? `Produkt nie je možné vymazať, pretože sa nachádza v nákupnom zozname „${shoppingListName}“.`
          : "Produkt nie je možné vymazať, pretože sa nachádza v nákupnom zozname."
      );
    } else {
      setError("Produkt sa nepodarilo vymazať.");
    }
  }

  function handleClose() {
    setError(null);
    setDeleteBlocked(false);
    onClose();
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Vymazať produkt</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {!deleteBlocked && (
          <p>
            Naozaj chcete vymazať produkt{" "}
            <strong>{product?.name}</strong>?
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Zrušiť
        </Button>

        {!deleteBlocked && (
          <Button variant="danger" onClick={handleDelete}>
            Vymazať
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ProductDeleteDialog;