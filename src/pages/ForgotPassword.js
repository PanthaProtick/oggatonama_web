import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './css/SignIn.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
  const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      // Try to parse JSON safely
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error('Failed to parse JSON response:', parseErr);
        const text = await res.text();
        throw new Error(text || 'Unexpected response from server');
      }

      if (res.ok) {
        setMessage(data.message || 'If an account exists, a verification code has been sent.');
        setShowResetForm(true);
      } else {
        setError(data.error || 'Failed to request reset');
      }
    } catch (err) {
      console.error('Forgot password request failed:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
  const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password has been reset successfully!');
        setShowResetForm(false);
        setRedirecting(true);
        
        // Countdown and redirect
        let timeLeft = 3;
        setCountdown(timeLeft);
        
        const timer = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          
          if (timeLeft <= 0) {
            clearInterval(timer);
            navigate('/signin');
          }
        }, 1000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password failed:', err);
      setError('Network error');
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
              <h3>{showResetForm ? 'Reset Password' : 'Forgot Password'}</h3>
              <p>{showResetForm ? 'Enter the code sent to your email and your new password' : 'Enter your email to receive a verification code'}</p>
            </div>
          </div>
          <div className="auth-form">
            <h2 className="panel-title">{showResetForm ? 'Reset Password' : 'Forgot Password'}</h2>
            {message && <div className="alert alert-success">
              {message}
              {redirecting && (
                <div className="mt-2">
                  <small>Redirecting to login in {countdown} seconds...</small>
                </div>
              )}
            </div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {redirecting ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Redirecting...</span>
                </div>
                <p className="mt-2">Taking you to the login page...</p>
              </div>
            ) : !showResetForm ? (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    className="form-control" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <button className="btn btn-teal btn-signin" disabled={loading}>
                  {loading ? 'Sending...' : 'Send verification code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    className="form-control" 
                    type="email" 
                    value={email} 
                    readOnly
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Verification Code</label>
                  <input 
                    className="form-control" 
                    type="text" 
                    value={verificationCode} 
                    onChange={e => setVerificationCode(e.target.value)} 
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input 
                    className="form-control" 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="Enter new password"
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    className="form-control" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    placeholder="Confirm new password"
                    required 
                  />
                </div>
                <button className="btn btn-teal btn-signin" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <div className="mt-3">
                  <button 
                    type="button" 
                    className="btn btn-link" 
                    onClick={() => setShowResetForm(false)}
                  >
                    ← Back to email entry
                  </button>
                </div>
              </form>
            )}
            
            {!redirecting && (
              <div className="bottom-link mt-3">
                Remember your password? <Link to="/signin">Sign in</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
