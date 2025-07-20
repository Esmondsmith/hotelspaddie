import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, Edit2, Camera, Save, X, Upload } from 'lucide-react';
import Navbar from '../Components/Navbar/Navbar';
import './CSS/UserProfilePage.css';
import { getUserProfile, updateUserProfile, uploadProfilePicture, logout, fetchUserProfile } from '../services/authService';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // First check if user is authenticated
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login', {
            state: { from: '/user-profile' }
          });
          return;
        }

        // Try to get profile from localStorage first
        let profile = getUserProfile();
        const basicUser = localStorage.getItem('user');
        
        console.log('Profile from localStorage:', profile);
        console.log('Basic user from localStorage:', basicUser);
        
        // Always try to fetch fresh user info from the API
        try {
          const freshProfile = await fetchUserProfile();
          if (freshProfile) {
            profile = freshProfile;
            console.log('Fresh profile fetched from API:', profile);
          }
        } catch (apiError) {
          console.error('Error fetching fresh profile:', apiError);
          
          // Fallback to localStorage data
          if (!profile && basicUser) {
            try {
              const user = JSON.parse(basicUser);
              profile = user;
            } catch (parseError) {
              console.error('Error parsing user data:', parseError);
            }
          }
        }

        if (!profile) {
          navigate('/login', {
            state: { from: '/user-profile' }
          });
          return;
        }
        console.log('Final profile data:', profile);
        setUserProfile(profile);
        
        // Set form data with proper fallbacks
        setEditForm({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.mail || profile.email || '',
          phone: profile.phone || ''
        });
        
      } catch (error) {
        console.error('Error loading user profile:', error);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateUserProfile(editForm);
      
      if (result.success) {
        setUserProfile(result.data);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      setError('An error occurred while updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Check authentication before upload
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Not authenticated. Please log in again.');
      return;
    }

    setIsUploadingPhoto(true);
    setError('');

    try {
      const result = await uploadProfilePicture(file);
      
      if (result.success) {
        setUserProfile(result.data);
        setSuccess('Profile picture updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      setError('An error occurred while uploading the image');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="profile-loading">Loading profile...</div>
        </div>
      </>
    );
  }

  if (!userProfile) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="profile-error">Unable to load profile. Please try logging in again.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-picture-section">
            <div className="profile-picture-container">
              {userProfile.profilePicture ? (
                <img 
                  src={userProfile.profilePicture} 
                  alt="Profile" 
                  className="profile-picture"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  <User size={40} />
                </div>
              )}
              
              <div className="profile-picture-overlay">
                <label htmlFor="profile-photo-upload" className="upload-button">
                  {isUploadingPhoto ? (
                    <div className="upload-spinner">⟳</div>
                  ) : (
                    <Camera size={20} />
                  )}
                </label>
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                  disabled={isUploadingPhoto}
                />
              </div>
            </div>
          </div>

          <div className="profile-info">
            <h1>
              {userProfile.firstName && userProfile.lastName 
                ? `${userProfile.firstName} ${userProfile.lastName}`
                : userProfile.displayName || userProfile.name || 'User Profile'
              }
            </h1>
            <p className="profile-username">@{userProfile.name || 'username'}</p>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button onClick={handleEditToggle} className="edit-button">
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button onClick={handleSaveProfile} className="save-button" disabled={isSaving}>
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleEditToggle} className="cancel-button">
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
            <strong>Debug Info:</strong>
            <pre>{JSON.stringify(userProfile, null, 2)}</pre>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* Profile Details */}
        <div className="profile-details">
          <div className="profile-card">
            <h2>Personal Information</h2>
            
            <div className="profile-fields">
              <div className="field-group">
                <label>
                  <User size={16} />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="Enter first name"
                  />
                ) : (
                  <div className="field-value">
                    {userProfile.firstName || 'Not provided'}
                  </div>
                )}
              </div>

              <div className="field-group">
                <label>
                  <User size={16} />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="Enter last name"
                  />
                ) : (
                  <div className="field-value">
                    {userProfile.lastName || 'Not provided'}
                  </div>
                )}
              </div>

              <div className="field-group">
                <label>
                  <Mail size={16} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="Enter email address"
                  />
                ) : (
                  <div className="field-value">
                    {userProfile.mail || userProfile.email || 'Not provided'}
                  </div>
                )}
              </div>

              <div className="field-group">
                <label>
                  <Phone size={16} />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="field-value">
                    {userProfile.phone || 'Not provided'}
                  </div>
                )}
              </div>

              <div className="field-group">
                <label>
                  <User size={16} />
                  Username
                </label>
                <div className="field-value readonly">
                  {userProfile.name || 'Not provided'}
                </div>
              </div>

              <div className="field-group">
                <label>
                  <User size={16} />
                  User ID
                </label>
                <div className="field-value readonly">
                  {userProfile.uid || 'Not provided'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="profile-footer">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;