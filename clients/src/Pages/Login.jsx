import React, { useState } from 'react';
import { Menu, X, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import login_hotel_logo from '../Components/Assets/hotel_logo.png';
import './CSS/Login.css'
import Navbar from '../Components/Navbar/Navbar';
import { login } from '../services/authService';


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Get redirect information from location state
  const redirectInfo = location.state || {};
  const redirectTo = redirectInfo.from || '/user-profile';
  const bookingData = redirectInfo.hotel && redirectInfo.room ? {
    hotel: redirectInfo.hotel,
    room: redirectInfo.room
  } : null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.username.trim()) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        
        // Show appropriate success message based on redirect destination
        if (redirectTo === '/booking' && bookingData) {
          setSuccess('Login successful! Continuing with your booking...');
        } else {
          setSuccess('Login successful! Redirecting...');
        }
        
        // Delay to show success message before redirecting
        setTimeout(() => {
          
          // If user was trying to book, redirect back to booking page
          if (redirectTo === '/booking' && bookingData) {
            navigate('/booking', { 
              state: { 
                hotel: bookingData.hotel,
                room: bookingData.room,
                from: '/login'
              } 
            });
          } else {
            navigate(redirectTo);
          }
        }, 1000);
      } else {
        setError(result.message || 'Login failed. Please try again.');
        console.error('Login failed:', result);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="login-container">
      {/* Navigation Header */}      
      <Navbar />

      {/* Main Content */}
      <div className="main-content">
        <div className="login-form-wrapper">
          <div className="form-container">
            {/* Logo Section */}
            <div className="login-logo">
                <img src={login_hotel_logo} alt="hotel logo" height="18px" width="120px" />
              <h3>Login</h3>
            </div>

            {/* Show redirect message if coming from booking */}
            {redirectTo === '/booking' && bookingData && (
              <div className="redirect-message" style={{
                backgroundColor: '#e7f3ff',
                color: '#0056b3',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #b3d9ff',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                <strong>Complete Your Booking</strong><br />
                <span style={{ fontSize: '12px', opacity: 0.8 }}>
                  Hotel: {bookingData.hotel.title}<br />
                  Room: {bookingData.room.title || 'Selected Room'}
                </span><br />
                <span style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                  Please login to continue with your booking. You'll be returned to complete the process.
                </span>
              </div>
            )}

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="form-content">
              {/* Error Message */}
              {error && (
                <div className="error-message" style={{
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  padding: '10px',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  border: '1px solid #f5c6cb'
                }}>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="success-message" style={{
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  padding: '10px',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  border: '1px solid #c3e6cb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle size={16} />
                  {success}
                </div>
              )}

              {/* Username Field */}
              <div className="field-group">
                <label htmlFor="username" className="field-label">
                  Username
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your username"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="field-group">
                <label htmlFor="password" className="field-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input password-input"
                    placeholder="Enter password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-btn"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms and Policy */}
              <div className="policy">
                <p>
                  <strong>By continuing, you agree to our</strong>{' '}
                  <a href="#" className="policy-link">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="policy-link">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="login-submit-btn"
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              {/* Sign Up Link */}
              <div className="signup-link">
                <p>
                  Don't have an account?{' '}
                  <a href="/signup" className="signup-link-text">
                    Sign up here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;