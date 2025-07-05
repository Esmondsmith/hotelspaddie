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
      let url = "https://zodr.zodml.org/api/hotels";
      
      // If search parameters are provided, use search endpoint
      if (searchParams) {
        url = "https://zodr.zodml.org/api/search/hotels";
        const params = new URLSearchParams();
        
        if (searchParams.state) params.append('field_state_target_id', searchParams.state);
        if (searchParams.title) params.append('title', searchParams.title);
        if (searchParams.rating) params.append('field_rating_value', searchParams.rating);
        if (searchParams.amenities) params.append('field_amenities_target_id', searchParams.amenities);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      console.log('Search URL used:', url);
      console.log('Search parameters:', searchParams);
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
    
    // Auto-search when filters change (with a small delay to avoid too many requests)
    setTimeout(() => {
      const newFilters = { ...searchFilters, [field]: value };
      const hasFilters = Object.values(newFilters).some(val => val !== '');
      if (hasFilters) {
        fetchHotels(newFilters);
      } else {
        fetchHotels();
      }
    }, 500);
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
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>
            Search by hotel name, location, rating, or amenities. Try searching for "Radisson" or filter by Lagos (State ID: 32).
          </p>
        </div>
        <form onSubmit={handleSearch}>
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
                placeholder="Search hotels by name (e.g., Radisson)..."
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
              onClick={() => {
                const hasFilters = Object.values(searchFilters).some(value => value !== '');
                if (hasFilters) {
                  fetchHotels(searchFilters);
                } else {
                  fetchHotels();
                }
              }}
              disabled={searchLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
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
              {searchLoading ? 'Searching...' : 'Apply Filters'}
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
        </form>
        
        {/* Quick Search Examples */}
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '12px', margin: '0 0 10px 0' }}>
            Quick examples: 
            <button 
              onClick={() => handleFilterChange('title', 'Radisson')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#00504B', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                margin: '0 5px'
              }}
            >
              Search "Radisson"
            </button>
            <button 
              onClick={() => handleFilterChange('state', '32')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#00504B', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                margin: '0 5px'
              }}
            >
              Filter by Lagos
            </button>
            <button 
              onClick={() => handleFilterChange('rating', '4')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#00504B', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                margin: '0 5px'
              }}
            >
              4+ Star Hotels
            </button>
          </p>
        </div>
      </div>

      {/* Results Section */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#333', marginBottom: '10px' }}>
          {searchLoading ? 'Searching...' : `Found ${hotels.length} hotel${hotels.length !== 1 ? 's' : ''}`}
        </h3>
        {hotels.length > 0 && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            Click "View Rooms" on any hotel card to see available rooms and book.
          </p>
        )}
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
            // Get images from API - check multiple possible field names
            let images = [];
            let mainImage = null;
            
            // Check different possible image field names
            if (hotel.field_media) {
              images = hotel.field_media.split(", ");
            } else if (hotel.field_images) {
              images = hotel.field_images.split(", ");
            } else if (hotel.images) {
              images = hotel.images.split(", ");
            } else if (hotel.field_photo) {
              images = hotel.field_photo.split(", ");
            }
            
            mainImage = images.length > 0 && images[0] ? images[0].trim() : null;
            
            const amenities = hotel.field_amenities ? hotel.field_amenities.split(", ") : [];
            
            // Debug log to see what data we're getting
            console.log('Hotel data:', hotel);
            console.log('field_media:', hotel.field_media);
            console.log('field_images:', hotel.field_images);
            console.log('images:', hotel.images);
            console.log('field_photo:', hotel.field_photo);
            console.log('Images array:', images);
            console.log('Main image URL:', mainImage);
            
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
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                  {mainImage ? (
                    <img 
                      src={mainImage} 
                      alt={hotel.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        console.log('Image failed to load from API:', mainImage);
                        // Just log the error, don't manipulate DOM
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully from API:', mainImage);
                      }}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#666',
                      fontSize: '14px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}>
                      No Image from API
                    </div>
                  )}
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
                  
                  {/* Hotel ID and UUID */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginBottom: '8px',
                    fontSize: '12px',
                    color: '#888'
                  }}>
                    {hotel.nid && <span>ID: {hotel.nid}</span>}
                    {hotel.uuid && <span>UUID: {hotel.uuid.substring(0, 8)}...</span>}
                  </div>
                  
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

                  {/* Additional Hotel Details */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '8px', 
                    marginBottom: '15px',
                    fontSize: '13px'
                  }}>
                    {hotel.field_state && (
                      <div style={{ color: '#555' }}>
                        <strong>State:</strong> {hotel.field_state}
                      </div>
                    )}
                    {hotel.field_city && (
                      <div style={{ color: '#555' }}>
                        <strong>City:</strong> {hotel.field_city}
                      </div>
                    )}
                    {hotel.field_address && (
                      <div style={{ color: '#555', gridColumn: '1 / -1' }}>
                        <strong>Address:</strong> {hotel.field_address}
                      </div>
                    )}
                    {hotel.field_phone && (
                      <div style={{ color: '#555' }}>
                        <strong>Phone:</strong> {hotel.field_phone}
                      </div>
                    )}
                    {hotel.field_email && (
                      <div style={{ color: '#555' }}>
                        <strong>Email:</strong> {hotel.field_email}
                      </div>
                    )}
                    {hotel.field_website && (
                      <div style={{ color: '#555', gridColumn: '1 / -1' }}>
                        <strong>Website:</strong> 
                        <a 
                          href={hotel.field_website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#00504B', textDecoration: 'underline', marginLeft: '5px' }}
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

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
                      {amenities.length > 4 && (
                        <div style={{ 
                          marginTop: '8px', 
                          fontSize: '12px', 
                          color: '#666',
                          fontStyle: 'italic'
                        }}>
                          Also includes: {amenities.slice(4).join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Additional Hotel Properties */}
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: '#333'
                    }}>
                      Hotel Details:
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '6px',
                      fontSize: '12px'
                    }}>
                      {hotel.field_room_count && (
                        <div style={{ color: '#555' }}>
                          <strong>Rooms:</strong> {hotel.field_room_count}
                        </div>
                      )}
                      {hotel.field_floor_count && (
                        <div style={{ color: '#555' }}>
                          <strong>Floors:</strong> {hotel.field_floor_count}
                        </div>
                      )}
                      {hotel.field_check_in && (
                        <div style={{ color: '#555' }}>
                          <strong>Check-in:</strong> {hotel.field_check_in}
                        </div>
                      )}
                      {hotel.field_check_out && (
                        <div style={{ color: '#555' }}>
                          <strong>Check-out:</strong> {hotel.field_check_out}
                        </div>
                      )}
                      {hotel.field_pet_friendly && (
                        <div style={{ color: '#555' }}>
                          <strong>Pet Friendly:</strong> {hotel.field_pet_friendly === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_wheelchair_accessible && (
                        <div style={{ color: '#555' }}>
                          <strong>Wheelchair Access:</strong> {hotel.field_wheelchair_accessible === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_free_wifi && (
                        <div style={{ color: '#555' }}>
                          <strong>Free WiFi:</strong> {hotel.field_free_wifi === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_free_parking && (
                        <div style={{ color: '#555' }}>
                          <strong>Free Parking:</strong> {hotel.field_free_parking === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_airport_shuttle && (
                        <div style={{ color: '#555' }}>
                          <strong>Airport Shuttle:</strong> {hotel.field_airport_shuttle === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_restaurant && (
                        <div style={{ color: '#555' }}>
                          <strong>Restaurant:</strong> {hotel.field_restaurant === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_bar && (
                        <div style={{ color: '#555' }}>
                          <strong>Bar/Lounge:</strong> {hotel.field_bar === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_pool && (
                        <div style={{ color: '#555' }}>
                          <strong>Swimming Pool:</strong> {hotel.field_pool === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_gym && (
                        <div style={{ color: '#555' }}>
                          <strong>Gym/Fitness:</strong> {hotel.field_gym === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_spa && (
                        <div style={{ color: '#555' }}>
                          <strong>Spa:</strong> {hotel.field_spa === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_business_center && (
                        <div style={{ color: '#555' }}>
                          <strong>Business Center:</strong> {hotel.field_business_center === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_concierge && (
                        <div style={{ color: '#555' }}>
                          <strong>Concierge:</strong> {hotel.field_concierge === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_room_service && (
                        <div style={{ color: '#555' }}>
                          <strong>Room Service:</strong> {hotel.field_room_service === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_laundry && (
                        <div style={{ color: '#555' }}>
                          <strong>Laundry:</strong> {hotel.field_laundry === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_dry_cleaning && (
                        <div style={{ color: '#555' }}>
                          <strong>Dry Cleaning:</strong> {hotel.field_dry_cleaning === '1' ? 'Yes' : 'No'}
                        </div>
                      )}
                      {hotel.field_currency && (
                        <div style={{ color: '#555' }}>
                          <strong>Currency:</strong> {hotel.field_currency}
                        </div>
                      )}
                      {hotel.field_language && (
                        <div style={{ color: '#555' }}>
                          <strong>Languages:</strong> {hotel.field_language}
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      // Log all available fields to see what we have
                      console.log('Complete hotel object:', hotel);
                      console.log('All hotel fields:', Object.keys(hotel));
                      
                      // Try to find any ID-like field
                      const possibleIdFields = ['uuid', 'nid', 'id', 'hotel_id', 'hotelId', 'hotel_id', 'entity_id', 'entityId'];
                      let hotelId = null;
                      
                      for (const field of possibleIdFields) {
                        if (hotel[field]) {
                          hotelId = hotel[field];
                          console.log(`Found ID in field '${field}':`, hotelId);
                          break;
                        }
                      }
                      
                      // If no ID found, use title as fallback (URL-safe)
                      if (!hotelId && hotel.title) {
                        hotelId = hotel.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                        console.log('Using title as fallback ID:', hotelId);
                      }
                      
                      if (!hotelId) {
                        console.error('No hotel ID or title found in hotel object:', hotel);
                        return;
                      }
                      
                      // Convert to string to ensure consistent navigation
                      const hotelIdString = String(hotelId);
                      console.log('Navigating with hotel ID:', hotelIdString);
                      navigate(`/listing/${hotelIdString}`);
                    }}
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
                
                {/* Debug Section - Shows all available properties */}
                {process.env.NODE_ENV === 'development' && (
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f0f0f0', 
                    borderTop: '1px solid #ddd',
                    fontSize: '10px',
                    fontFamily: 'monospace'
                  }}>
                    {/* <details>
                      <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        Debug: All Hotel Properties
                      </summary>
                      <pre style={{ 
                        whiteSpace: 'pre-wrap', 
                        wordBreak: 'break-word',
                        fontSize: '10px',
                        margin: '5px 0 0 0'
                      }}>
                        {JSON.stringify(hotel, null, 2)}
                      </pre>
                    </details> */}
                  </div>
                )}
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
