import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, CreditCard, CheckCircle, ArrowLeft, Eye, Star, Wifi, Car, Coffee, Utensils, Phone, Mail, MapPinIcon } from 'lucide-react';
import './CSS/BookingPage.css';
import { isAuthenticated } from '../services/authService';
import bookingService from '../services/bookingService';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get hotel and room data from navigation state
  const { hotel, room } = location.state || {};

  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
    hotelId: hotel?.uuid || hotel?.nid || '',
    roomId: room?.uuid || room?.nid || '',
    totalPrice: '₦0'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otherRooms, setOtherRooms] = useState([]);
  const [loadingOtherRooms, setLoadingOtherRooms] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    // If no hotel or room data, redirect back
    if (!hotel || !room) {
      console.error('No hotel or room data found');
      navigate('/');
      return;
    }

    // Check authentication after ensuring we have booking data
    if (!isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login', { 
        state: { 
          from: '/booking',
          hotel: hotel,
          room: room 
        } 
      });
      return;
    }

    // User is authenticated and has booking data, proceed with booking
    console.log('User authenticated, proceeding with booking');
    
    // Check if user just returned from login (by checking if we have location state)
    if (location.state && location.state.from === '/login') {
      console.log('User returned from login, showing welcome message');
      setShowWelcomeMessage(true);
      // Hide welcome message after 3 seconds
      setTimeout(() => setShowWelcomeMessage(false), 3000);
    }
    
    fetchOtherRooms();
  }, [hotel, room, navigate, location.state]);

  // Fetch other rooms for the same hotel
  const fetchOtherRooms = async () => {
    if (!hotel?.nid) return;
    setLoadingOtherRooms(true);
    try {
      const roomsRes = await fetch(`http://localhost:3001/api/hotel-rooms?nid=${hotel.nid}`);
      const hotelRoomsData = await roomsRes.json();
      
      let roomsArray = [];
      if (Array.isArray(hotelRoomsData)) {
        roomsArray = hotelRoomsData;
      } else if (hotelRoomsData && Array.isArray(hotelRoomsData.data)) {
        roomsArray = hotelRoomsData.data;
      } else if (hotelRoomsData && Array.isArray(hotelRoomsData.rooms)) {
        roomsArray = hotelRoomsData.rooms;
      }
      
      // Filter out the current room
      const filteredRooms = roomsArray.filter(r => 
        (r.uuid || r.nid) !== (room.uuid || room.nid)
      );
      
      setOtherRooms(filteredRooms.slice(0, 3)); // Show max 3 other rooms
    } catch (error) {
      console.error('Error fetching other rooms:', error);
    } finally {
      setLoadingOtherRooms(false);
    }
  };

  // Get price per night from room data
  const getPricePerNight = () => {
    if (room?.field_price_per_night) {
      // Extract numeric value from price string (handles commas)
      const priceMatch = room.field_price_per_night.match(/[\d,]+/);
      return priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
    }
    return 0;
  };

  const pricePerNight = getPricePerNight();
  const formattedPricePerNight = room?.field_price_per_night || '₦0';

  // Calculate total price when dates or guests change
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate && pricePerNight > 0) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const total = nights * pricePerNight;
      // Format total price with naira symbol and commas
      const formattedTotal = `₦${total.toLocaleString()}`;
      setFormData(prev => ({ ...prev, totalPrice: formattedTotal }));
    }
  }, [formData.checkInDate, formData.checkOutDate, pricePerNight]);

  // Get first image from media string
  const getFirstImage = (mediaString) => {
    if (!mediaString) return '';
    return mediaString.split(', ')[0].trim();
  };

  // Format amenities
  const formatAmenities = (amenities) => {
    if (!amenities) return [];
    return amenities.split(' , ').map(item => item.trim());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear booking error when user makes changes
    if (bookingError) {
      setBookingError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.checkInDate) newErrors.checkInDate = 'Check-in date is required';
    if (!formData.checkOutDate) newErrors.checkOutDate = 'Check-out date is required';
    if (formData.numberOfGuests < 1) newErrors.numberOfGuests = 'At least 1 guest is required';
    
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkIn < today) {
        newErrors.checkInDate = 'Check-in date cannot be in the past';
      }
      
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'Check-out date must be after check-in date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    // Check authentication before proceeding
    if (!isAuthenticated()) {
      console.error('User not authenticated when trying to book');
      setBookingError('Please login to continue with your booking.');
      return;
    }
    
    console.log('User is authenticated, proceeding with booking...');
    
    setIsLoading(true);
    setBookingError('');
    
    try {
      // Prepare booking data for API
      const bookingData = {
        title: `Booking for ${room.title || 'Room'} at ${hotel.title}`,
        field_check_in_date: formData.checkInDate,
        field_check_out_date: formData.checkOutDate,
        field_number_of_guest: parseInt(formData.numberOfGuests),
        field_total_price: formData.totalPrice.replace('₦', '').replace(/,/g, ''),
        field_booking_status: "pending",
        field_payment_status: "unpaid",
        field_special_requests: formData.specialRequests,
        field_hotel_id: hotel.uuid || hotel.nid,
        field_room_id: room.uuid || room.nid
      };
      
      console.log('Creating booking with data:', bookingData);
      
      // Create booking using the API
      const result = await bookingService.createBooking(bookingData);
      
      console.log('Booking created successfully:', result);
      
      // Store the created booking for payment processing
      setCreatedBooking(result.booking);
      
      // Simulate payment processing
      try {
        console.log('Processing payment...');
        await bookingService.processPayment(result.booking_id, {});
        
        // Payment successful
        setBookingSuccess(true);
        setIsLoading(false);
      } catch (paymentError) {
        console.error('Payment failed:', paymentError);
        setBookingError('Booking created but payment failed. Please contact support.');
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Booking failed:', error);
      setBookingError(error.message || 'Failed to create booking. Please try again.');
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle viewing other rooms
  const handleViewOtherRoom = (otherRoom) => {
    navigate('/booking', { 
      state: { 
        hotel: hotel,
        room: otherRoom 
      } 
    });
  };

  // Handle back to all rooms
  const handleBackToRooms = () => {
    navigate(`/listing/${hotel.uuid || hotel.nid || hotel.title?.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`);
  };

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  // If no data, show loading or redirect
  if (!hotel || !room) {
    return (
      <div className="booking-container">
        <div className="booking-error">
          <h2>No booking data found</h2>
          <p>Please select a room from the hotel listing page.</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="booking-container">
        <div className="success-message">
          <CheckCircle className="success-icon" />
          <h2>Booking Confirmed!</h2>
          <p>Your booking has been successfully created and payment processed.</p>
          <div className="booking-summary">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> {createdBooking?.id || 'N/A'}</p>
            <p><strong>Hotel:</strong> {hotel.title}</p>
            <p><strong>Room:</strong> {room.title || 'Selected Room'}</p>
            <p><strong>Check-in:</strong> {formatDate(formData.checkInDate)}</p>
            <p><strong>Check-out:</strong> {formatDate(formData.checkOutDate)}</p>
            <p><strong>Guests:</strong> {formData.numberOfGuests}</p>
            <p><strong>Total:</strong> {formData.totalPrice}</p>
            <p><strong>Status:</strong> <span style={{color: 'green', fontWeight: 'bold'}}>Confirmed & Paid</span></p>
          </div>
          <button className='booking-complete-back-btn' onClick={() => navigate('/hotels')}>Back to Hotels</button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <button 
          className="back-button"
          onClick={handleBackToRooms}
        >
          <ArrowLeft size={20} />
          Back to Rooms
        </button>
        <h1>Complete Your Booking</h1>
        <p>You're just one step away from your perfect stay</p>
        
        {/* Welcome message when returning from login */}
        {showWelcomeMessage && (
          <div className="welcome-message" style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '12px 20px',
            borderRadius: '8px',
            marginTop: '15px',
            border: '1px solid #c3e6cb',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}>
            <CheckCircle size={16} />
            Welcome back! You can now continue with your booking for {hotel.title}
          </div>
        )}
      </div>

      <div className="booking-content">
        <div className="booking-left-sidebar">
          <div className="hotel-info-card">
            <img 
              src={getFirstImage(room.field_media) || getFirstImage(hotel.field_media)} 
              alt={room.title || hotel.title}
              className="room-image"
            />
            <div className="hotel-details">
              <h2>{hotel.title}</h2>
              <div className='hotel-room-price'>
                <h3>{room.title || 'Selected Room'}</h3>
                <span className="price">{formattedPricePerNight}</span> 
              </div>
              
              <div className="room-meta">
                <p><strong>Category:</strong> {room.field_room_category || 'Not specified'}</p>
                <p><strong>Capacity:</strong> {room.field_capacity || 'Not specified'} guests</p>
                <p><strong>Room Size:</strong> {room.field_room_size || 'Not specified'}</p>
              </div>
              {room.field_room_amenities && (
                <div className="amenities">
                  <strong>Amenities:</strong>
                  {formatAmenities(room.field_room_amenities).map((amenity, index) => (
                    <span key={index} className="amenity-tag">{amenity}</span>
                  ))}
                </div>
              )}
              <div className="price-per-night">
                <span className="price">{formattedPricePerNight}</span>
                <span className="per-night">per night</span>
              </div>
            </div>
          </div>

          {/* Other Rooms Section */}
          <div className="other-rooms-card hotel-info-card">
            <h3>Other Rooms Available</h3>
            {loadingOtherRooms ? (
              <div className="loading-other-rooms">Loading other rooms...</div>
            ) : otherRooms.length > 0 ? (
              <div className="other-rooms-list">
                {otherRooms.map((otherRoom, index) => (
                  <div key={otherRoom.uuid || index} className="other-room-item">
                    <img 
                      src={getFirstImage(otherRoom.field_media) || getFirstImage(hotel.field_media)} 
                      alt={otherRoom.title}
                      className="other-room-image"
                    />
                    <div className="other-room-info">
                      <h4>{otherRoom.title || 'Room'}</h4>
                      <p className="other-room-category">{otherRoom.field_room_category || 'Standard'}</p>
                      <p className="other-room-price">{otherRoom.field_price_per_night || 'Price on request'}</p>
                      <button 
                        className="view-room-btn"
                        onClick={() => handleViewOtherRoom(otherRoom)}
                      >
                        View Room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-other-rooms">No other rooms available</p>
            )}
          </div>

          {/* Hotel Information Card */}
          <div className="hotel-info-extra-card hotel-info-card">
            <h3>
              <MapPinIcon size={20} />
              Hotel Information
            </h3>
            <div className="hotel-extra-info">
              <div className="hotel-rating">
                <Star size={16} fill="#FFD700" color="#FFD700" />
                <span>{hotel.field_rating || 'Not rated'}</span>
                <span className="review-count">(316 reviews)</span>
              </div>
              
              {hotel.field_amenities && (
                <div className="hotel-amenities">
                  <h4>Hotel Amenities</h4>
                  <div className="amenity-icons">
                    {hotel.field_amenities.includes('WiFi') && <Wifi size={16} title="WiFi" />}
                    {hotel.field_amenities.includes('Parking') && <Car size={16} title="Parking" />}
                    {hotel.field_amenities.includes('Restaurant') && <Utensils size={16} title="Restaurant" />}
                    {hotel.field_amenities.includes('Coffee') && <Coffee size={16} title="Coffee" />}
                  </div>
                  <p className="amenities-text">{hotel.field_amenities}</p>
                </div>
              )}
              
              <div className="hotel-contact hotel-info-card">
                <h4>Contact Information</h4>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+234 (0) 123 456 7890</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} />
                  <span>info@{hotel.title?.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="quick-actions-card hotel-info-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button 
                className="quick-action-btn"
                onClick={handleBackToRooms}
              >
                <Eye size={16} />
                View All Rooms
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => navigate('/hotels')}
              >
                <ArrowLeft size={16} />
                Back to Search
              </button>
            </div>
          </div>
        </div>

        <div className="booking-form-container">
          <div className={`booking-form ${showWelcomeMessage ? 'highlight-form' : ''}`}>
            <div className="form-section">
              <h3><Calendar className="section-icon" /> Select Dates</h3>
              <div className="date-inputs">
                <div className="input-group">
                  <label htmlFor="checkInDate">Check-in Date</label>
                  <input
                    type="date"
                    id="checkInDate"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    className={errors.checkInDate ? 'error' : ''}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.checkInDate && <span className="error-message">{errors.checkInDate}</span>}
                </div>
                
                <div className="input-group">
                  <label htmlFor="checkOutDate">Check-out Date</label>
                  <input
                    type="date"
                    id="checkOutDate"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    className={errors.checkOutDate ? 'error' : ''}
                    min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                  />
                  {errors.checkOutDate && <span className="error-message">{errors.checkOutDate}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3><Users className="section-icon" /> Guest Information</h3>
              <div className="input-group">
                <label htmlFor="numberOfGuests">Number of Guests</label>
                <select
                  id="numberOfGuests"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  className={errors.numberOfGuests ? 'error' : ''}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.numberOfGuests && <span className="error-message">{errors.numberOfGuests}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3><MapPin className="section-icon" /> Special Requests</h3>
              <div className="input-group">
                <label htmlFor="specialRequests">Special Requests (Optional)</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requests or preferences..."
                  rows="3"
                />
              </div>
            </div>

            <div className="booking-summary-card">
              <h3>Booking Summary</h3>
              {formData.checkInDate && formData.checkOutDate && (
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Check-in:</span>
                    <span>{formatDate(formData.checkInDate)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Check-out:</span>
                    <span>{formatDate(formData.checkOutDate)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Nights:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Guests:</span>
                    <span>{formData.numberOfGuests}</span>
                  </div>
                  <div className="summary-row">
                    <span>Rate per night:</span>
                    <span>{formattedPricePerNight}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount:</span>
                    <span>{formData.totalPrice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Error message display */}
            {bookingError && (
              <div className="error-message-container">
                <p className="error-message">{bookingError}</p>
              </div>
            )}

            <button 
              type="button" 
              className="book-now-btn"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <CreditCard className="btn-icon" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;