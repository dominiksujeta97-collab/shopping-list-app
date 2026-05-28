import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { FaEdit, FaTrash } from "react-icons/fa";

function ProductItem({ product, onUpdate, onDelete }) {
  return (
    <Card className="mb-3 shadow-sm border-0">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fs-5 fw-semibold">{product.name}</h5>

        <div className="d-flex gap-2">
          <Button variant="outline-dark" size="sm" onClick={() => onUpdate(product)}>
            <FaEdit />
          </Button>

          <Button variant="outline-danger" size="sm" onClick={() => onDelete(product)}>
            <FaTrash />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductItem;