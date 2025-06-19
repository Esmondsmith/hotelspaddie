import React, { useState } from 'react';
import { Menu, X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import login_hotel_logo from '../Components/Assets/hotel_logo.png';
import './CSS/Login.css'
// import Navbar from '../Components/Navbar/Navbar';

const Login = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };  

  return (
    <div className="login-container">
      {/* <Navbar /> */}
      {/* Navigation Header */}
      <nav className="login-nav">
        <div className="login-nav-container">
          <div className="nav-content">
            <div className="logo">
              <div className='login-logo'>
               <a href="/"> <img src={login_hotel_logo} alt="hotel logo" height="20px" width="150px" /> </a> 
              </div>
            </div>
            {/* Desktop Navigation */}
            <div className="login-desktop-nav">
              <a href="/" className="login-home-link">Home</a>
              <a href="/hotels" className="nav-link">Hotel</a>
              <a href="/about" className="nav-link">About</a>
              <a href="/contact" className="nav-link">Contact</a>
              <a href="/signup" className="login-btn">Sign Up</a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-menu ${!isMenuOpen ? 'hidden' : ''}`}>
          <div className="mobile-menu-content">
            <a href="/" className="nav-link">Home</a>
            <a href="/hotels" className="nav-link">Hotel</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
            <a href="/signup" className="mobile-login-btn">Sign Up</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="login-form-wrapper">
          <div className="form-container">
            {/* Logo Section */}
            <div className="login-logo">
                <img src={login_hotel_logo} alt="hotel logo" height="18px" width="120px" />
              <h3>Login</h3>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="form-content">
              {/* Email Field */}
              <div className="field-group">
                <label htmlFor="email" className="field-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-btn"
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
              <button type="submit" className="login-submit-btn">
                Login
              </button>

              {/* Login Link */}
              <p className="login-link">
                Don't have an account?{' '}
                <a href="/signup" className="login-link-anchor">
                  Sign Up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;