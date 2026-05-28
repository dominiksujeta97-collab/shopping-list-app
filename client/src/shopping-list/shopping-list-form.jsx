import { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

import FetchHelper from "../fetch-helper";

function ShoppingListForm({ show, onClose, onSave, shoppingList }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const isUpdate = !!shoppingList;

  useEffect(() => {
    setName(shoppingList ? shoppingList.name : "");
    setError(null);
  }, [shoppingList, show]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Názov nákupného zoznamu je povinný.");
      return;
    }

    const response = isUpdate
      ? await FetchHelper.shoppingList.update({
          shoppingListId: shoppingList.id,
          name: name.trim(),
        })
      : await FetchHelper.shoppingList.create({
          name: name.trim(),
        });

    if (response.ok) {
      onSave();
      handleClose();
    } else {
      setError("Nákupný zoznam sa nepodarilo uložiť.");
    }
  }

  function handleClose() {
    setName("");
    setError(null);
    onClose();
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isUpdate ? "Upraviť nákupný zoznam" : "Vytvoriť nový zoznam"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group>
            <Form.Label>Názov zoznamu</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Zadajte názov nákupného zoznamu"
              onChange={(event) => setName(event.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Zrušiť
          </Button>

          <Button variant="success" type="submit">
            Uložiť
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ShoppingListForm;