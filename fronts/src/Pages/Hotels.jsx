import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, MapPin, Star, Download, Apple, Play, Loader } from 'lucide-react';
import './CSS/Hotels.css'
import Navbar from '../Components/Navbar/Navbar';


const Hotels = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2 guests'
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch hotels from API
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/hotels', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch hotels');
      }

      const data = await response.json();
      console.log('Hotels data:', data);
      
      // Transform API data to match our UI structure
      const transformedHotels = transformHotelsData(data);
      setHotels(transformedHotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError(error.message);
      // Fallback to mock data if API fails
      setHotels(getFallbackHotels());
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to match our UI structure
  const transformHotelsData = (apiData) => {
    // If API returns an array, use it directly
    if (Array.isArray(apiData)) {
      return apiData.map((hotel, index) => ({
        id: hotel.id || index + 1,
        name: hotel.name || hotel.title || `Hotel ${index + 1}`,
        location: hotel.location || hotel.address || hotel.city || 'Location not specified',
        price: hotel.price ? `$${hotel.price}` : '$199',
        rating: hotel.rating || hotel.stars || 4.5,
        image: hotel.image || hotel.photo || getDefaultHotelImage(index),
        description: hotel.description || hotel.summary || '',
        amenities: hotel.amenities || []
      }));
    }
    
    // If API returns an object with data property
    if (apiData.data && Array.isArray(apiData.data)) {
      return transformHotelsData(apiData.data);
    }
    
    // Fallback to mock data
    return getFallbackHotels();
  };

  // Get default hotel images for fallback
  const getDefaultHotelImage = (index) => {
    const defaultImages = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop"
    ];
    return defaultImages[index % defaultImages.length];
  };

  // Fallback hotels data
  const getFallbackHotels = () => [
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

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="loading-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#666'
    }}>
      <Loader className="animate-spin" size={24} style={{ marginRight: '10px' }} />
      Loading hotels...
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="error-container" style={{
      textAlign: 'center',
      padding: '40px',
      color: '#dc2626',
      backgroundColor: '#fee2e2',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <p>Failed to load hotels. Showing sample data instead.</p>
      <button 
        onClick={fetchHotels}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="landing-page">
        <Navbar />
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

export default Hotels