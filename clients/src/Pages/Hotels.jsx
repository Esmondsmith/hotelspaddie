//HERE, THE BANNER SEARCH WORKS FINE, PAGINATION WORKS, BUT THE TRENDINGDESTINATION CARD DOESN'T WORK
import React, { useEffect, useState } from "react";
import { Star, MapPin, Wifi, Car, Dumbbell, Coffee, UserPen, Plane, Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import './CSS/Hotels.css';

const Hotels = () => {
  // Function to get state ID based on city name for TD component
  const getCityDisplayName = (cityName) => {
    const cityMapping = {
      'Port Harcourt': 'PortHarcourt',
      'PortHarcourt': 'Port Harcourt',
      'Benin City': 'Benin',
      'Benin': 'Benin City',
      'ikeja': 'Ikeja',
      'lagos': 'Lagos',
      'abuja': 'Abuja',
      'kano': 'Kano',
      'ibadan': 'Ibadan',
      'owerri': 'Owerri',
      'kaduna': 'Kaduna'
    };
    return cityMapping[cityName?.toLowerCase()] || cityName;
  };

  const [hotels, setHotels] = useState([]);
  const [allHotels, setAllHotels] = useState([]); // Store all hotels for client-side filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(9); // Show 9 hotels per page

  const navigate = useNavigate();
  const location = useLocation();

  // Search states
  const [searchFilters, setSearchFilters] = useState({
    state: '',
    title: '',
    rating: '',
    amenities: ''
  });
  
  // Banner search states (for display purposes)
  const [bannerSearchData, setBannerSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    searchType: ''
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

  // Pagination calculations
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  // Reset to first page when hotels change
  useEffect(() => {
    setCurrentPage(1);
  }, [hotels]);

  // Parse URL parameters and set initial search filters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    // Extracting all possible search parameters from Banner
    const hotel = urlParams.get('hotel') || '';
    const hotelId = urlParams.get('hotelId') || '';
    const locationSearch = urlParams.get('location') || '';
    const city = urlParams.get('city') || '';
    const title = urlParams.get('title') || ''; 
    const checkIn = urlParams.get('checkIn') || '';
    const checkOut = urlParams.get('checkOut') || '';
    const guests = urlParams.get('guests') || '';
    const state = urlParams.get('state') || '';
    const rating = urlParams.get('rating') || '';
    const amenities = urlParams.get('amenities') || '';

    console.log('URL Parameters:', {
      hotel, hotelId, locationSearch, city, title, state, rating, amenities
    });

    // Determine search type and destination
    let destination = '';
    let searchType = 'general';
    let searchTerm = '';
    let stateFilter = state;

    if (hotel) {
      // Direct hotel search
      destination = hotel;
      searchTerm = hotel;
      searchType = 'hotel';
    } else if (locationSearch || city || title) {
      // Location/city-based search (from Banner, TrendingDestinations, or legacy)
      destination = locationSearch || city || title;
      searchTerm = destination;
      searchType = 'location';
      
      // Use the display name for better matching
      destination = getCityDisplayName(destination);
    }
    
    console.log('Determined search params:', {
      destination, searchTerm, searchType, stateFilter
    });
    
    // Set banner search data for display
    setBannerSearchData({
      destination,
      checkIn,
      checkOut,
      guests,
      searchType
    });
    
    // Set search filters for API calls - include both location name and state
    const initialFilters = {
      state: stateFilter,
      title: searchTerm,
      rating: rating,
      amenities: amenities
    };
    
    setSearchFilters(initialFilters);
    
    // Update page title based on search type
    if (searchType === 'hotel') {
      document.title = `${hotel} - Hotel Details | Your Hotel App`;
    } else if (searchType === 'location') {
      document.title = `Hotels in ${destination} | Your Hotel App`;
    }
    
    // Fetch hotels with initial filters
    const hasFilters = Object.values(initialFilters).some(value => value !== '');
    if (hasFilters) {
      fetchHotels(initialFilters, searchType, hotelId);
    } else {
      fetchHotels();
    }
  }, [location.search]);

  const fetchHotels = async (searchParams = null, searchType = 'general', hotelId = null) => {
    setLoading(true);
    setError("");
    setSearchLoading(true);
    
    try {
      // Always fetch all hotels first for client-side filtering
      console.log('Fetching all hotels from API...');
      const response = await fetch("http://localhost:3001/api/hotels");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allHotelsData = await response.json();
      console.log('All hotels fetched:', allHotelsData.length);
      setAllHotels(allHotelsData);
      
      // If we have a specific hotel ID, try to find that hotel first
      if (hotelId && searchType === 'hotel') {
        console.log('Looking for specific hotel with ID:', hotelId);
        const specificHotel = allHotelsData.find(hotel => 
          hotel.uuid === hotelId || 
          hotel.id === hotelId || 
          hotel.nid === hotelId ||
          String(hotel.uuid) === String(hotelId) ||
          String(hotel.id) === String(hotelId) ||
          String(hotel.nid) === String(hotelId)
        );
        
        if (specificHotel) {
          console.log('Found specific hotel:', specificHotel);
          setHotels([specificHotel]);
          setLoading(false);
          setSearchLoading(false);
          return;
        }
      }
      
      // Apply client-side filtering
      let filteredHotels = allHotelsData;
      
      if (searchParams) {
        console.log('Applying search filters:', searchParams);
        console.log('Search type:', searchType);
        
        // Filter by state first (if provided)
        if (searchParams.state) {
          const stateId = parseInt(searchParams.state);
          console.log('Filtering by state ID:', stateId);
          
          filteredHotels = filteredHotels.filter(hotel => {
            const hotelStateId = hotel.field_state_target_id;
            const matches = hotelStateId === stateId || parseInt(hotelStateId) === stateId;
            if (matches) {
              console.log('Hotel matches state filter:', hotel.title, 'State ID:', hotelStateId);
            }
            return matches;
          });
          
          console.log('Hotels after state filtering:', filteredHotels.length);
        }
        
        // Filter by title/name/location/city
        if (searchParams.title && searchParams.title.trim()) {
          const searchTerm = searchParams.title.toLowerCase().trim();
          console.log('Filtering by search term:', searchTerm);
          
          filteredHotels = filteredHotels.filter(hotel => {
            // Create variations of the search term for better matching
            const searchVariations = [
              searchTerm,
              getCityDisplayName(searchTerm).toLowerCase(),
              searchTerm.replace(/\s+/g, ''),
              searchTerm.replace(/\s+/g, '-')
            ];
            
            // Check against various hotel fields
            const matchFields = [
              hotel.title?.toLowerCase() || '',
              hotel.field_city?.toLowerCase() || '',
              hotel.field_state?.toLowerCase() || '',
              hotel.field_location?.toLowerCase() || ''
            ];
            
            // Check if any search variation matches any hotel field
            const matches = searchVariations.some(variation =>
              matchFields.some(field => {
                // For location-based searches, we want broader matching
                if (searchType === 'location') {
                  // Check if the field contains the variation OR if the variation contains the field
                  // This helps match "Ikeja" with hotels in "Ikeja" even if the hotel field just says "Lagos"
                  return field.includes(variation) || 
                         (variation.includes(field) && field.length > 2) ||
                         // Additional check for city names within states
                         (field.includes('lagos') && variation.includes('ikeja')) ||
                         (field.includes('ikeja') && variation.includes('lagos'));
                } else {
                  // For hotel name searches, use exact matching
                  return field.includes(variation);
                }
              })
            );
            
            if (matches) {
              console.log('Hotel matches search filter:', hotel.title, 'Fields:', {
                city: hotel.field_city,
                state: hotel.field_state,
                location: hotel.field_location
              });
            }
            
            return matches;
          });
          
          console.log('Hotels after title/location filtering:', filteredHotels.length);
        }
        
        // Filter by rating
        if (searchParams.rating) {
          const minRating = parseFloat(searchParams.rating);
          filteredHotels = filteredHotels.filter(hotel => 
            parseFloat(hotel.field_rating) >= minRating
          );
          console.log('Hotels after rating filtering:', filteredHotels.length);
        }
        
        // Filter by amenities
        if (searchParams.amenities) {
          const amenityId = parseInt(searchParams.amenities);
          filteredHotels = filteredHotels.filter(hotel => {
            if (!hotel.field_amenities) return false;
            // Assuming amenities are stored as comma-separated IDs or names
            const hotelAmenities = hotel.field_amenities.toString().toLowerCase();
            const selectedAmenity = amenitiesOptions.find(a => a.id === amenityId);
            if (selectedAmenity) {
              return hotelAmenities.includes(selectedAmenity.name.toLowerCase());
            }
            return false;
          });
          console.log('Hotels after amenities filtering:', filteredHotels.length);
        }
        
        // Special handling for location searches without state filter
        // This ensures we catch hotels in cities even if state isn't specified
        if (searchType === 'location' && !searchParams.state && searchParams.title) {
          const searchTerm = searchParams.title.toLowerCase().trim();
          
          // If no results with current filters, try a broader search
          if (filteredHotels.length === 0) {
            console.log('No results found, trying broader location search');
            
            filteredHotels = allHotelsData.filter(hotel => {
              const searchIn = [
                hotel.title?.toLowerCase() || '',
                hotel.field_city?.toLowerCase() || '',
                hotel.field_state?.toLowerCase() || '',
                hotel.field_location?.toLowerCase() || ''
              ].join(' ');
              
              return searchIn.includes(searchTerm) || 
                     searchTerm.includes(hotel.field_city?.toLowerCase() || '') ||
                     searchTerm.includes(hotel.field_state?.toLowerCase() || '');
            });
            
            console.log('Hotels after broader location search:', filteredHotels.length);
          }
        }
      }
      
      console.log('Final filtered hotels:', filteredHotels.length);
      setHotels(filteredHotels);
      
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError(`Failed to load hotels: ${err.message}`);
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
      
      // If the title field is cleared, automatically clear all search criteria
      if (field === 'title' && value.trim() === '') {
        setBannerSearchData({
          destination: '',
          checkIn: '',
          checkOut: '',
          guests: '',
          searchType: ''
        });
        // Clear all filters when title is cleared
        setSearchFilters({
          state: '',
          title: '',
          rating: '',
          amenities: ''
        });
        // Update URL to clean state
        navigate('/hotels', { replace: true });
        // Fetch all hotels
        fetchHotels();
        return;
      }
      
      const hasFilters = Object.values(newFilters).some(val => val !== '');
      if (hasFilters) {
        fetchHotels(newFilters);
      } else {
        fetchHotels();
      }
    }, 300);
  };

  const clearFilters = () => {
    setSearchFilters({
      state: '',
      title: '',
      rating: '',
      amenities: ''
    });
    setBannerSearchData({
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: '',
      searchType: ''
    });
    // Clear URL parameters as well
    navigate('/hotels');
    fetchHotels(); // Fetch all hotels
  };

  // Pagination handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of hotels section
    const hotelsSection = document.querySelector('.hotels-results-section');
    if (hotelsSection) {
      hotelsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes("wi-fi") || amenityLower.includes("wifi")) return <Wifi size={16} />;
    if (amenityLower.includes("parking")) return <Car size={16} />;
    if (amenityLower.includes("fitness") || amenityLower.includes("gym")) return <Dumbbell size={16} />;
    if (amenityLower.includes("restaurant") || amenityLower.includes("bar")) return <Coffee size={16} />;
    if (amenityLower.includes("airport")) return <Plane size={16} />;
    if (amenityLower.includes("front desk") || amenityLower.includes("user")) return <UserPen size={16} />;
    if (amenityLower.includes("spa") || amenityLower.includes("massage")) return <UserPen size={16} />;
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

  // Get display text based on search type
  const getSearchSummaryTitle = () => {
    if (bannerSearchData.searchType === 'hotel') {
      return `Showing results for hotel: "${bannerSearchData.destination}"`;
    } else if (bannerSearchData.searchType === 'location') {
      return `Hotels in ${bannerSearchData.destination}`;
    } else if (bannerSearchData.destination) {
      return `Search results for: "${bannerSearchData.destination}"`;
    }
    return 'Your Search Criteria:';
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
     
      <div className="hotels-page-container">
        {/* Header */}
        <div className="hotels-page-header">
          <h1>
            {bannerSearchData.searchType === 'hotel' ? 
              `Hotel: ${bannerSearchData.destination}` :
              bannerSearchData.searchType === 'location' ?
                `Hotels in ${bannerSearchData.destination}` :
                'Find Your Perfect Hotel'
            }
          </h1>
          <hr />
        </div>

        {/* Display Banner Search Summary */}
        {(bannerSearchData.destination || bannerSearchData.checkIn || bannerSearchData.checkOut || bannerSearchData.guests) && (
          <div className="banner-search-summary" style={{
            backgroundColor: '#f8f9fa',
            padding: '16px',
            margin: '20px 0',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00504B' }}>
              {getSearchSummaryTitle()}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {bannerSearchData.destination && (
                <span>
                  <strong>
                    {bannerSearchData.searchType === 'hotel' ? 'Hotel:' : 
                     bannerSearchData.searchType === 'location' ? 'Location:' : 'Search:'}
                  </strong> {bannerSearchData.destination}
                </span>
              )}
              {bannerSearchData.checkIn && (
                <span><strong>Check-in:</strong> {bannerSearchData.checkIn}</span>
              )}
              {bannerSearchData.checkOut && (
                <span><strong>Check-out:</strong> {bannerSearchData.checkOut}</span>
              )}
              {bannerSearchData.guests && (
                <span><strong>Guests:</strong> {bannerSearchData.guests}</span>
              )}
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="hotels-search-section">
          <div className="hotels-search-intro">
            <p>Search by hotel name or location.</p>
          </div>
          <form onSubmit={handleSearch}>
            {/* Main Search Bar */}
            <div className="hotels-search-form">
              <div className="search-input-area">
                <input
                  type="text"
                  placeholder="Search hotels by Name or Location (e.g., Eko, Lagos, Radisson)..."
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
                  <label>State/Location</label>
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
                  <label>Rating</label>
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
                  <label>Amenities</label>
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
                  <button type="button" onClick={clearFilters}>
                    <X size={14} />
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="hotels-results-section">
          <h3>
            {searchLoading ? (
              <>
                <div className="loading-spinner"></div>
                <h4>Searching...</h4>
              </>
            ) : (
              `Found ${hotels.length} hotel${hotels.length !== 1 ? 's' : ''}`
            )}
          </h3>
          {hotels.length > 0 && !searchLoading && (
            <>
              <p>Click "View Rooms" to see available rooms and book.</p>
              {totalPages > 1 && (
                <p style={{ marginTop: '8px', color: '#666' }}>
                  Showing {indexOfFirstHotel + 1}-{Math.min(indexOfLastHotel, hotels.length)} of {hotels.length} hotels
                </p>
              )}
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="hotels-error-message">
            {error}
          </div>
        )}

        {/* Hotels Grid */}
        {hotels.length === 0 && !loading && !error ? (
          <div className="hotels-no-results">
            <p>
              No hotels found matching your criteria. Try adjusting your search filters.
            </p>
          </div>
        ) : (
          <>
            <div className="hotels-grid">
              {currentHotels.map((hotel, index) => {
                // Get images from API - check multiple possible field names
                let images = [];
                let mainImage = null;
                
                if (hotel.field_media) {
                  images = hotel.field_media.split(", ");
                }
                
                mainImage = images.length > 0 && images[0] ? images[0].trim() : null;
                
                const amenities = hotel.field_amenities ? hotel.field_amenities.split(", ") : [];
                
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
                      <h3>{hotel.title}</h3>
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
                          <h4>
                            Key Amenities: 
                            {amenities.length > 4 && (
                              <span>+{amenities.length - 4} more</span>
                            )}
                          </h4>
                          <div className="amenities-list">
                            {amenities.slice(0, 4).map((amenity, idx) => (
                              <span key={idx}>
                                {getAmenityIcon(amenity)}
                                {amenity.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={() => {
                          console.log('Complete hotel object:', hotel);
                          console.log('All hotel fields:', Object.keys(hotel));
                          
                          const possibleIdFields = ['uuid', 'nid', 'id', 'hotel_id', 'hotelId', 'entity_id', 'entityId'];
                          let hotelId = null;
                          
                          for (const field of possibleIdFields) {
                            if (hotel[field]) {
                              hotelId = hotel[field];
                              console.log(`Found ID in field '${field}':`, hotelId);
                              break;
                            }
                          }
                          
                          if (!hotelId && hotel.title) {
                            hotelId = hotel.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                            console.log('Using title as fallback ID:', hotelId);
                          }
                          
                          if (!hotelId) {
                            console.error('No hotel ID or title found in hotel object:', hotel);
                            return;
                          }
                          
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
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '40px 0',
                gap: '8px'
              }}>
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="pagination-arrow"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                    color: currentPage === 1 ? '#999' : '#00504B',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="pagination-numbers" style={{ display: 'flex', gap: '4px' }}>
                  {getPageNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                      {pageNum === '...' ? (
                        <span style={{
                          padding: '8px 4px',
                          color: '#999'
                        }}>...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(pageNum)}
                          className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            backgroundColor: currentPage === pageNum ? '#00504B' : 'white',
                            color: currentPage === pageNum ? 'white' : '#333',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            minWidth: '40px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== pageNum) {
                              e.target.style.backgroundColor = '#f0f0f0';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== pageNum) {
                              e.target.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-arrow"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                    color: currentPage === totalPages ? '#999' : '#00504B',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Hotels;