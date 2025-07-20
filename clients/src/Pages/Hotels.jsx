import React, { useEffect, useState } from "react";
import { Star, MapPin, Wifi, Car, Dumbbell, Coffee, UserPen, Plane, Search, Filter, X } from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import './CSS/Hotels.css';



const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();

  // Search states
  const [searchFilters, setSearchFilters] = useState({
    state: '',
    title: '',
    rating: '',
    amenities: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Available options for state dropdowns
  const [states] = useState([
    { id: 32, name: 'Lagos' },
    { id: 33, name: 'Abuja' },
    { id: 34, name: 'Kano' },
    { id: 35, name: 'Port Harcourt' },
    { id: 36, name: 'Ibadan' }
  ]);

  // Available options for amenities dropdowns
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

  // Available options for rating dropdowns
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
   
    <div className="hotels-page-container" >
      {/* Header */}
      <div className="hotels-page-header">
        <h1>
          Find Your Perfect Hotel
        </h1>
        <hr />
      </div>

      {/* Search Section */}
      <div className="hotels-search-section">
        <div className="hotels-search-intro">
          <p >
            Search by hotel name, location, rating, or amenities. Try searching for "Radisson" or filter by Lagos.
          </p>
        </div>
        <form onSubmit={handleSearch} >
          {/* Main Search Bar */}
          <div className="hotels-search-form">
            <div className="search-input-area">
              <input
                type="text"
                placeholder="Search hotels by name (e.g., Eko)..."
                value={searchFilters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="search-input-btn"
              style={{ 
                cursor: searchLoading ? 'not-allowed' : 'pointer', 
                opacity: searchLoading ? 0.7 : 1
              }}
            >
              <Search size={16} />
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="search-toggle-filters-btn"
              style={{
                backgroundColor: showFilters ? '#00504B' : 'white',
                color: showFilters ? 'white' : '#00504B',
              }}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="hotels-advanced-filters">
              {/* State Filter */}
              <div className="hotels-filter-state">
                <label>
                  State/Location
                </label>
                <select
                  value={searchFilters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
              </div>
              {/* Rating Filter */}
              <div className="hotels-filter-rating">
                <label>
                  Rating
                </label>
                <select
                  value={searchFilters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                >
                  <option value="">Any Rating</option>
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Amenities Filter */}
              <div className="hotels-filter-amenities">
                <label>
                  Amenities
                </label>
                <select
                  value={searchFilters.amenities}
                  onChange={(e) => handleFilterChange('amenities', e.target.value)}
                >
                  <option value="">Any Amenity</option>
                  {amenitiesOptions.map(amenity => (
                    <option key={amenity.id} value={amenity.id}>{amenity.name}</option>
                  ))}
                </select>
              </div>
              {/* Clear Filters Button */}
              <div className="hotels-clear-filters">
                <button
                  type="button"
                  onClick={clearFilters}
                >
                  <X size={14} />
                  Clear All
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Results Section */}
      <div className="hotels-results-section">
        <h3 >
          {searchLoading ? 'Searching...' : `Found ${hotels.length} hotel${hotels.length !== 1 ? 's' : ''}`}
        </h3>
        {hotels.length > 0 && (
          <p>
            Click "View Rooms" to see available rooms and book.
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="hotels-error-message" >
          {error}
        </div>
      )}

      {/* Hotels Grid */}
      {hotels.length === 0 && !loading && !error ? (
        <div className="hotels-no-results">
          <p >
            No hotels found matching your criteria. Try adjusting your search filters.
          </p>
        </div>
      ) : (
        <div className="hotels-grid">
          {hotels.map((hotel, index) => {
            // Get images from API - check multiple possible field names
            let images = [];
            let mainImage = null;
            
            if (hotel.field_media) {
              images = hotel.field_media.split(", ");
            } else if (hotel.field_media) {
              images = hotel.field_media.split(", ");
            }
            
            mainImage = images.length > 0 && images[0] ? images[0].trim() : null;
            
            //const amenities = hotel.field_amenities ? hotel.field_amenities.split(", ") : [];
            const amenities = hotel.field_amenities ? hotel.field_amenities.split(", ") : hotel.field_amenities ? hotel.field_amenities.split(", ") : [];
            
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
                className="hotel-card"
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
                <div className="hotels-image">
                  {mainImage ? (
                    <img 
                      src={mainImage} 
                      alt={hotel.title}
                      onError={(e) => {
                      console.log('Image failed to load from API:', mainImage);
                        // Just log the error, don't manipulate DOM
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully from API:', mainImage);
                      }}
                    />
                  ) : (
                    <div className="hotels-no-image">
                      No Image from API
                    </div>
                  )}
                  {hotel.field_rating && (
                    <div className="hotels-card-rating">
                      <span style={{ fontWeight: 'bold' }}>{hotel.field_rating}</span>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {renderStars(parseFloat(hotel.field_rating))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hotel Info */}
                <div className="hotels-info">
                  <h3 >
                    {hotel.title}
                  </h3>
                  {hotel.field_location && (
                    <div className="hotels-location">
                      <MapPin size={16} />
                      <span>{hotel.field_location}</span>
                    </div>
                  )}
                  {hotel.field_body && (
                    <p className="hotels-description">
                      {hotel.field_body.length > 120
                        ? `${hotel.field_body.substring(0, 120)}...`
                        : hotel.field_body}
                    </p>
                  )}

                  {amenities.length > 0 && (
                    <div className="hotels-amenities">
                      <h4 >
                        Key Amenities: 
                        {amenities.length > 4 && (
                          <span >
                            +{amenities.length - 4} more
                          </span>
                        )}
                      </h4>
                      <div className="amenities-list">
                        {amenities.slice(0, 4).map((amenity, idx) => (
                          <span 
                            key={idx}
                          >
                            {getAmenityIcon(amenity)}
                            {amenity.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

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
                    className="hotels-view-rooms-btn"
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#003d39'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#00504B'}
                  >
                    View Rooms
                  </button>
                </div>
                
                {/* Debug Section - Shows all available properties */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="hotels-debug-info">
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
