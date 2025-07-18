import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import siteLogo from '../Assets/hotel_logo.png';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, logout, getUserRole } from '../../services/authService';

const Navbar = () => {
  const [menu, setMenu] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const menuRef = useRef(null);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setIsMobileMenuOpen(false); 
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserRole('');
  };

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const role = getUserRole();
      setIsLoggedIn(authenticated);
      setUserRole(role);
    };

    checkAuth();
    // Check auth status every 5 seconds
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeLink = menuRef.current?.querySelector(`a[href='${location.pathname}']`);
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [location.pathname]);

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <Link to="/" onClick={() => handleMenuClick('Home')}>
          <img src={siteLogo} alt="Site Logo" />
        </Link>
      </div>

      <div className='menu-link-btn-wrap'>

        <ul className='nav-menu' ref={menuRef}>
          <li>
            <Link to='/' onClick={() => handleMenuClick('Home')}>Home</Link>
          </li>
          <li>
            <Link to='/hotels' onClick={() => handleMenuClick('hotels')}>Hotels</Link>
          </li>
          <li>
            <Link to='/about' onClick={() => handleMenuClick('about')}>About</Link>
          </li>
          <li>
            <Link to='/contact' onClick={() => handleMenuClick('contact')}>Contact</Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link to='/booking-history' onClick={() => handleMenuClick('bookings')}>My Bookings</Link>
            </li>
          )}

          <div className="nav-underline" style={underlineStyle}></div>
        </ul>

        <div className='nav-button'>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#00504B', fontSize: '14px' }}>
                Welcome, {userRole || 'User'}
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to='/login' className='nav-login-btn'>
                <button>Login</button>
              </Link>
              <Link to='/signup' className='nav-signup-btn'>
                <button>SignUp</button>
              </Link>
            </>
          )}
        </div>

      </div>

      <div className='mobile-menu-toggle' onClick={toggleMobileMenu}>
        <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
        <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
        <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
      </div>

      <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link to='/' onClick={() => handleMenuClick('Home')}>Home</Link>
          </li>
          <li>
            <Link to='/hotels' onClick={() => handleMenuClick('hotels')}>Hotels</Link>
          </li>
          <li>
            <Link to='/about' onClick={() => handleMenuClick('about')}>About</Link>
          </li>
          <li>
            <Link to='/contact' onClick={() => handleMenuClick('contact')}>Contact</Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link to='/booking-history' onClick={() => handleMenuClick('bookings')}>My Bookings</Link>
            </li>
          )}
        </ul>

        <div className='mobile-nav-buttons'>
          {isLoggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: '#00504B', fontSize: '14px' }}>
                Welcome, {userRole || 'User'}
              </span>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  width: '100%'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to='/login' className='mobile-login-btn' onClick={() => setIsMobileMenuOpen(false)}>
                <button>Login</button>
              </Link>
              <Link to='/signup' className='mobile-signup-btn' onClick={() => setIsMobileMenuOpen(false)}>
                <button>SignUp</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {isMobileMenuOpen && <div className='mobile-menu-overlay' onClick={toggleMobileMenu}></div>}
    </div>
  );
};

export default Navbar;