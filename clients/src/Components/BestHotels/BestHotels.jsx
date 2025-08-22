import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BestHotels.css';
import { Star, MapPin, Wifi, Car, Dumbbell, Coffee } from 'lucide-react';

const BestHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBestHotels();
  }, []);

  const fetchBestHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/hotels');
      
      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await response.json();
      
      // Sort hotels by rating (highest first) and take the best 6
      const sortedHotels = data
        .sort((a, b) => parseFloat(b.field_rating) - parseFloat(a.field_rating))
        .slice(0, 6);

      setHotels(sortedHotels);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Failed to load hotels. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wi-fi') || amenityLower.includes('wifi')) return <Wifi size={16} />;
    if (amenityLower.includes('parking')) return <Car size={16} />;
    if (amenityLower.includes('fitness') || amenityLower.includes('gym')) return <Dumbbell size={16} />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('bar')) return <Coffee size={16} />;
    return null;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="#FFD700" color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="#FFD700" color="#FFD700" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color="#D3D3D3" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="best-hotels">
        <div className="best-hotels-header">
          <h1>Best Hotels by Rating</h1>
          <hr />
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading best hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="best-hotels">
        <div className="best-hotels-header">
          <h1>Best Hotels by Rating</h1>
          <hr />
        </div>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchBestHotels} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="best-hotels">
      <div className="best-hotels-header">
        <h1>Best Hotels by Rating</h1>
        <hr />
      </div>
  
      {hotels.length === 0 ? (
        <div className="no-hotels">
          <p>No hotels available at the moment.</p>
        </div>
      ) : (
        <div className="hotels-grid">
          {hotels.map((hotel, index) => {
            const images = hotel.field_media ? hotel.field_media.split(', ') : [];
            const mainImage = images[0] || '/default-hotel.jpg';
            const amenities = hotel.field_amenities ? hotel.field_amenities.split(', ') : [];
            
            return (
              <div key={hotel.uuid || index} className="hotel-card">
                <div className="hotel-image">
                  <img src={mainImage} alt={hotel.title} />
                  <div className="hotel-rating">
                    <span className="rating-number">{hotel.field_rating}</span>
                    <div className="stars">
                      {renderStars(parseFloat(hotel.field_rating))}
                    </div>
                  </div>
                </div>
                
                <div className="hotel-info">
                  <h3 className="hotel-title">{hotel.title}</h3>
                  
                  {hotel.field_location && (
                    <div className="hotel-location">
                      <MapPin size={16} />
                      <span>{hotel.field_location}</span>
                    </div>
                  )}
                  
                  {hotel.field_body && (
                    <p className="hotel-description">
                      {hotel.field_body.length > 120 
                        ? `${hotel.field_body.substring(0, 120)}...` 
                        : hotel.field_body
                      }
                    </p>
                  )}
                  
                  {amenities.length > 0 && (
                    <div className="hotel-amenities">
                      <h4>Key Amenities:</h4>
                      <div className="amenities-list">
                        {amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="amenity-item">
                            {getAmenityIcon(amenity)}
                            {amenity.trim()}
                          </span>
                        ))}
                        {amenities.length > 3 && (
                          <span className="amenity-more">+{amenities.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <button className="view-details-btn" onClick={() => navigate(`/listing/${hotel.uuid || hotel.nid}`)}>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BestHotels; 