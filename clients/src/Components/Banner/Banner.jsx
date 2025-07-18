import React, { useState } from 'react';
import './Banner.css';
import main_banner from '../Assets/main_banner.jpg';
// import { FaSearch, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaHotel } from 'react-icons/fa';
import { Search, Calendar, Users, MapPin, Star, Download, Apple, Play } from 'lucide-react';

const Banner = () => {
  
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
    <div className="banner" style={{ backgroundImage: `url(${main_banner})` }}>
      <section className="">
        <div className="hero-content">
          <h1>Find and book</h1>
          <h2>Hotels with ease.</h2>
          <p>We provide what you need to enjoy your holiday with your family <br /> Time to create another memorable moment</p>
          <div className='search-form-wrapper'>
            <p>SEARCH</p>
            <div className="banner-search-form">
              <div className="search-field">
                <MapPin size={20} />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                />
              </div>
              
              <div className="search-field">
                <Calendar size={20} />
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                />
              </div>
              
              <div className="search-field">
                <Calendar size={20} />
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                />
              </div>
              
              <div className="search-field">
                <Users size={20} />
                <select
                  value={searchData.guests}
                  onChange={(e) => handleInputChange('guests', e.target.value)}
                >
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4+ guests</option>
                </select>
              </div>
              
              <button className="banner-search-btn">
                <Search size={20} />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;
