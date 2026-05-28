import { useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import FetchHelper from "../fetch-helper";

function ProductItemDeleteDialog({
  show,
  shoppingList,
  productItem,
  productName,
  onClose,
  onDelete,
}) {
  const [error, setError] = useState(null);

  async function handleDelete() {
    setError(null);

    const response = await FetchHelper.shoppingList.removeProduct({
      shoppingListId: shoppingList.id,
      productId: productItem.productId,
    });

    if (response.ok) {
      onDelete(response.data.data);
      handleClose();
    } else {
      setError("Produkt sa nepodarilo odstrániť zo zoznamu.");
    }
  }

  function handleClose() {
    setError(null);
    onClose();
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Odstrániť produkt</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <p>
          Naozaj chcete odstrániť produkt{" "}
          <strong>{productName}</strong> zo zoznamu?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Zrušiť
        </Button>

        <Button variant="danger" onClick={handleDelete}>
          Odstrániť
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductItemDeleteDialog;