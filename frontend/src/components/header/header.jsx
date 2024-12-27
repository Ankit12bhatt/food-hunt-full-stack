import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function NavScrollExample() {
  return (
    <Navbar expand="lg" style={{ backgroundColor: "#04292A" }}>
      <Container fluid>
        {/* <Navbar.Brand href="#">Navbar scroll</Navbar.Brand> */}
        <img src={require("../../assets/Logo.png")} alt="loading" width="10%" />
        {/* <Navbar.Toggle aria-controls="navbarScroll" /> */}
        <Navbar.Collapse
          id="navbarScroll"
          className="d-flex justify-content-end"
        >
          <Nav
            className="me-auto my-2 my-lg-0 "
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link to="/" className="nav-link active text-light">
              Home
            </Link>
          </Nav>
          <div className="d-flex align-items-center">
            <Link to="signIn" className="nav-link active text-light px-4">
              SignIn
            </Link>
            <button
              className="btn btn-light rounded-5 text-dark"
              style={{ marginRight: "50px" }}
            >
              <Link to="/signUp" className="nav-link active text-dark">
                Sign Up
              </Link>
            </button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
