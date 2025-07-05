import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, Star, Download, Apple, Play } from 'lucide-react';
import './Hero.css'

// Main Landing Page Component
const HotelLandingPage = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2 guests'
  });

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="landing-page">
      {/* Mobile App Section */}
      <section className="app-section">
        <div className="container">
          <div className="app-content">
            <div className="app-text">
              <h2>Download Our Mobile App</h2>
              <p>Book hotels on the go with our mobile app. Available for free on these platforms.</p>
              <div className="app-buttons">
                <button className="app-btn">
                  <Apple size={24} />
                  <div>
                    <span>Download on the</span>
                    <strong>App Store</strong>
                  </div>
                </button>
                <button className="app-btn">
                  <Play size={24} />
                  <div>
                    <span>Get it on</span>
                    <strong>Google Play</strong>
                  </div>
                </button>
              </div>
            </div>
            {/* double phone */}
            <div className="hosting-image">
              <img src="https://dokilink.com/sites/dokilink.com/files/field/image/phone.jpeg" alt="Hosting" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HotelLandingPage



