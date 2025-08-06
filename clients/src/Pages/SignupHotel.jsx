import React, { useState, useEffect } from 'react';
import { Menu, X, User, Mail, Lock, Eye, EyeOff, Phone, ArrowLeftFromLine, Globe } from 'lucide-react';
import login_hotel_logo from '../Components/Assets/hotel_logo.png';
import './CSS/SignUp.css';
import Navbar from '../Components/Navbar/Navbar';
import { useNavigate } from "react-router-dom"; 


// HOTEL OWNER REGISTRATION
const SignupHotel = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({ 
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gender: '',
    country: '',
    address: ''
  });
  

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        
        const data = await response.json();
        
        // Sort countries alphabetically by name
        const sortedCountries = data
          .map(country => ({
            code: country.cca2,
            name: country.name.common
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to load countries. Please refresh the page.');
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || 
        !formData.password || !formData.phoneNumber.trim() || !formData.gender || !formData.country || !formData.address) {
      setError('Please fill in all fields');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Phone number validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      setError('Please enter a valid phone number');
      return false;
    }
    
    // Password length check
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const generateUsername = (firstName, lastName) => {
    // Create a more unique username with timestamp
    const timestamp = Date.now().toString().slice(-4);
    return `${firstName}${lastName}${timestamp}`.toLowerCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const username = generateUsername(formData.firstName, formData.lastName);
      
      const payload = {
        name: [{ value: username }],
        mail: [{ value: formData.email.trim() }],
        pass: [{ value: formData.password }],
        status: [{ value: true }],
        field_first_name: [{ value: formData.firstName.trim() }],
        field_last_name: [{ value: formData.lastName.trim() }],
        field_phone_number: [{ value: formData.phoneNumber.trim() }],
        field_gender: [{ value: formData.gender }],
        field_nationality: [{ value: formData.country }],
        field_address: [{ value: formData.address.trim() }],
      };

      console.log('Sending registration payload:', JSON.stringify(payload, null, 2));

      // Using local server endpoint so as to avoid CORS issues
      const apiUrl = 'http://localhost:3001/api/Register';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Please check your email for verification.');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phoneNumber: '',
          gender: '',
          country: '',
          address: '' 
        });

        setTimeout(() => {
          window.location.href = '/hotel-owner-profile';
        }, 2000);

      } else {
        // Try to parse error details
        let errorMessage = 'Registration failed. Please try again.';
        try {
          if (data.details) {
            // Parse the details if it's a JSON string
            const details = typeof data.details === 'string' ? JSON.parse(data.details) : data.details;
            if (details.message) {
              errorMessage = details.message;
            }
          } else if (data.error) {
            errorMessage = data.error;
          } else if (data.message) {
            errorMessage = data.message;
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        setError(errorMessage);
      }

    } catch (error) {
      console.error('Registration error:', error);
      
      // More specific error handling
      if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
        setError('Unable to connect to server. Please make sure the server is running on localhost:3001 and try again.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="signup-container">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content */}
      <div className="main-content">
        <div className="form-wrapper">
          <div className="form-container">
            {/* Logo Section */}
            <div className="signup-logo">
              <img src={login_hotel_logo} alt="Hotel logo" height="18px" width="120px" />
              <h3>Sign Up as Hotel Owner</h3>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="error-message" 
                role="alert"
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}
              >
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div 
                className="success-message" 
                role="alert"
                style={{
                  backgroundColor: '#d1fae5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}
              >
                {success}
              </div>
            )}

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="form-content">
              {/* Name Fields */}
              <div className="name-grid">
                <div className="field-group">
                    <label htmlFor="firstName" className="field-label">
                      First Name
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} aria-hidden="true" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="First Name"
                        required
                        disabled={isLoading}
                        aria-describedby="firstName-error"
                      />
                    </div>
                </div>
                <div className="field-group">
                    <label htmlFor="lastName" className="field-label">
                      Last Name
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} aria-hidden="true" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Last Name"
                        required
                        disabled={isLoading}
                        aria-describedby="lastName-error"
                      />
                    </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="field-group">
                <label htmlFor="email" className="field-label">
                    Email Address
                </label>
                <div className="input-wrapper">
                    <Mail className="input-icon" size={18} aria-hidden="true" />
                    <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                    aria-describedby="email-error"
                    />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="field-group">
                <label htmlFor="phoneNumber" className="field-label">
                    Contact Number
                </label>
                <div className="input-wrapper">
                    <Phone className="input-icon" size={18} aria-hidden="true" />
                    <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                    required
                    disabled={isLoading}
                    aria-describedby="phone-help"
                    />
                </div>
                <p id="phone-help" className="help-text">Include country code (e.g., +1234567890)</p>
              </div>

              {/* Gender Field */}
              <div className="field-group">
                <label className="field-label">
                    Gender
                </label>
                <div className="radio-group" style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                  <label className="radio-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      style={{ margin: 0 }}
                    />
                    <span>Male</span>
                  </label>
                  <label className="radio-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      style={{ margin: 0 }}
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>

              {/* Country Field */}
              <div className="field-group">
                <label htmlFor="country" className="field-label">
                    Country
                </label>
                <div className="input-wrapper">
                    <Globe className="input-icon" size={18} aria-hidden="true" />
                    <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                        disabled={isLoading || countriesLoading}
                        aria-describedby="country-help"
                    >
                        <option value="">
                          {countriesLoading ? 'Loading countries...' : 'Select your country'}
                        </option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                    </select>
                </div>
                {countriesLoading && (
                  <p id="country-help" className="help-text">Loading countries...</p>
                )}
              </div>

              {/* Hotel contact address */}
                <div className="field-group">
                <label htmlFor="address" className="field-label">
                    Hotel Owner Address
                </label>
                <div className="input-wrapper">
                    <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter address of contact person"
                    required
                    disabled={isLoading}
                    rows="4"
                    ></textarea>
                </div>
                </div>

              {/* Password Field */}
              <div className="field-group">
                <label htmlFor="password" className="field-label">
                    Password
                </label>
                <div className="input-wrapper">
                    <Lock className="input-icon" size={18} aria-hidden="true" />
                    <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input password-input"
                    placeholder="Create a password"
                    required
                    disabled={isLoading}
                    aria-describedby="password-help password-error"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="eye-btn"
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <p id="password-help" className="help-text">Must contain 8 characters minimum</p>
              </div>

              {/* Confirm Password Field */}
              <div className="field-group">
                <label htmlFor="confirmPassword" className="field-label">
                    Confirm Password
                </label>
                <div className="input-wrapper">
                    <Lock className="input-icon" size={18} aria-hidden="true" />
                    <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input password-input"
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                    aria-describedby="confirmPassword-error"
                    />
                    <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="eye-btn"
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
              </div>
            <div
                className="input-wrapper cursor-pointer signup-go-gack"
                onClick={() => navigate('/signup')}
                title='Back to User Sign Up'
                >
                <ArrowLeftFromLine className="input-icon" size={24} aria-hidden="true" />
            </div>

              {/* Terms and Policy */}
              <div className="policy">
                <p>
                    <strong>By continuing, you agree to our</strong>{' '}
                    <a href="/terms" className="policy-link">
                    Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="policy-link">
                    Privacy Policy
                    </a>.
                </p>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="signup-submit-btn"
                disabled={isLoading || countriesLoading}
                style={{
                  opacity: (isLoading || countriesLoading) ? 0.7 : 1,
                  cursor: (isLoading || countriesLoading) ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Login Link */}
              <p className="login-link">
                Already have an account?{' '}
                <a href="/login" className="signup-link-anchor">
                    Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupHotel;


