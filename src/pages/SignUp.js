import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './css/SignUp.css';

function SignUp() {
  return (
    <div className="sign-up-wrapper auth-bg">
      <Navbar />
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="left-hero" style={{backgroundImage: `url(${process.env.PUBLIC_URL + '/deadbody.jpeg'})`}}>
            <div className="hero-text">
              <h3>Create an account</h3>
              <p>Join Oggatonama to help families reconnect</p>
            </div>
          </div>
          <div className="auth-form">
            <button className="panel-close" aria-label="close">×</button>
            <h2 className="panel-title">Sign up</h2>
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <input className="form-control" type="text" placeholder="Your full name" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" placeholder="you@example.com" />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" placeholder="Choose a password" />
            </div>
              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input className="form-control" type="tel" placeholder="Enter your contact number" />
              </div>
              <div className="mb-3">
                <label className="form-label">NID Number</label>
                <input className="form-control" type="text" placeholder="Enter your NID number" />
              </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span></span>
            </div>
            <button className="btn btn-teal btn-signup">Create account</button>
            <div className="bottom-link">Already have an account? <Link to="/signin">Sign in</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
