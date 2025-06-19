import React, { useContext, useState } from 'react';
import './Navbar.css';
import siteLogo from '../Assets/hotel_logo.png';
import { Link } from 'react-router-dom';
// import { HomeContext } from '../../Context/HomeContext';

const Navbar = () => {
  const [menu, setMenu] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (menuItem) => {
      setMenu(menuItem);
      setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
  };

  return (
    <div className='navbar'>
        <div className='nav-logo'>
            <Link to="/" onClick={() => handleMenuClick('Home')}>
                <img src={siteLogo} alt="Site Logo" />
            </Link>
        </div>

      <div className='menu-link-btn-wrap'>
        {/* Desktop Navigation Menu */}
        <ul className='nav-menu'>
            <li onClick={() => handleMenuClick('Home')}>
                <Link to='/'>Home</Link>
                {menu === 'Home' ? <hr /> : <></>}
            </li>
            <li onClick={() => handleMenuClick('hotels')}>
                <Link to='/hotels'>Hotels</Link>
                {menu === 'hotels' ? <hr /> : <></>}
            </li>
            <li onClick={() => handleMenuClick('about')}>
                <Link to='/about'>About</Link>
                {menu === 'about' ? <hr /> : <></>}
            </li>
            <li onClick={() => handleMenuClick('contact')}>
                <Link to='/contact'>Contact</Link>
                {menu === 'contact' ? <hr /> : <></>}
            </li>
        </ul>

        {/* Desktop Buttons */}
        <div className='nav-button'>
            <Link to='/login' className='nav-login-btn'>
                <button>Login</button>
            </Link>
            <Link to='/signup' className='nav-signup-btn'>
                <button>SignUp</button>
            </Link>
        </div>
      </div>

        {/* Mobile Hamburger Menu Button */}
        <div className='mobile-menu-toggle' onClick={toggleMobileMenu}>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <ul>
                <li onClick={() => handleMenuClick('Home')}>
                    <Link to='/'>Home</Link>
                    {menu === 'Home' ? <hr /> : <></>}
                </li>
                <li onClick={() => handleMenuClick('hotels')}>
                    <Link to='/hotels'>Hotels</Link>
                    {menu === 'hotels' ? <hr /> : <></>}
                </li>
                <li onClick={() => handleMenuClick('about')}>
                    <Link to='/about'>About</Link>
                    {menu === 'about' ? <hr /> : <></>}
                </li>
                <li onClick={() => handleMenuClick('contact')}>
                    <Link to='/contact'>Contact</Link>
                    {menu === 'contact' ? <hr /> : <></>}
                </li>
            </ul>
            
            {/* Mobile Buttons */}
            <div className='mobile-nav-buttons'>
                <Link to='/login' className='mobile-login-btn' onClick={() => setIsMobileMenuOpen(false)}>
                    <button>Login</button>
                </Link>
                <Link to='/signup' className='mobile-signup-btn' onClick={() => setIsMobileMenuOpen(false)}>
                    <button>SignUp</button>
                </Link>
            </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && <div className='mobile-menu-overlay' onClick={toggleMobileMenu}></div>}
    </div>
  );
};

export default Navbar;