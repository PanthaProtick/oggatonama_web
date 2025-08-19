import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="text-light mb-3 footer-title">About Oggatonama</h5>
            <p className="text-light opacity-75">
              Helping Families Find Their Loved Ones
            </p>
          </Col>
          <Col md={4} className="mb-4">
            <h5 className="text-light mb-3 footer-title">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/HeroSection"
                  className="text-light opacity-75 text-decoration-none hover-white"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/dashboard"
                  className="text-light opacity-75 text-decoration-none hover-white"
                >
                  Register a body
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/challenges"
                  className="text-light opacity-75 text-decoration-none hover-white"
                >
                  Search for a body
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/challenges"
                  className="text-light opacity-75 text-decoration-none hover-white"
                >
                  Login
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/challenges"
                  className="text-light opacity-75 text-decoration-none hover-white"
                >
                  Register
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4} className="mb-4">
            <h5 className="text-light mb-3 footer-title">Contact Us</h5>
            <p className="text-light opacity-75">Email: info@oggatonama.com</p>
            <div className="social-links">
              <a
                href="https://facebook.com"
                className="text-light opacity-75 me-3 hover-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a
                href="https://twitter.com"
                className="text-light opacity-75 me-3 hover-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a
                href="https://linkedin.com"
                className="text-light opacity-75 hover-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs={12}>
            <hr className="border-light opacity-25" />
            <p className="text-center text-light opacity-75 mb-0">
              &copy; {new Date().getFullYear()} Oggatonama. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
