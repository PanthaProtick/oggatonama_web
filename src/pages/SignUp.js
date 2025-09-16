import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import './css/SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
    nidNumber: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      console.log('🚀 Starting signup process...');
      console.log('Form data:', formData);
      console.log('Profile photo:', profilePhoto);
      
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
        console.log(`Added to FormData: ${key} = ${value}`);
      });
      if (profilePhoto) {
        submitData.append('profilePhoto', profilePhoto);
        console.log('Added profile photo to FormData:', profilePhoto.name, profilePhoto.size, 'bytes');
      }

      console.log('📤 Sending request to signup API...');
  const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: submitData
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        setSuccess('Account created successfully! Redirecting to dashboard...');
        
        // Auto-signin the user after successful registration
        // Generate a login token by calling signin API
  const signinResponse = await fetch('http://localhost:5000/api/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
        if (signinResponse.ok) {
          const signinData = await signinResponse.json();
          login(signinData.token, signinData.user);
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          // If auto-signin fails, just show success and redirect to signin
          setTimeout(() => {
            navigate('/signin');
          }, 2000);
        }
        
        // Clear form
        setFormData({
          fullName: '',
          email: '',
          password: '',
          contactNumber: '',
          nidNumber: ''
        });
        setProfilePhoto(null);
        setPhotoPreview(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      console.error('❌ Signup error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError('Network error. Please try again. Check console for details.');
    } finally {
      setLoading(false);
    }
  };
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
            
            {success && <div className="alert alert-success mb-3">{success}</div>}
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full name</label>
                <input 
                  className="form-control" 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name" 
                  required
                />
              </div>
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
                  placeholder="Choose a password" 
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input 
                  className="form-control" 
                  type="tel" 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your contact number" 
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">NID Number</label>
                <input 
                  className="form-control" 
                  type="text" 
                  name="nidNumber"
                  value={formData.nidNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your NID number" 
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Profile Photo</label>
                <input 
                  className="form-control" 
                  type="file" 
                  name="profilePhoto"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  required
                />
                {photoPreview && (
                  <div className="photo-preview mt-2 text-center">
                    <img 
                      src={photoPreview} 
                      alt="Profile Preview" 
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #ddd'
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span></span>
              </div>
              <button 
                type="submit" 
                className="btn btn-teal btn-signup" 
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
            <div className="bottom-link">Already have an account? <Link to="/signin">Sign in</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
