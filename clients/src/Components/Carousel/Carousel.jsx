import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Wifi, Car, Coffee, Waves } from 'lucide-react';
import './Carousel.css'


const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Sample room data
  const rooms = [
    {
      id: 1,
      name: "Deluxe Ocean View Suite",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop",
      price: "$299",
      rating: 4.8,
      amenities: ["Ocean View", "WiFi", "Room Service", "Balcony"],
      description: "Spacious suite with breathtaking ocean views and modern amenities."
    },
    {
      id: 2,
      name: "Executive Business Room",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop",
      price: "$189",
      rating: 4.6,
      amenities: ["Work Desk", "WiFi", "Coffee Machine", "City View"],
      description: "Perfect for business travelers with dedicated workspace and premium amenities."
    },
    {
      id: 3,
      name: "Romantic Honeymoon Suite",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
      price: "$399",
      rating: 4.9,
      amenities: ["Jacuzzi", "Champagne", "Rose Petals", "Private Terrace"],
      description: "Intimate suite designed for couples with luxury amenities and romantic ambiance."
    },
    {
      id: 4,
      name: "Family Comfort Room",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
      price: "$249",
      rating: 4.7,
      amenities: ["Twin Beds", "Kids Zone", "WiFi", "Mini Fridge"],
      description: "Spacious family room with separate sleeping areas and child-friendly amenities."
    },
    {
      id: 5,
      name: "Presidential Penthouse",
      image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&h=400&fit=crop",
      price: "$799",
      rating: 5.0,
      amenities: ["Butler Service", "Private Pool", "Helicopter Pad", "Panoramic View"],
      description: "Ultimate luxury experience with exclusive amenities and unparalleled service."
    },
    {
      id: 6,
      name: "Cozy Standard Room",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      price: "$129",
      rating: 4.4,
      amenities: ["WiFi", "Air Conditioning", "Room Service", "Garden View"],
      description: "Comfortable and affordable room with all essential amenities for a pleasant stay."
    }
  ];

  

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % rooms.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, rooms.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % rooms.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="room-carousel-section">
      <div className="container">
        <div className="section-header">
          <h2>Our Premium Rooms</h2>
          <p>Discover comfort and luxury in our carefully designed accommodations</p>
        </div>

        <div 
          className="carousel-container"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="carousel-wrapper">
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {rooms.map((room) => (
                <div key={room.id} className="carousel-slide">
                  <div className="room-card">
                    <div className="room-image">
                      <img src={room.image} alt={room.name} />
                      <div className="room-price">{room.price}/night</div>
                    </div>
                    <div className="room-content">
                      <div className="room-header">
                        <h3>{room.name}</h3>
                        <div className="room-rating">
                          <Star className="star-icon" />
                          <span>{room.rating}</span>
                        </div>
                      </div>
                      <p className="room-description">{room.description}</p>
                      <div className="room-amenities">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="amenity-tag">{amenity}</span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="amenity-more">+{room.amenities.length - 3} more</span>
                        )}
                      </div>
                      <button className="book-now-btn">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button className="carousel-btn prev-btn" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-btn next-btn" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {rooms.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;