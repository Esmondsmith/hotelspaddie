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

  const bestPicked = [
    {
      id: 1,
      name: "Luxury Ocean Resort",
      location: "Maldives",
      price: "$299",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Mountain View Lodge",
      location: "Swiss Alps",
      price: "$189",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "City Center Hotel",
      location: "New York",
      price: "$159",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Beachfront Paradise",
      location: "Bali",
      price: "$229",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Historic Boutique",
      location: "Paris",
      price: "$199",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Desert Oasis Resort",
      location: "Dubai",
      price: "$279",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop"
    }
  ];

  const topRated = [
    {
      id: 1,
      name: "Grand Palace Hotel",
      location: "Tokyo",
      price: "$349",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Seaside Retreat",
      location: "Santorini",
      price: "$419",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Urban Luxury Suite",
      location: "London",
      price: "$289",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Tropical Villa",
      location: "Thailand",
      price: "$259",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1587294363867-c4b6ed4dc4a6?w=400&h=300&fit=crop"
    }
  ];

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

      {/* Best Picked Section */}
      <section className="hotels-section">
        <div className="container">
          <h2>Best Picked</h2>
          <div className="hotels-grid">
            {bestPicked.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-image">
                  <img src={hotel.image} alt={hotel.name} />
                  <div className="hotel-rating">
                    <Star size={16} fill="currentColor" />
                    {hotel.rating}
                  </div>
                </div>
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p className="location">{hotel.location}</p>
                  <div className="price">{hotel.price}/night</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="hotels-section">
        <div className="container">
          <h2>Top Rated</h2>
          <div className="hotels-grid">
            {topRated.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-image">
                  <img src={hotel.image} alt={hotel.name} />
                  <div className="hotel-rating">
                    <Star size={16} fill="currentColor" />
                    {hotel.rating}
                  </div>
                </div>
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p className="location">{hotel.location}</p>
                  <div className="price">{hotel.price}/night</div>
                </div>
              </div>
            ))}
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
)}

export default HotelLandingPage



