import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './css/SignIn.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    if (newPassword !== confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password has been reset. You can now sign in.');
        setTimeout(() => navigate('/signin'), 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
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
              <h3>Choose a new password</h3>
              <p>Enter a secure password to continue</p>
            </div>
          </div>
          <div className="auth-form">
            <h2 className="panel-title">Reset Password</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input className="form-control" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input className="form-control" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <button className="btn btn-teal btn-signin" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
