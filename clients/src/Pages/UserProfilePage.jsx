import React, { useState } from 'react';
import './CSS/UserProfilePage.css'; // Assuming you have a CSS file for styling
import { useNavigate } from 'react-router-dom';


const UserProfile = () => {
  const [user] = useState({
    name: "John Smith",
    email: "john.anderson@email.com",
    phone: "+1 (555) 123-4567",
    memberSince: "January 2024",
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwgT2eHovk83Kd0D870HAoiPDi4IQLN9jQjg&s",
    stats: {
      totalStays: 8,
      reviews: 3,
      favorites: 2
    }
  });

  const [bookings] = useState([
    {
      id: 1,
      hotelName: "Grand Plaza Hotel",
      status: "confirmed",
      checkIn: "Dec 15, 2024",
      checkOut: "Dec 18, 2024",
      roomType: "Deluxe Suite",
      guests: "2 Adults",
      total: "$450.00"
    },
    {
      id: 2,
      hotelName: "Oceanview Resort",
      status: "pending",
      checkIn: "Jan 22, 2025",
      checkOut: "Jan 25, 2025",
      roomType: "Standard Room",
      guests: "1 Adult",
      total: "$320.00"
    },
    {
      id: 3,
      hotelName: "Mountain Lodge",
      status: "completed",
      checkIn: "Nov 10, 2024",
      checkOut: "Nov 13, 2024",
      roomType: "Cabin Suite",
      guests: "4 Adults",
      total: "$680.00"
    }
  ]);

  const navigate = useNavigate();

  // const handleLogout = () => {
  //   alert('Logging out...');
  //   // Add logout logic here
  // };

  const handleLogout = () => {
    // Clear user session/token
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    // Redirect to login page
    //window.location.href = '/login';
    navigate('/login');
  };

  const handleViewDetails = (bookingId) => {
    alert(`Viewing details for booking ${bookingId}`);
    // Add navigation logic here
  };

  const handleModify = (bookingId) => {
    alert(`Modifying booking ${bookingId}`);
    // Add modification logic here
  };

  const handleCancel = (bookingId) => {
    alert(`Canceling booking ${bookingId}`);
    // Add cancellation logic here
  };

  const handleWriteReview = (bookingId) => {
    alert(`Writing review for booking ${bookingId}`);
    // Add review logic here
  };

  const handleBookAgain = (bookingId) => {
    alert(`Booking again for booking ${bookingId}`);
    // Add booking logic here
  };

  const exploreHotels = () => {
    alert('Redirecting to hotel search...');
    // Add navigation logic here
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderBookingActions = (booking) => {
    switch (booking.status) {
      case 'confirmed':
        return (
          <>
            <button className="btn btn-primary" onClick={() => handleViewDetails(booking.id)}>
              View Details
            </button>
            <button className="btn btn-secondary" onClick={() => handleModify(booking.id)}>
              Modify
            </button>
          </>
        );
      case 'pending':
        return (
          <>
            <button className="btn btn-primary" onClick={() => handleViewDetails(booking.id)}>
              View Details
            </button>
            <button className="btn btn-secondary" onClick={() => handleCancel(booking.id)}>
              Cancel
            </button>
          </>
        );
      case 'completed':
        return (
          <>
            <button className="btn btn-primary" onClick={() => handleWriteReview(booking.id)}>
              Write Review
            </button>
            <button className="btn btn-secondary" onClick={() => handleBookAgain(booking.id)}>
              Book Again
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-app">
      <header className="header">
        <div className="header-content">
          <div className="logo">HotelsPaddie</div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        {/* Profile Section */}
        <div className="profile-section">
          <img 
            src={user.profileImage} 
            alt="Profile Picture" 
            className="profile-image"
          />
          <div className="profile-info">
            <h1>Welcome {user.name}</h1>
            <p>Member since {user.memberSince}</p>
            <p>📧 {user.email}</p>
            <p>📞 {user.phone}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">{user.stats.totalStays}</div>
                <div className="stat-label">Total Stays</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{user.stats.reviews}</div>
                <div className="stat-label">Reviews</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{user.stats.favorites}</div>
                <div className="stat-label">Favorites</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <h2 className="section-title">My Bookings</h2>
        
        {bookings.length > 0 ? (
          <div className="activity-grid">
            {bookings.map((booking) => (
              <div key={booking.id} className="activity-card">
                <div className="activity-header">
                  <div className="activity-title">{booking.hotelName}</div>
                  <div className={`activity-status ${getStatusClass(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </div>
                </div>
                <div className="activity-details">
                  <div><strong>Check-in:</strong> {booking.checkIn}</div>
                  <div><strong>Check-out:</strong> {booking.checkOut}</div>
                  <div><strong>Room:</strong> {booking.roomType}</div>
                  <div><strong>Guests:</strong> {booking.guests}</div>
                  <div><strong>Total:</strong> {booking.total}</div>
                </div>
                <div className="activity-actions">
                  {renderBookingActions(booking)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🏨</div>
            <h3>No bookings yet</h3>
            <p>Start exploring amazing hotels and make your first reservation!</p>
            <button className="btn-explore" onClick={exploreHotels}>
              Explore Hotels
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;