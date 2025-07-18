import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, Clock as ClockIcon, ArrowLeft } from 'lucide-react';
import { isAuthenticated } from '../services/authService';
import bookingService from '../services/bookingService';
import './CSS/BookingHistory.css';

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/login', { 
        state: { from: '/booking-history' } 
      });
      return;
    }

    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const result = await bookingService.getUserBookings();
      setBookings(result.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setError('Failed to load booking history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} color="#28a745" />;
      case 'pending':
        return <ClockIcon size={16} color="#ffc107" />;
      case 'cancelled':
        return <XCircle size={16} color="#dc3545" />;
      default:
        return <ClockIcon size={16} color="#6c757d" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
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

  const formatPrice = (price) => {
    if (!price) return '₦0';
    const numericPrice = parseFloat(price);
    return `₦${numericPrice.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="booking-history-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your booking history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-history-container">
      <div className="booking-history-header">
        <button 
          className="back-button"
          onClick={() => navigate('/hotels')}
        >
          <ArrowLeft size={20} />
          Back to Hotels
        </button>
        <h1>My Booking History</h1>
        <p>View all your hotel bookings and their current status</p>
      </div>

      {error && (
        <div className="error-message-container">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={fetchBookings}
          >
            Try Again
          </button>
        </div>
      )}

      {bookings.length === 0 && !error ? (
        <div className="no-bookings">
          <div className="no-bookings-icon">
            <Calendar size={48} color="#6c757d" />
          </div>
          <h2>No Bookings Found</h2>
          <p>You haven't made any bookings yet. Start exploring hotels to make your first booking!</p>
          <button 
            className="explore-hotels-btn"
            onClick={() => navigate('/hotels')}
          >
            Explore Hotels
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-title">
                  <h3>{booking.attributes?.title || 'Hotel Booking'}</h3>
                  <div className="booking-status">
                    {getStatusIcon(booking.attributes?.field_booking_status)}
                    <span style={{ color: getStatusColor(booking.attributes?.field_booking_status) }}>
                      {booking.attributes?.field_booking_status || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="booking-id">
                  ID: {booking.id}
                </div>
              </div>

              <div className="booking-details">
                <div className="booking-info">
                  <div className="info-row">
                    <Calendar size={16} />
                    <span>
                      <strong>Check-in:</strong> {formatDate(booking.attributes?.field_check_in_date)}
                    </span>
                  </div>
                  <div className="info-row">
                    <Calendar size={16} />
                    <span>
                      <strong>Check-out:</strong> {formatDate(booking.attributes?.field_check_out_date)}
                    </span>
                  </div>
                  <div className="info-row">
                    <Users size={16} />
                    <span>
                      <strong>Guests:</strong> {booking.attributes?.field_number_of_guest || 1}
                    </span>
                  </div>
                  <div className="info-row">
                    <MapPin size={16} />
                    <span>
                      <strong>Total:</strong> {formatPrice(booking.attributes?.field_total_price)}
                    </span>
                  </div>
                </div>

                {booking.attributes?.field_special_requests && (
                  <div className="special-requests">
                    <strong>Special Requests:</strong>
                    <p>{booking.attributes.field_special_requests}</p>
                  </div>
                )}

                <div className="payment-status">
                  <strong>Payment Status:</strong>
                  <span 
                    className={`payment-status-badge ${booking.attributes?.field_payment_status}`}
                  >
                    {booking.attributes?.field_payment_status || 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="booking-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => {
                    // Navigate to booking details page (if implemented)
                    console.log('View booking details:', booking.id);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory; 