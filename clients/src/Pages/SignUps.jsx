// import React, { useState } from 'react';
// import './CSS/SignUp.css';
// import login_hotel_logo from '../Components/Assets/hotel_logo.png';

// const SignUp = () => {

//   return (
//     <div className='signup'>
//       <div className="signup-container">
//         <div className='signup-logo'>
//             <img src={login_hotel_logo} alt="hotel logo" height="20px" width="150px" />
//         </div>
//         <h2>Sign Up</h2>
//         <div className="signup-fields">
//           <label htmlFor="">First Name</label>
//           <input type="text" placeholder='First Name' />
//           <label htmlFor="">Last Name</label>
//           <input type="text" placeholder='Last Name' />
//           <label htmlFor="">Email</label>
//           <input type="email" placeholder='Email' />
//           <label htmlFor="">Password</label>
//           <input type="password" placeholder='Password' />
//           <span>Must contain 8 characters minimum</span>
//           <label htmlFor="">Confirm Password</label>
//           <input type="password" placeholder='Confirm Password' />
//         </div>

//         <div className="signup-policy">
//           <p> <strong>By continuing, you agree to our</strong> <a href="#">Terms of Service</a> and <a href="#">Privacy Policy.</a> </p>
//           {/* <input type="checkbox" />
//           <p>I agree to terms of services and privacy policy</p> */}
//         </div>

//          <button>Register</button> 

//         <p className='signup-login'>
//           Already have an account? <a href="/login">Log In</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignUp;








// import React, { useState } from 'react';
// import { Menu, X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// const SignUp = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   const styles = {
//     container: {
//       minHeight: '100vh',
//       backgroundColor: '#f9fafb',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
//     },
    
//     // Navigation Styles
//     nav: {
//       backgroundColor: '#ffffff',
//       boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//       borderBottom: '1px solid #e5e7eb'
//     },
//     navContainer: {
//       maxWidth: '1280px',
//       margin: '0 auto',
//       padding: '0 16px'
//     },
//     navContent: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       height: '64px'
//     },
//     logo: {
//       display: 'flex',
//       alignItems: 'center',
//       flexShrink: 0
//     },
//     logoIcon: {
//       width: '32px',
//       height: '32px',
//       backgroundColor: '#0f766e',
//       borderRadius: '8px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginRight: '12px'
//     },
//     logoText: {
//       fontSize: '20px',
//       fontWeight: '600',
//       color: '#111827'
//     },
//     logoIconText: {
//       color: '#ffffff',
//       fontWeight: 'bold',
//       fontSize: '18px'
//     },
    
//     // Desktop Navigation
//     desktopNav: {
//       display: 'none',
//       marginLeft: '40px',
//       alignItems: 'baseline',
//       gap: '32px'
//     },
//     navLink: {
//       color: '#374151',
//       textDecoration: 'none',
//       padding: '8px 12px',
//       fontSize: '14px',
//       fontWeight: '500',
//       transition: 'color 0.2s ease',
//       cursor: 'pointer'
//     },
//     navLinkHover: {
//       color: '#0d9488'
//     },
//     loginBtn: {
//       backgroundColor: '#0f766e',
//       color: '#ffffff',
//       padding: '8px 16px',
//       borderRadius: '6px',
//       fontSize: '14px',
//       fontWeight: '500',
//       textDecoration: 'none',
//       transition: 'background-color 0.2s ease',
//       cursor: 'pointer'
//     },
//     loginBtnHover: {
//       backgroundColor: '#115e59'
//     },
    
//     // Mobile Menu Button
//     mobileMenuBtn: {
//       display: 'block',
//       color: '#374151',
//       padding: '8px',
//       borderRadius: '6px',
//       border: 'none',
//       backgroundColor: 'transparent',
//       cursor: 'pointer',
//       transition: 'color 0.2s ease'
//     },
    
//     // Mobile Menu
//     mobileMenu: {
//       display: isMenuOpen ? 'block' : 'none',
//       backgroundColor: '#ffffff',
//       borderTop: '1px solid #e5e7eb',
//       boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
//     },
//     mobileMenuContent: {
//       padding: '8px 8px 12px'
//     },
//     mobileNavLink: {
//       display: 'block',
//       color: '#374151',
//       textDecoration: 'none',
//       padding: '8px 12px',
//       borderRadius: '6px',
//       fontSize: '16px',
//       fontWeight: '500',
//       transition: 'all 0.2s ease',
//       cursor: 'pointer'
//     },
//     mobileLinkHover: {
//       color: '#0d9488',
//       backgroundColor: '#f9fafb'
//     },
//     mobileLoginBtn: {
//       display: 'block',
//       backgroundColor: '#0f766e',
//       color: '#ffffff',
//       padding: '8px 12px',
//       borderRadius: '6px',
//       fontSize: '16px',
//       fontWeight: '500',
//       textDecoration: 'none',
//       margin: '16px 12px 0',
//       transition: 'background-color 0.2s ease',
//       cursor: 'pointer'
//     },
    
//     // Main Content
//     main: {
//       flex: 1,
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '32px 16px'
//     },
//     formWrapper: {
//       width: '100%',
//       maxWidth: '448px'
//     },
    
//     // Header Section
//     header: {
//       textAlign: 'center',
//       marginBottom: '32px'
//     },
//     headerIcon: {
//       width: '64px',
//       height: '64px',
//       backgroundColor: '#0f766e',
//       borderRadius: '50%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       margin: '0 auto 16px'
//     },
//     headerIconText: {
//       color: '#ffffff',
//       fontWeight: 'bold',
//       fontSize: '24px'
//     },
//     title: {
//       fontSize: '30px',
//       fontWeight: 'bold',
//       color: '#111827',
//       margin: '0 0 8px'
//     },
//     subtitle: {
//       color: '#6b7280',
//       margin: 0
//     },
    
//     // Form Container
//     formContainer: {
//       backgroundColor: '#ffffff',
//       borderRadius: '8px',
//       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//       border: '1px solid #e5e7eb',
//       padding: '24px'
//     },
//     formContent: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '24px'
//     },
    
//     // Name Fields Grid
//     nameGrid: {
//       display: 'grid',
//       gridTemplateColumns: '1fr',
//       gap: '16px'
//     },
    
//     // Form Fields
//     fieldGroup: {
//       display: 'flex',
//       flexDirection: 'column'
//     },
//     label: {
//       display: 'block',
//       fontSize: '14px',
//       fontWeight: '500',
//       color: '#374151',
//       marginBottom: '8px'
//     },
//     inputWrapper: {
//       position: 'relative'
//     },
//     inputIcon: {
//       position: 'absolute',
//       left: '12px',
//       top: '50%',
//       transform: 'translateY(-50%)',
//       color: '#9ca3af'
//     },
//     input: {
//       width: '100%',
//       paddingLeft: '40px',
//       paddingRight: '16px',
//       paddingTop: '12px',
//       paddingBottom: '12px',
//       border: '1px solid #d1d5db',
//       borderRadius: '6px',
//       fontSize: '16px',
//       transition: 'all 0.2s ease',
//       outline: 'none',
//       boxSizing: 'border-box'
//     },
//     inputFocus: {
//       borderColor: '#14b8a6',
//       boxShadow: '0 0 0 3px rgba(20, 184, 166, 0.1)'
//     },
//     passwordInput: {
//       paddingRight: '48px'
//     },
//     eyeBtn: {
//       position: 'absolute',
//       right: '12px',
//       top: '50%',
//       transform: 'translateY(-50%)',
//       color: '#9ca3af',
//       backgroundColor: 'transparent',
//       border: 'none',
//       cursor: 'pointer',
//       padding: '4px',
//       transition: 'color 0.2s ease'
//     },
//     eyeBtnHover: {
//       color: '#6b7280'
//     },
//     helpText: {
//       fontSize: '12px',
//       color: '#6b7280',
//       marginTop: '4px'
//     },
    
//     // Terms and Policy
//     policy: {
//       fontSize: '14px',
//       color: '#6b7280'
//     },
//     policyLink: {
//       color: '#0d9488',
//       textDecoration: 'underline',
//       cursor: 'pointer'
//     },
    
//     // Submit Button
//     submitBtn: {
//       width: '100%',
//       backgroundColor: '#0f766e',
//       color: '#ffffff',
//       padding: '12px 16px',
//       borderRadius: '6px',
//       fontSize: '18px',
//       fontWeight: '500',
//       border: 'none',
//       cursor: 'pointer',
//       transition: 'all 0.2s ease',
//       outline: 'none'
//     },
//     submitBtnHover: {
//       backgroundColor: '#115e59'
//     },
//     submitBtnFocus: {
//       boxShadow: '0 0 0 3px rgba(15, 118, 110, 0.3)'
//     },
    
//     // Login Link
//     loginLink: {
//       textAlign: 'center',
//       fontSize: '14px',
//       color: '#6b7280',
//       margin: 0
//     },
//     loginLinkAnchor: {
//       color: '#0d9488',
//       fontWeight: '500',
//       textDecoration: 'none',
//       cursor: 'pointer'
//     }
//   };

//   // Media queries using CSS-in-JS approach
//   const mediaQueries = `
//     @media (min-width: 480px) {
//       .form-container {
//         padding: 32px !important;
//       }
//       .name-grid {
//         grid-template-columns: 1fr 1fr !important;
//       }
//     }
    
//     @media (min-width: 768px) {
//       .desktop-nav {
//         display: flex !important;
//       }
//       .mobile-menu-btn {
//         display: none !important;
//       }
//       .main-content {
//         padding: 48px 24px !important;
//       }
//     }
    
//     @media (min-width: 1024px) {
//       .nav-container {
//         padding: 0 32px !important;
//       }
//     }
//   `;

//   return (
//     <div style={styles.container}>
//       <style>{mediaQueries}</style>
      
//       {/* Navigation Header */}
//       <nav style={styles.nav}>
//         <div style={styles.navContainer} className="nav-container">
//           <div style={styles.navContent}>
//             {/* Logo */}
//             <div style={styles.logo}>
//               <div style={styles.logoIcon}>
//                 <span style={styles.logoIconText}>H</span>
//               </div>
//               <span style={styles.logoText}>HotelLogo</span>
//             </div>

//             {/* Desktop Navigation */}
//             <div style={styles.desktopNav} className="desktop-nav">
//               <a 
//                 href="#" 
//                 style={styles.navLink}
//                 onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
//                 onMouseLeave={(e) => e.target.style.color = styles.navLink.color}
//               >
//                 Home
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.navLink}
//                 onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
//                 onMouseLeave={(e) => e.target.style.color = styles.navLink.color}
//               >
//                 About
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.navLink}
//                 onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
//                 onMouseLeave={(e) => e.target.style.color = styles.navLink.color}
//               >
//                 Services
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.navLink}
//                 onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
//                 onMouseLeave={(e) => e.target.style.color = styles.navLink.color}
//               >
//                 Contact
//               </a>
//               <a 
//                 href="/login" 
//                 style={styles.loginBtn}
//                 onMouseEnter={(e) => e.target.style.backgroundColor = styles.loginBtnHover.backgroundColor}
//                 onMouseLeave={(e) => e.target.style.backgroundColor = styles.loginBtn.backgroundColor}
//               >
//                 Login
//               </a>
//             </div>

//             {/* Mobile menu button */}
//             <button
//               onClick={toggleMenu}
//               style={styles.mobileMenuBtn}
//               className="mobile-menu-btn"
//               aria-label="Toggle menu"
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation Menu */}
//         {isMenuOpen && (
//           <div style={styles.mobileMenu}>
//             <div style={styles.mobileMenuContent}>
//               <a 
//                 href="#" 
//                 style={styles.mobileNavLink}
//                 onMouseEnter={(e) => {
//                   e.target.style.color = styles.mobileLinkHover.color;
//                   e.target.style.backgroundColor = styles.mobileLinkHover.backgroundColor;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.color = styles.mobileNavLink.color;
//                   e.target.style.backgroundColor = 'transparent';
//                 }}
//               >
//                 Home
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.mobileNavLink}
//                 onMouseEnter={(e) => {
//                   e.target.style.color = styles.mobileLinkHover.color;
//                   e.target.style.backgroundColor = styles.mobileLinkHover.backgroundColor;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.color = styles.mobileNavLink.color;
//                   e.target.style.backgroundColor = 'transparent';
//                 }}
//               >
//                 About
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.mobileNavLink}
//                 onMouseEnter={(e) => {
//                   e.target.style.color = styles.mobileLinkHover.color;
//                   e.target.style.backgroundColor = styles.mobileLinkHover.backgroundColor;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.color = styles.mobileNavLink.color;
//                   e.target.style.backgroundColor = 'transparent';
//                 }}
//               >
//                 Services
//               </a>
//               <a 
//                 href="#" 
//                 style={styles.mobileNavLink}
//                 onMouseEnter={(e) => {
//                   e.target.style.color = styles.mobileLinkHover.color;
//                   e.target.style.backgroundColor = styles.mobileLinkHover.backgroundColor;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.color = styles.mobileNavLink.color;
//                   e.target.style.backgroundColor = 'transparent';
//                 }}
//               >
//                 Contact
//               </a>
//               <a 
//                 href="/login" 
//                 style={styles.mobileLoginBtn}
//                 onMouseEnter={(e) => e.target.style.backgroundColor = styles.loginBtnHover.backgroundColor}
//                 onMouseLeave={(e) => e.target.style.backgroundColor = styles.mobileLoginBtn.backgroundColor}
//               >
//                 Login
//               </a>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Main Content */}
//       <div style={styles.main} className="main-content">
//         <div style={styles.formWrapper}>
//           {/* Logo Section */}
//           <div style={styles.header}>
//             <div style={styles.headerIcon}>
//               <span style={styles.headerIconText}>H</span>
//             </div>
//             <h2 style={styles.title}>Create Account</h2>
//             <p style={styles.subtitle}>Join us to get started</p>
//           </div>

//           {/* Form Container */}
//           <div style={styles.formContainer} className="form-container">
//             <div style={styles.formContent}>
//               {/* Name Fields */}
//               <div style={styles.nameGrid} className="name-grid">
//                 <div style={styles.fieldGroup}>
//                   <label htmlFor="firstName" style={styles.label}>
//                     First Name
//                   </label>
//                   <div style={styles.inputWrapper}>
//                     <User style={styles.inputIcon} size={18} />
//                     <input
//                       type="text"
//                       id="firstName"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       style={styles.input}
//                       placeholder="First Name"
//                       required
//                       onFocus={(e) => {
//                         e.target.style.borderColor = styles.inputFocus.borderColor;
//                         e.target.style.boxShadow = styles.inputFocus.boxShadow;
//                       }}
//                       onBlur={(e) => {
//                         e.target.style.borderColor = styles.input.borderColor;
//                         e.target.style.boxShadow = 'none';
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <div style={styles.fieldGroup}>
//                   <label htmlFor="lastName" style={styles.label}>
//                     Last Name
//                   </label>
//                   <div style={styles.inputWrapper}>
//                     <User style={styles.inputIcon} size={18} />
//                     <input
//                       type="text"
//                       id="lastName"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       style={styles.input}
//                       placeholder="Last Name"
//                       required
//                       onFocus={(e) => {
//                         e.target.style.borderColor = styles.inputFocus.borderColor;
//                         e.target.style.boxShadow = styles.inputFocus.boxShadow;
//                       }}
//                       onBlur={(e) => {
//                         e.target.style.borderColor = styles.input.borderColor;
//                         e.target.style.boxShadow = 'none';
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Email Field */}
//               <div style={styles.fieldGroup}>
//                 <label htmlFor="email" style={styles.label}>
//                   Email Address
//                 </label>
//                 <div style={styles.inputWrapper}>
//                   <Mail style={styles.inputIcon} size={18} />
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     style={styles.input}
//                     placeholder="Enter your email"
//                     required
//                     onFocus={(e) => {
//                       e.target.style.borderColor = styles.inputFocus.borderColor;
//                       e.target.style.boxShadow = styles.inputFocus.boxShadow;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = styles.input.borderColor;
//                       e.target.style.boxShadow = 'none';
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div style={styles.fieldGroup}>
//                 <label htmlFor="password" style={styles.label}>
//                   Password
//                 </label>
//                 <div style={styles.inputWrapper}>
//                   <Lock style={styles.inputIcon} size={18} />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     style={{...styles.input, ...styles.passwordInput}}
//                     placeholder="Create a password"
//                     required
//                     onFocus={(e) => {
//                       e.target.style.borderColor = styles.inputFocus.borderColor;
//                       e.target.style.boxShadow = styles.inputFocus.boxShadow;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = styles.input.borderColor;
//                       e.target.style.boxShadow = 'none';
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     style={styles.eyeBtn}
//                     onMouseEnter={(e) => e.target.style.color = styles.eyeBtnHover.color}
//                     onMouseLeave={(e) => e.target.style.color = styles.eyeBtn.color}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//                 <p style={styles.helpText}>Must contain 8 characters minimum</p>
//               </div>

//               {/* Confirm Password Field */}
//               <div style={styles.fieldGroup}>
//                 <label htmlFor="confirmPassword" style={styles.label}>
//                   Confirm Password
//                 </label>
//                 <div style={styles.inputWrapper}>
//                   <Lock style={styles.inputIcon} size={18} />
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     style={{...styles.input, ...styles.passwordInput}}
//                     placeholder="Confirm your password"
//                     required
//                     onFocus={(e) => {
//                       e.target.style.borderColor = styles.inputFocus.borderColor;
//                       e.target.style.boxShadow = styles.inputFocus.boxShadow;
//                     }}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = styles.input.borderColor;
//                       e.target.style.boxShadow = 'none';
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     style={styles.eyeBtn}
//                     onMouseEnter={(e) => e.target.style.color = styles.eyeBtnHover.color}
//                     onMouseLeave={(e) => e.target.style.color = styles.eyeBtn.color}
//                   >
//                     {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Terms and Policy */}
//               <div style={styles.policy}>
//                 <p>
//                   <strong>By continuing, you agree to our</strong>{' '}
//                   <a href="#" style={styles.policyLink}>
//                     Terms of Service
//                   </a>{' '}
//                   and{' '}
//                   <a href="#" style={styles.policyLink}>
//                     Privacy Policy
//                   </a>
//                   .
//                 </p>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 style={styles.submitBtn}
//                 onMouseEnter={(e) => e.target.style.backgroundColor = styles.submitBtnHover.backgroundColor}
//                 onMouseLeave={(e) => e.target.style.backgroundColor = styles.submitBtn.backgroundColor}
//                 onFocus={(e) => e.target.style.boxShadow = styles.submitBtnFocus.boxShadow}
//                 onBlur={(e) => e.target.style.boxShadow = 'none'}
//               >
//                 Create Account
//               </button>

//               {/* Login Link */}
//               <p style={styles.loginLink}>
//                 Already have an account?{' '}
//                 <a href="/login" style={styles.loginLinkAnchor}>
//                   Sign in
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;