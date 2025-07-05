import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import './CSS/UserProfilePage.css';
import profile_pic from '../Components/Assets/phone.jpeg'; // Replace with actual path to profile picture

const UserProfilePage = () => {
  
  // Mock user data - Replace with actual data fetched from API or context
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+123 456 7890',
    role: 'Hotel Guest'
  };

  const handleLogout = () => {
    console.log('User logged out');
    // Add your logout logic (clear token, redirect to login)
    window.location.href = '/';
  };

  return (
    <div className="profile-container">
      <Navbar />

      <div className="profile-content">
        <div className="profile-card">
          
          <div className="profile-image-section">
            <img src={profile_pic} alt="Profile" className="profile-pic" />
          </div>

          <h2 className="profile-name">{user.name}</h2>
          
          <div className="profile-details">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
