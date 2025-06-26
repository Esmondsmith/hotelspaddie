import React, { useState } from 'react';
import { Menu, X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import login_hotel_logo from '../Components/Assets/hotel_logo.png';
import './CSS/SignUp.css';

const SignUp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ 
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'hotel_user' // Add user type selection
  });

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
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check password length
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
        roles: [{ target_id: formData.userType }]
      };

      // Use local server endpoint to avoid CORS issues
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
          userType: 'hotel_user'
        });

        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);

      } else {
        setError(data.error || data.message || 'Registration failed. Please try again.');
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
  
  return (
    <div className="signup-container">
      {/* Navigation Header */}
      <nav className="signup-nav">
        <div className="signup-nav-container">
          <div className="signup-nav-content">
            {/* Logo */}
            <div className="logo">
              <div className='signup-logo'>
               <a href="/"> 
                 <img 
                   src={login_hotel_logo} 
                   alt="Hotel logo" 
                   height="20px" 
                   width="150px" 
                 /> 
               </a> 
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="signup-desktop-nav">
              <a href="/" className="signup-home-link">Home</a>
              <a href="/hotels" className="nav-link">Hotel</a>
              <a href="/about" className="nav-link">About</a>
              <a href="/contact" className="nav-link">Contact</a>
              <a href="/login" className="login-btn">Login</a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="mobile-menu-btn"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
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
            <a href="/login" className="mobile-login-btn">Login</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="form-wrapper">
          <div className="form-container">
            {/* Logo Section */}
            <div className="signup-logo">
              <img src={login_hotel_logo} alt="Hotel logo" height="18px" width="120px" />
              <h1>Sign Up</h1>
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

              {/* User Type Selection */}
              <div className="field-group">
                <label htmlFor="userType" className="field-label">
                    Account Type
                </label>
                <div className="input-wrapper">
                    <User className="input-icon" size={18} aria-hidden="true" />
                    <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                        disabled={isLoading}
                        aria-describedby="userType-help"
                    >
                        <option value="hotel_user">Hotel User/Guest</option>
                        <option value="hotel_owner">Hotel Owner</option>
                    </select>
                </div>
                <p id="userType-help" className="help-text">
                    Choose your account type. Hotel Owners can manage properties, while Hotel Users can book rooms.
                </p>
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
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
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

export default SignUp;






//Another code 
// import React, { useState } from 'react';

// const SignupForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     userType: 'hotel_user' // default to hotel_user
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     setError('');

//     // Get environment variables
//     const apiUrl = process.env.REACT_APP_API_URL || 'https://zodr.zodml.org/entity/user?_format=json';
//     const authToken = process.env.REACT_APP_AUTH_TOKEN || 'Basic dGVzdG1hbjpUaWdlcnMzbWUuJA==';

//     // Prepare the payload according to the API format
//     const payload = {
//       name: [{ value: formData.name }],
//       mail: [{ value: formData.email }],
//       pass: [{ value: formData.password }],
//       status: [{ value: true }],
//       roles: [{ target_id: formData.userType }]
//     };

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'Authorization': authToken
//         },
//         body: JSON.stringify(payload)
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessage(`Successfully registered as ${formData.userType === 'hotel_owner' ? 'Hotel Owner' : 'Hotel User'}!`);
//         setFormData({
//           name: '',
//           email: '',
//           password: '',
//           userType: 'hotel_user'
//         });
//       } else {
//         const errorData = await response.json();
//         setError(`Registration failed: ${errorData.message || 'Unknown error'}`);
//       }
//     } catch (err) {
//       setError(`Network error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//         Hotel Registration
//       </h2>
      
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//             Full Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter your full name"
//           />
//         </div>

//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//             Email Address
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter your email"
//           />
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             required
//             minLength="8"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Enter your password"
//           />
//         </div>

//         <div>
//           <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
//             Account Type
//           </label>
//           <select
//             id="userType"
//             name="userType"
//             value={formData.userType}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="hotel_user">Hotel User/Guest</option>
//             <option value="hotel_owner">Hotel Owner</option>
//           </select>
//         </div>

//         <div className="mt-6">
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
//               loading 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
//             }`}
//           >
//             {loading ? 'Registering...' : 'Register'}
//           </button>
//         </div>
//       </div>

//       {message && (
//         <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SignupForm;


