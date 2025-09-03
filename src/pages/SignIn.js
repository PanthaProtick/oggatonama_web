import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './css/SignIn.css';

function SignIn() {
  return (
    <div className="sign-in-wrapper auth-bg">
      <Navbar />
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="left-hero" style={{backgroundImage: `url(${process.env.PUBLIC_URL + '/deadbody.jpeg'})`}}>
            <div className="hero-text">
              <h3>Welcome Back</h3>
              <p>Sign in to continue to Oggatonama</p>
            </div>
          </div>
          <div className="auth-form">
            <button className="panel-close" aria-label="close">×</button>
            <h2 className="panel-title">LOGIN</h2>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" placeholder="you@example.com" />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" placeholder="Enter your password" />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            <button className="btn btn-teal btn-signin">Login</button>
            <div className="bottom-link">Don't have an account? <Link to="/signup">Signup</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
