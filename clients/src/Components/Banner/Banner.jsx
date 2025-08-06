import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Banner.css';
import main_banner from '../Assets/main_banner.jpg';
import { Search, Calendar, Users, MapPin, Star, Download, Apple, Play, ChevronDown, Building } from 'lucide-react';

const Banner = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2 guests'
  });
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [hotels, setHotels] = useState([]);
  const suggestionsRef = useRef(null);
  const locationInputRef = useRef(null);
  const debounceRef = useRef(null);
  
  // Fetch hotels on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/hotels");
        if (response.ok) {
          const hotelsData = await response.json();
          setHotels(hotelsData);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    
    fetchHotels();
  }, []);
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Search hotels by name/title
  const searchHotels = (query) => {
    if (!query || query.trim().length < 2) return [];
    
    const searchTerm = query.toLowerCase().trim();
    
    return hotels
      .filter(hotel => 
        hotel.title?.toLowerCase().includes(searchTerm) ||
        hotel.field_city?.toLowerCase().includes(searchTerm) ||
        hotel.field_state?.toLowerCase().includes(searchTerm) ||
        hotel.field_location?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5) // Limit to 5 hotel results
      .map(hotel => ({
        id: hotel.uuid || hotel.id || hotel.nid,
        type: 'hotel',
        name: hotel.title,
        location: hotel.field_city || hotel.field_location || hotel.field_state || '',
        rating: hotel.field_rating,
        displayText: hotel.title,
        secondaryText: hotel.field_city ? `${hotel.field_city}, ${hotel.field_state || ''}`.replace(/, $/, '') :  hotel.field_location || hotel.field_state || '',
        hotelData: hotel
      }));
  };

  // Fetch location suggestions from OpenStreetMap Nominatim API
  const fetchLocationSuggestions = async (query) => {
    if (!query || query.trim().length < 2) return [];

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=ng&q=${encodeURIComponent(query.trim())}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        return data.map(item => {
          const address = item.address || {};
          let displayName = '';
          let shortName = '';
          
          if (address.city || address.town || address.village) {
            shortName = address.city || address.town || address.village;
            displayName = shortName;
            
            if (address.state) {
              displayName += `, ${address.state}`;
            }
            if (address.country) {
              displayName += `, ${address.country}`;
            }
          } else if (address.state) {
            shortName = address.state;
            displayName = `${address.state}, ${address.country || 'Nigeria'}`;
          } else {
            const parts = item.display_name.split(',');
            shortName = parts[0];
            displayName = parts.slice(0, 3).join(', ');
          }
          
          return {
            id: item.place_id,
            type: 'location',
            name: shortName,
            displayText: shortName,
            secondaryText: displayName,
            lat: item.lat,
            lon: item.lon,
            category: item.category
          };
        });
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      return [];
    }
    
    return [];
  };

  // Combined search function
  const performSearch = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    
    try {
      // Search hotels locally
      const hotelResults = searchHotels(query);
      
      // Search locations via API
      const locationResults = await fetchLocationSuggestions(query);
      
      // Combine results with hotels first, then locations
      const combinedResults = [
        ...hotelResults,
        ...locationResults.filter((location, index, self) =>
          // Remove duplicate locations
          index === self.findIndex(t => t.name.toLowerCase() === location.name.toLowerCase())
        )
      ];
      
      // Remove overall duplicates and limit total results
      const uniqueResults = combinedResults
        .filter((item, index, self) =>
          index === self.findIndex(t => 
            t.name.toLowerCase() === item.name.toLowerCase() && t.type === item.type
          )
        )
        .slice(0, 10); // Limit to 10 total results
      
      setSuggestions(uniqueResults);
    } catch (error) {
      console.error('Error performing search:', error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Debounced search function
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (searchData.destination.trim()) {
        performSearch(searchData.destination);
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms delay
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchData.destination]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !locationInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleInputChange = (field, value) => {
    setSearchData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // If check-in date is changed and check-out is before it, clear check-out
      if (field === 'checkIn' && prev.checkOut && value > prev.checkOut) {
        newData.checkOut = '';
      }
      
      return newData;
    });

    // Show suggestions when user types in destination field
    if (field === 'destination') {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchData(prev => ({
      ...prev,
      destination: suggestion.name
    }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleLocationInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Check if search requirements are met
  const isSearchValid = () => {
    return searchData.destination.trim() !== '' && searchData.guests !== '';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Check if required fields are filled
    if (!isSearchValid()) {
      alert('Please enter a destination or hotel name and select number of guests before searching.');
      return;
    }
    
    // Create URL search parameters
    const searchParams = new URLSearchParams();
    
    // Check if the search term matches any hotel exactly
    const matchedHotel = hotels.find(hotel => 
      hotel.title?.toLowerCase() === searchData.destination.toLowerCase().trim()
    );
    
    if (matchedHotel) {
      // If it's an exact hotel match, search by hotel ID or navigate directly
      searchParams.append('hotel', matchedHotel.title);
      searchParams.append('hotelId', matchedHotel.uuid || matchedHotel.id || matchedHotel.nid);
    } else {
      // Otherwise search by location/title
      searchParams.append('location', searchData.destination.trim());
    }
    
    // Add check-in and check-out dates if provided
    if (searchData.checkIn) {
      searchParams.append('checkIn', searchData.checkIn);
    }
    
    if (searchData.checkOut) {
      searchParams.append('checkOut', searchData.checkOut);
    }
    
    // Add guests information
    if (searchData.guests) {
      searchParams.append('guests', searchData.guests);
    }
    
    // Navigate to hotels page with search parameters
    const queryString = searchParams.toString();
    navigate(`/hotels?${queryString}`);
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
            <form className="banner-search-form" onSubmit={handleSearch}>
              <div className="search-field location-field">
                <Search size={20} />
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder="Search hotels or destinations..."
                  value={searchData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  onFocus={handleLocationInputFocus}
                  autoComplete="off"
                  required
                  className='banner-search-input'
                />
                <ChevronDown 
                  size={16} 
                  className={`dropdown-icon ${showSuggestions ? 'rotated' : ''}`}
                />
                
                {/* Combined Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="location-suggestions" ref={suggestionsRef}>
                    {isLoadingSuggestions ? (
                      <div className="suggestion-item loading">
                        <div className="loading-spinner"></div>
                        <span>Searching hotels and locations...</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((suggestion) => (
                        <div
                          key={`${suggestion.type}-${suggestion.id}`}
                          className={`suggestion-item ${suggestion.type}`}
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          {suggestion.type === 'hotel' ? (
                            <Building size={14} />
                          ) : (
                            <MapPin size={14} />
                          )}
                          <div className="suggestion-content">
                            <div className="suggestion-name">
                              {suggestion.displayText}
                              {suggestion.type === 'hotel' && suggestion.rating && (
                                <span className="hotel-rating">
                                  <Star size={12} fill="#FFD700" color="#FFD700" />
                                  {suggestion.rating}
                                </span>
                              )}
                            </div>
                            <div className={`suggestion-full ${suggestion.type}`}>
                              {suggestion.type === 'hotel' ? 'Hotel' : 'Location'} • {suggestion.secondaryText}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : searchData.destination.trim().length >= 2 ? (
                      <div className="suggestion-item no-results">
                        <span>No hotels or locations found for "{searchData.destination}"</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              
              <div className="search-field">
                <Calendar size={20} />
                <input
                  type="date"
                  placeholder="Check-in"
                  value={searchData.checkIn}
                  min={getTodayDate()}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                />
              </div>
              
              <div className="search-field">
                <Calendar size={20} />
                <input
                  type="date"
                  placeholder="Check-out"
                  value={searchData.checkOut}
                  min={searchData.checkIn || getTodayDate()}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                />
              </div>
              
              <div className="search-field">
                <Users size={20} />
                <select
                  value={searchData.guests}
                  onChange={(e) => handleInputChange('guests', e.target.value)}
                  required
                >
                  <option value="">Select guests</option>
                  <option value="1 guest">1 guest</option>
                  <option value="2 guests">2 guests</option>
                  <option value="3 guests">3 guests</option>
                  <option value="4 guests">4 guests</option>
                  <option value="5+ guests">5+ guests</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className={`banner-search-btn ${isSearchValid() ? 'active' : 'disabled'}`} 
                disabled={!isSearchValid()}
                style={!isSearchValid() ? { backgroundColor: '#00504B' } : {}}
              >
                <Search size={20} />
                Search
              </button>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;