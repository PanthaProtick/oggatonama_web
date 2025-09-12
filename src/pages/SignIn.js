import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import './css/SignIn.css';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Use AuthContext login method
        login(data.token, data.user);
        
        // Redirect to intended page or dashboard
        navigate(from, { replace: true });
      } else {
        setError(data.error || 'Failed to sign in');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
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
            
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input 
                  className="form-control" 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com" 
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input 
                  className="form-control" 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password" 
                  required
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <button type="button" className="forgot-link">Forgot password?</button>
              </div>
              <button 
                type="submit" 
                className="btn btn-teal btn-signin" 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
            <div className="bottom-link">Don't have an account? <Link to="/signup">Signup</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
