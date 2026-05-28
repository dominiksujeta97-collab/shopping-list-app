import { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import FetchHelper from "../fetch-helper";

const UNIT_LIST = ["ks", "g", "kg", "ml", "l"];

function ShoppingListItemForm({
  show,
  shoppingList,
  productList,
  productItem,
  onClose,
  onSave,
}) {
  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("ks");
  const [error, setError] = useState(null);

  const isUpdate = !!productItem;

  useEffect(() => {
    if (productItem) {
      setProductId(productItem.productId);
      setAmount(productItem.amount);
      setUnit(productItem.unit);
    } else {
      setProductId("");
      setAmount("");
      setUnit("ks");
    }

    setError(null);
  }, [productItem, show]);

  const availableProducts = productList.filter((product) => {
    return !shoppingList.productList.some(
      (item) => item.productId === product.id
    );
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!productId) {
      setError("Produkt je povinný.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Množstvo musí byť väčšie ako 0.");
      return;
    }

    const response = isUpdate
      ? await FetchHelper.shoppingList.updateProduct({
          shoppingListId: shoppingList.id,
          productId,
          amount: Number(amount),
          unit,
        })
      : await FetchHelper.shoppingList.addProduct({
          shoppingListId: shoppingList.id,
          productId,
          amount: Number(amount),
          unit,
        });

    if (response.ok) {
      handleClose();
      onSave(response.data.data);
    } else {
      setError("Položku sa nepodarilo uložiť.");
    }
  }

  function handleClose() {
    setProductId("");
    setAmount("");
    setUnit("ks");
    setError(null);
    onClose();
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isUpdate ? "Upraviť položku" : "Pridať produkt"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {!isUpdate && productList.length === 0 && (
  <Alert variant="info">
    Najskôr vytvorte produkt v sekcii Produkty.
  </Alert>
)}

{!isUpdate && productList.length > 0 && availableProducts.length === 0 && (
  <Alert variant="info">
    Všetky produkty už sú v tomto nákupnom zozname.
  </Alert>
)}

          <Form.Group className="mb-3">
            <Form.Label>Produkt</Form.Label>
            <Form.Select
              value={productId}
              disabled={isUpdate}
              onChange={(event) => setProductId(event.target.value)}
            >
              <option value="">Vyberte produkt</option>

              {(isUpdate ? productList : availableProducts).map((product) => {
                return (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Množstvo</Form.Label>
            <Form.Control
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              placeholder="Zadajte množstvo"
              onChange={(event) => setAmount(event.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Jednotka</Form.Label>
            <Form.Select
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
            >
              {UNIT_LIST.map((unit) => {
                return (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Zrušiť
          </Button>

          <Button
            variant="success"
            type="submit"
            disabled={!isUpdate && availableProducts.length === 0}
          >
            Uložiť
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ShoppingListItemForm;