import { useLocation, useNavigate } from "react-router-dom";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { FaShoppingBasket } from "react-icons/fa";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Navbar
      expand="md"
      className="bg-dark border-bottom shadow-sm px-4"
      data-bs-theme="dark"
    >
      <div className="d-flex w-100 align-items-center">
        <Navbar.Brand
          className="d-flex align-items-center gap-2 fw-semibold"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <FaShoppingBasket />

          <span>Shoplist</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar"
          className="ms-auto"
        />

        <Navbar.Collapse
          id="main-navbar"
          className="justify-content-end"
        >
          <Nav>
            <Nav.Link
              onClick={() => navigate("/")}
              active={location.pathname === "/"}
            >
              Nákupné zoznamy
            </Nav.Link>

            <Nav.Link
              onClick={() => navigate("/products")}
              active={location.pathname === "/products"}
            >
              Produkty
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Navigation;