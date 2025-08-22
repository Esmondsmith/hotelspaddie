import React, { useState } from 'react';
import './Footer.css';
import siteLogo from '../Assets/hotel_logo.png';
import { Star, Plus,Facebook, Twitter, Linkedin, Instagram  } from "lucide-react";
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


import img1 from '../Assets/room1.jpg';
import img2 from '../Assets/room2.jpg';
import img3 from '../Assets/room3.jpg';
import img4 from '../Assets/room4.jpg';
import img5 from '../Assets/room1.jpg';



const Footer = () => {
  const [menu, setMenu] = useState("#");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setIsMobileMenuOpen(false);
  };

  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section" >
          <div className='footer-logo'>
            <Link to="/" onClick={() => handleMenuClick('Home')}>
              <img src={siteLogo} alt="Site Logo" />
            </Link>
          </div>
          <p> Designed to empower travelers <br/> with the tools they need to explore <br /> Africa like never before</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><Facebook size={18}/></a>
            <a href="#" aria-label="Twitter"><Twitter size={18}/></a>
            <a href="#" aria-label="Instagram"><Instagram size={18}/></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={18}/></a>
          </div>
        </div>

        {/* Links */}
        <div className="footer-section footer-info">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about" onClick={() => handleMenuClick('about')} className='link'>About Us</Link></li>
            <li><Link to="/contact" onClick={() => handleMenuClick('contact')} className='link'>Contact Us</Link></li>
            <li><Link to="/hotels" onClick={() => handleMenuClick('hotels')} className='link'>Hotels</Link></li>
            <li><Link to="#" onClick={() => handleMenuClick('blog')} className='link'>Blog</Link></li>
            <li><Link to="/terms-conditions" onClick={() => handleMenuClick('Terms & Conditions')} className='link'>Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" onClick={() => handleMenuClick('Privacy Policy')} className='link'>Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Help Center</h4>
          <ul>
            <li><a href="#" className='link'>Contact Support</a></li>
            <li><HashLink smooth to="/contact#faq" className="link">FAQ</HashLink></li>
            <li><a href="#" className='link'>Booking Help</a></li>
            <li><a href="#" className='link'>Cancellation</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul>
            <li>📧 info@hotelspaddie.com</li>
            <li>📞 +2348171772822</li>
            <li>📍 Hotelspaddie street, VI, Lagos, Nigeria.</li>
          </ul>
        </div>

        {/* Hotel Room Gallery */}
        <div className="footer-section footer-gallery">
          <h4>Most Popular Rooms</h4>
          <div className="gallery-images">
            <img src={img1} alt="Room 1" />
            <img src={img2} alt="Room 2" />
            <img src={img3} alt="Room 3" /> 
            <img src={img4} alt="Room 4" />
            <img src={img5} alt="Room 5" />
            <img src={img5} alt="Room 5" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Hotels Paddie. All rights reserved. <Link to="/terms-conditions" onClick={() => handleMenuClick('Terms & Conditions')}>Terms & Conditions</Link> | <Link to="/privacy-policy" onClick={() => handleMenuClick('Privacy Policy')}>Privacy Policy</Link> </p>
      </div>
    </footer>
  );
};

export default Footer;
