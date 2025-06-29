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
      {/* Hosting Section */}
      <section className="hosting-section">
        <div className="container">
          <div className="hosting-content">
            <div className="hosting-text">
              <h2>Try Hosting With Us</h2>
              <p>Join thousands of hosts who trust us to manage their properties and maximize their earnings.</p>
              <button className="hosting-btn">Learn More</button>
            </div>
            <div className="hosting-image">
              <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop" alt="Hosting" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="app-section">
        <div className="container">
          <div className="app-content">
            <div className="app-text">
              <h2>Download Our Mobile App</h2>
              <p>Book hotels on the go with our mobile app. Available for iOS and Android.</p>
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
            <div className="app-image">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="app-preview">
                    <div className="app-header">BookStaySuite</div>
                    <div className="app-search">Search Hotels...</div>
                    <div className="app-hotels">
                      <div className="app-hotel"></div>
                      <div className="app-hotel"></div>
                      <div className="app-hotel"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HotelLandingPage



