import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar() {
  const location = useLocation();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-maroon">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Oggatonama
        </Link>
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
              <Link
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/register" ? "active" : ""}`}
                to="/register"
              >
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/search" ? "active" : ""}`}
                to="/search"
              >
                Search
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
                to="/profile"
              >
                Profile
              </Link>
            </li>
          </ul>
          <Link to="/profile" className="d-none d-lg-block">
            <button className="btn btn-outline-light rounded-circle ms-3">
              <i className="bi bi-person"></i>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
