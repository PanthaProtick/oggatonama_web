import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-maroon">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          Oggatonama
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Register
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Search
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Profile
              </a>
            </li>
          </ul>
          <button className="btn btn-outline-light rounded-circle ms-3 d-none d-lg-block">
            <i className="bi bi-person"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
