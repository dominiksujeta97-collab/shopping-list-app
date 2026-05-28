import { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

import FetchHelper from "../fetch-helper";

function ProductForm({ show, onClose, onSave }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Názov produktu je povinný.");
      return;
    }

    const response = await FetchHelper.product.create({
      name: name.trim(),
    });

    if (response.ok) {
      setName("");
      onSave();
      onClose();
    } else {
      setError("Produkt sa nepodarilo uložiť.");
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
          <Modal.Title>Pridať produkt</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group>
            <Form.Label>Názov produktu</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Zadajte názov produktu"
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

export default ProductForm;