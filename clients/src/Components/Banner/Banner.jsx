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
          <h1>Find and book Hotels with ease</h1>
          <p>Discover amazing places to stay around the world</p>
          
          <div className="search-form">
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
            
            <button className="search-btn">
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;







// const Banner = () => {
//   return (
//     <div className="banner" style={{ backgroundImage: `url(${main_banner})` }}>
//       <div className="banner-overlay">
//         <div className="banner-text">
//           <h1>Find and book<br />Hotels with ease.</h1>
//           <p>We provide what you need to enjoy your holiday with family.<br />Time to make another memorable moments.</p>
//         </div>

//         <div className="search-box">
//           <div className="search-title">
//             <strong>SEARCH</strong>
//           </div>
//           <div className="search-fields">
//             <div className="field">
//               <FaCalendarAlt />
//               <span>Check Available</span>
//             </div>
//             <div className="field">
//               <FaUser />
//               <span>Person</span>
//               <select><option>2</option></select>
//             </div>
//             <div className="field">
//               <FaMapMarkerAlt />
//               <span>Location</span>
//             </div>
//             <div className="field">
//               <FaHotel />
//               <span>Room Type</span>
//             </div>
//             <button className="search-btn">
//               <FaSearch />
//             </button>
//           </div>
//         </div>

//         <div className="features">
//           <div><strong>2500+</strong><br />Users</div>
//           <div><strong>200+</strong><br />Hotels</div>
//           <div><strong>100+</strong><br />Cities</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;
