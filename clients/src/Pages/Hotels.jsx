import React, { useEffect, useState } from "react";
import { Star, MapPin, Wifi, Car, Dumbbell, Coffee, UserPen, Plane, Search, Filter, X } from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";



const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const handleNavigation = (hotelId) => {
    // Replace with your navigation logic
    console.log(`Navigate to hotel: ${hotelId}`);
    // Example: window.location.href = `/listing/${hotelId}`;
  };

  const navigate = useNavigate();

  // Search states
  const [searchFilters, setSearchFilters] = useState({
    state: '',
    title: '',
    rating: '',
    amenities: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Available options for dropdowns
  const [states] = useState([
    { id: 32, name: 'Lagos' },
    { id: 33, name: 'Abuja' },
    { id: 34, name: 'Kano' },
    { id: 35, name: 'Port Harcourt' },
    { id: 36, name: 'Ibadan' }
  ]);

  const [amenitiesOptions] = useState([
    { id: 20, name: 'Wi-Fi' },
    { id: 21, name: 'Parking' },
    { id: 22, name: 'Gym/Fitness Center' },
    { id: 23, name: 'Restaurant' },
    { id: 24, name: 'Bar/Lounge' },
    { id: 25, name: 'Swimming Pool' },
    { id: 26, name: 'Spa' },
    { id: 27, name: 'Business Center' }
  ]);

  const ratingOptions = [
    { value: 1, label: '1 Star' },
    { value: 2, label: '2 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 5, label: '5 Stars' }
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async (searchParams = null) => {
    setLoading(true);
    setError("");
    setSearchLoading(true);
    
    try {
      let url = "http://localhost:3001/api/hotels";
      
      // If search parameters are provided, use search endpoint
      if (searchParams) {
        url = "http://localhost:3001/api/search/hotels";
        const params = new URLSearchParams();
        
        if (searchParams.state) params.append('field_state_target_id', searchParams.state);
        if (searchParams.title) params.append('title', searchParams.title);
        if (searchParams.rating) params.append('field_rating_value', searchParams.rating);
        if (searchParams.amenities) params.append('field_amenities_target_id', searchParams.amenities);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to load hotels. Please try again.");
      setHotels([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const hasFilters = Object.values(searchFilters).some(value => value !== '');
    
    if (hasFilters) {
      fetchHotels(searchFilters);
    } else {
      fetchHotels(); // Fetch all hotels if no filters
    }
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      state: '',
      title: '',
      rating: '',
      amenities: ''
    });
    fetchHotels(); // Fetch all hotels
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes("wi-fi") || amenityLower.includes("wifi")) return <Wifi size={16} />;
    if (amenityLower.includes("parking")) return <Car size={16} />;
    if (amenityLower.includes("fitness") || amenityLower.includes("gym")) return <Dumbbell size={16} />;
    if (amenityLower.includes("restaurant") || amenityLower.includes("bar")) return <Coffee size={16} />;
    if (amenityLower.includes("airport")) return <Plane size={16} />;
    if (amenityLower.includes("front desk") || amenityLower.includes("user")) return <UserPen size={16} />;
    return null;
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="#FFD700" color="#FFD700" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="#FFD700" color="#FFD700" style={{ clipPath: "inset(0 50% 0 0)" }} />);
    }
    const emptyStars = 5 - Math.ceil(numRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color="#D3D3D3" />);
    }
    return stars;
  };

  if (loading && !searchLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px', 
        fontSize: '18px' 
      }}>
        Loading hotels...
      </div>
    );
  }

  return (
    <>
    <Navbar />
   
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', margin: '80px 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#333' }}>
          Find Your Perfect Hotel
        </h1>
        <hr style={{ width: '100px', border: '2px solid #00504B', margin: '0 auto' }} />
      </div>

      {/* Search Section */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <div onSubmit={handleSearch}>
          {/* Main Search Bar */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '15px',
            flexWrap: 'wrap' 
          }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search hotels by name..."
                value={searchFilters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#00504B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: searchLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: searchLoading ? 0.7 : 1
              }}
            >
              <Search size={16} />
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '12px 20px',
                backgroundColor: showFilters ? '#00504B' : 'white',
                color: showFilters ? 'white' : '#00504B',
                border: '1px solid #00504B',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              {/* State Filter */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  State/Location
                </label>
                <select
                  value={searchFilters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Minimum Rating
                </label>
                <select
                  value={searchFilters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Any Rating</option>
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Amenities Filter */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Amenities
                </label>
                <select
                  value={searchFilters.amenities}
                  onChange={(e) => handleFilterChange('amenities', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Any Amenity</option>
                  {amenitiesOptions.map(amenity => (
                    <option key={amenity.id} value={amenity.id}>{amenity.name}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <X size={14} />
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#333', marginBottom: '10px' }}>
          {searchLoading ? 'Searching...' : `Found ${hotels.length} hotel${hotels.length !== 1 ? 's' : ''}`}
        </h3>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {/* Hotels Grid */}
      {hotels.length === 0 && !loading && !error ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px' 
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            No hotels found matching your criteria. Try adjusting your search filters.
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '20px' 
        }}>
          {hotels.map((hotel, index) => {
            const images = hotel.field_media ? hotel.field_media.split(", ") : [];
            const mainImage = images[0] || "/default-hotel.jpg";
            const amenities = hotel.field_amenities ? hotel.field_amenities.split(", ") : [];
            
            return (
              <div 
                key={hotel.uuid || hotel.nid || index} 
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                {/* Hotel Image */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={mainImage} 
                    alt={hotel.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {hotel.field_rating && (
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>{hotel.field_rating}</span>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {renderStars(parseFloat(hotel.field_rating))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hotel Info */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    margin: '0 0 10px 0', 
                    fontSize: '1.4rem', 
                    color: '#333',
                    fontWeight: '600'
                  }}>
                    {hotel.title}
                  </h3>
                  
                  {hotel.field_location && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      marginBottom: '12px',
                      color: '#666'
                    }}>
                      <MapPin size={16} />
                      <span>{hotel.field_location}</span>
                    </div>
                  )}

                  {hotel.field_body && (
                    <p style={{ 
                      color: '#555', 
                      lineHeight: '1.5', 
                      marginBottom: '15px',
                      fontSize: '14px'
                    }}>
                      {hotel.field_body.length > 120
                        ? `${hotel.field_body.substring(0, 120)}...`
                        : hotel.field_body}
                    </p>
                  )}

                  {amenities.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        marginBottom: '8px',
                        color: '#333'
                      }}>
                        Key Amenities: 
                        
                         {amenities.length > 4 && (
                          <span style={{
                            backgroundColor: '#00504B',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            marginLeft: '10px',
                          }}>
                            +{amenities.length - 4} more
                          </span>
                        )}
                      </h4>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '6px' 
                      }}>
                        {amenities.slice(0, 4).map((amenity, idx) => (
                          <span 
                            key={idx} 
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#f0f0f0',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              color: '#555'
                            }}
                          >
                            {getAmenityIcon(amenity)}
                            {amenity.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    // onClick={() => handleNavigation(hotel.uuid || hotel.nid)}
                    onClick={() => navigate(`/listing/${hotel.uuid || hotel.nid}`)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#00504B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#003d39'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#00504B'}
                  >
                    View Rooms
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
};

export default Hotels;
