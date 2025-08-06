import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, Calendar, Users, ArrowLeft } from "lucide-react";
import "./CSS/BookingSummary.css";
import Navbar from "../Components/Navbar/Navbar";
// import { bookingService } from "../Services/bookingService";
import bookingService from '../services/bookingService';

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get data from navigation state
  const { hotel, selectedRooms, totalPrice } = location.state || {};

  useEffect(() => {
    // If no booking data, redirect back to hotels
    if (!hotel || !selectedRooms || selectedRooms.length === 0) {
      navigate('/hotels');
    }

    // Check if user is authenticated (you can modify this based on your auth system)
    checkAuthStatus();
  }, [hotel, selectedRooms, navigate]);

  const checkAuthStatus = () => {
    // Check for authentication - modify this based on your auth implementation
    const token = localStorage.getItem('authToken') || 
                  localStorage.getItem('token') || 
                  sessionStorage.getItem('authToken') ||
                  sessionStorage.getItem('token');
    
    const user = localStorage.getItem('user') || 
                 sessionStorage.getItem('user');
    
    // You can also check for other auth indicators like cookies, Redux state, etc.
    setIsAuthenticated(!!(token || user));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const getFirstImage = (mediaString) => {
    if (!mediaString) return '';
    return mediaString.split(', ')[0].trim();
  };

  const formatAmenities = (amenities) => {
    if (!amenities) return '';
    return amenities.split(' , ').join(' • ');
  };

  const calculateNights = () => {
    if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) return 1;
    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nights > 0 ? nights : 1;
  };

  const getTotalBookingPrice = () => {
    const nights = calculateNights();
    return totalPrice * nights;
  };

  const handleInputChange = (field, value) => {
    setBookingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookNow = async () => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      // Store current booking data in sessionStorage so user can continue after login
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        hotel,
        selectedRooms,
        totalPrice,
        bookingDetails
      }));
      
      // Redirect to login page
      navigate('/login', {
        state: {
          from: '/booking-summary',
          message: 'Please log in to complete your booking'
        }
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
        setError("Please select check-in and check-out dates");
        setLoading(false);
        return;
      }

      if (new Date(bookingDetails.checkInDate) >= new Date(bookingDetails.checkOutDate)) {
        setError("Check-out date must be after check-in date");
        setLoading(false);
        return;
      }

      // Prepare booking data for multiple rooms
      const nights = calculateNights();
      const finalTotalPrice = getTotalBookingPrice();

      // Create booking title with room details
      const roomSummary = selectedRooms.map(({ room, quantity }) => 
        `${quantity}x ${room.title || room.field_room_category || 'Room'}`
      ).join(', ');

      const bookingData = {
        title: `${hotel.title} - ${roomSummary}`,
        field_check_in_date: bookingDetails.checkInDate,
        field_check_out_date: bookingDetails.checkOutDate,
        field_number_of_guest: parseInt(bookingDetails.numberOfGuests),
        field_total_price: finalTotalPrice.toFixed(2),
        field_booking_status: "pending",
        field_payment_status: "unpaid",
        field_special_requests: bookingDetails.specialRequests,
        // Additional data for multiple rooms
        hotel_id: hotel.nid || hotel.uuid || hotel.id,
        hotel_name: hotel.title,
        rooms: selectedRooms.map(({ room, quantity, totalPrice }) => ({
          room_id: room.uuid || room.id,
          room_title: room.title,
          room_category: room.field_room_category,
          quantity: quantity,
          price_per_night: totalPrice / quantity,
          total_room_price: totalPrice
        })),
        nights: nights
      };

      console.log('Booking data to be sent:', bookingData);

      const response = await bookingService.createBooking(bookingData);
      
      if (response.success) {
        // Clear any pending booking data
        sessionStorage.removeItem('pendingBooking');
        
        // Navigate to payment page with booking details
        navigate('/payment', {
          state: {
            booking: response.booking,
            bookingId: response.booking_id,
            hotel,
            selectedRooms,
            bookingDetails,
            totalPrice: finalTotalPrice,
            nights
          }
        });
      } else {
        setError(response.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking creation error:", error);
      setError(error.message || "An error occurred while creating the booking");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!hotel || !selectedRooms) {
    return (
      <div className="booking-summary-error">
        <h2>No booking data found</h2>
        <button onClick={() => navigate('/hotels')}>Back to Hotels</button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="booking-summary-page">
        <div className="booking-summary-header">
          <button className="back-btn" onClick={handleGoBack}>
            <ArrowLeft size={20} />
            Back to Hotel
          </button>
          <h1>Booking Summary</h1>
        </div>

        <div className="booking-summary-content">
          {/* Authentication Notice */}
          {!isAuthenticated && (
            <div className="auth-notice">
              <p>You need to be logged in to complete your booking. Click "Book Now" to sign in.</p>
            </div>
          )}

          {/* Hotel Information */}
          <div className="hotel-info-card">
            <img 
              className="hotel-summary-img" 
              src={getFirstImage(hotel.field_media)} 
              alt={hotel.title} 
            />
            <div className="hotel-summary-details">
              <h2>{hotel.title}</h2>
              <div className="hotel-rating">
                <Star size={16} fill="#FFD700" color="#FFD700" />
                <span>{hotel.field_rating}</span>
                <span className="reviews-count">(316 reviews)</span>
              </div>
              <div className="hotel-amenities">{hotel.field_amenities}</div>
            </div>
          </div>

          <div className="booking-summary-grid">
            {/* Selected Rooms */}
            <div className="selected-rooms-section">
              <h3>Selected Rooms</h3>
              <div className="selected-rooms-list">
                {selectedRooms.map(({ room, quantity, totalPrice }, index) => (
                  <div key={room.uuid || room.id || index} className="selected-room-item">
                    <img 
                      className="room-summary-img" 
                      src={getFirstImage(room.field_media) || getFirstImage(hotel.field_media)} 
                      alt={room.title || hotel.title} 
                    />
                    <div className="room-summary-details">
                      <h4>{room.title || "Room"}</h4>
                      <div className="room-category">
                        Category: {room.field_room_category || "Not specified"}
                      </div>
                      <div className="room-meta">
                        <span>Capacity: {room.field_capacity || "Not specified"} guests</span>
                        <span>Size: {room.field_room_size || "Not specified"}</span>
                      </div>
                      {room.field_room_amenities && (
                        <div className="room-amenities">
                          Amenities: {formatAmenities(room.field_room_amenities)}
                        </div>
                      )}
                      <div className="room-quantity-price">
                        <span className="quantity">Quantity: {quantity}</span>
                        <span className="price">{formatPrice(totalPrice)} /night</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Details Form */}
            <div className="booking-details-section">
              <h3>Booking Details</h3>
              <div className="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="checkIn">
                      <Calendar size={16} />
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      value={bookingDetails.checkInDate}
                      onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkOut">
                      <Calendar size={16} />
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      value={bookingDetails.checkOutDate}
                      onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                      min={bookingDetails.checkInDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="guests">
                    <Users size={16} />
                    Number of Guests
                  </label>
                  <select
                    id="guests"
                    value={bookingDetails.numberOfGuests}
                    onChange={(e) => handleInputChange('numberOfGuests', e.target.value)}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} Guest{i > 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="requests">Special Requests (Optional)</label>
                  <textarea
                    id="requests"
                    rows="3"
                    placeholder="Any special requests or preferences?"
                    value={bookingDetails.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="price-summary-section">
            <h3>Price Summary</h3>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Rooms per night:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="price-row">
                <span>Number of nights:</span>
                <span>{calculateNights()}</span>
              </div>
              <div className="price-row total">
                <span><strong>Total Amount:</strong></span>
                <span><strong>{formatPrice(getTotalBookingPrice())}</strong></span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="booking-error">
              {error}
            </div>
          )}

          {/* Book Now Button */}
          <div className="booking-actions">
            <button
              className="book-now-btn"
              onClick={handleBookNow}
              disabled={loading}
            >
              {loading ? "Creating Booking..." : isAuthenticated ? "Proceed To Payment" : "Sign In to Complete Booking"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingSummary;

