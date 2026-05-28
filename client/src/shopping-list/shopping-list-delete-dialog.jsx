import { useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import FetchHelper from "../fetch-helper";

function ShoppingListDeleteDialog({ show, shoppingList, onClose, onDelete }) {
  const [error, setError] = useState(null);

  async function handleDelete() {
    setError(null);

    const response = await FetchHelper.shoppingList.delete({
      shoppingListId: shoppingList.id,
    });

    if (response.ok) {
      onDelete();
      handleClose();
    } else {
      setError("Nákupný zoznam sa nepodarilo vymazať.");
    }
  }

  function handleClose() {
    setError(null);
    onClose();
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Vymazať nákupný zoznam</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <p>
          Naozaj chcete vymazať nákupný zoznam{" "}
          <strong>{shoppingList?.name}</strong>?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Zrušiť
        </Button>

        <Button variant="danger" onClick={handleDelete}>
          Vymazať
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShoppingListDeleteDialog;