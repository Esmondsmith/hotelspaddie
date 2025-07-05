import React, { useContext, useState } from 'react';
import './Footer.css'
import siteLogo from '../Assets/hotel_logo.png';
import { Link } from 'react-router-dom';


const Footer = () => {

  const [menu, setMenu] = useState("Home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
    const handleMenuClick = (menuItem) => {
        setMenu(menuItem);
        setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
    };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className='footer-logo'>
              <Link to="/" onClick={() => handleMenuClick('Home')}>
                  <img src={siteLogo} alt="Site Logo" />
              </Link>
          </div>
          <p>Find and book the perfect hotel for your next adventure.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">t</a>
            <a href="#" aria-label="Instagram">i</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Help Center</h4>
          <ul>
            <li><a href="#">Contact Support</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Booking Help</a></li>
            <li><a href="#">Cancellation</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul>
            <li>📧 support@hotelsPaddie.com</li>
            <li>📞 +1 (555) 123-4567</li>
            <li>📍 123 Hotel Street, City, State</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Hotels Paddie. All rights reserved.</p>
      </div>
    </footer>
  );
};



//  const Footer = () => {

// //To get current year for our copyright.
//     const year = new Date().getFullYear();

// // This controls the scroll back to the top.
//     const scrollToTop = () => {
//         scroll.scrollToTop();
//       };
    

//   return (
//     <div className='footer'>
//       <div className="footer-logo">
//         <img src={logo1} alt="" />
//         <p>Hotels Paddie</p>
//       </div>
//       <ul className='footer-links'>
//         <li onClick={scrollToTop}>Home &#8593;</li>
//         <li>Company</li>
//         <li>Products</li>
//         <li>Offices</li>
//         <li>About</li>
//         <li>Contact</li>
//       </ul>
//       <div className="footer-social-icons">
//         <div className="footer-icons-container">
//             <img src={instagram_icon} alt="" title='Instagram'/>
//         </div>
//         <div className="footer-icons-container">
//             <img src={pintester_icon} alt="" title='Pinterest'/>
//         </div>
//         <div className="footer-icons-container">
//             <img src={whatsapp_icon} alt="" title='WhatsApp'/>
//         </div>
//       </div>
//       <div className="footer-copyright">
//         <hr />
//         <p className="mb-1">
//              <small> Copyright &copy; {year} HotelsPaddie - All rights reserved.</small>
//         </p>
//       </div>
//     </div>
//   )
// }

export default Footer

