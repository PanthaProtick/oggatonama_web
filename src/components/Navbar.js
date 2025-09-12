import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-maroon">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-heart-pulse me-2" style={{ fontSize: '1.2rem', color: '#ff6b6b' }}></i>
          Oggatonama
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
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
            {isAuthenticated() && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
                  to="/profile"
                >
                  Profile
                </Link>
              </li>
            )}
            {!isAuthenticated() ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/signin" ? "active" : ""}`}
                    to="/signin"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/signup" ? "active" : ""}`}
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    padding: '6px 16px',
                    borderRadius: '25px',
                    transition: 'all 0.3s ease',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                    {user?.profilePhoto ? (
                      <img 
                        src={user.profilePhoto} 
                        alt="Profile" 
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid rgba(255,255,255,0.9)',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div 
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid rgba(255,255,255,0.9)',
                          flexShrink: 0
                        }}
                      >
                        <i className="bi bi-person" style={{ fontSize: '16px' }}></i>
                      </div>
                    )}
                    <span 
                      className="text-nowrap d-lg-inline d-md-none d-sm-inline" 
                      style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: '500',
                        lineHeight: '1.2',
                        color: 'rgba(255,255,255,0.95)'
                      }}
                    >
                      {user?.fullName || 'User'}
                    </span>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown" style={{ minWidth: '200px' }}>
                  <li>
                    <div className="dropdown-header d-flex align-items-center py-2">
                      {user?.profilePhoto ? (
                        <img 
                          src={user.profilePhoto} 
                          alt="Profile" 
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: '12px'
                          }}
                        />
                      ) : (
                        <div 
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#008080',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px'
                          }}
                        >
                          <i className="bi bi-person text-white" style={{ fontSize: '18px' }}></i>
                        </div>
                      )}
                      <div>
                        <div className="fw-bold">{user?.fullName || 'User'}</div>
                        <small className="text-muted">{user?.email}</small>
                      </div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="bi bi-person me-3"></i>My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/register">
                      <i className="bi bi-plus-circle me-3"></i>Register Dead Body
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-3"></i>Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
