import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X, 
  Camera,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Navbar from '../Components/Navbar/Navbar';
import { 
  fetchCompleteUserProfile, 
  updateUserProfile, 
  uploadProfilePicture, 
  logout,
  isAuthenticated 
} from '../services/authService';
import './CSS/UserProfilePage.css';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    console.log('UserProfile component mounted');
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      console.log('Loading user profile...');
      setLoading(true);
      setError('');

      // Check if user is authenticated
      if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting to login');
        navigate('/login', { state: { from: '/user-profile' } });
        return;
      }

      const profileData = await fetchCompleteUserProfile();
      console.log('Profile data received:', profileData);

      if (profileData) {
        setUser(profileData);
        setEditData({
          firstName: profileData.field_first_name || '',
          lastName: profileData.field_last_name || '',
          phone: profileData.field_phone_number || '',
          email: profileData.mail || '',
          nationality: profileData.field_nationality || '',
          gender: profileData.field_gender || '',
          idType: profileData.field_type_of_id || '',
          idNumber: profileData.field_id_number || ''
        });
        console.log('User profile loaded successfully');
      } else {
        setError('Failed to load user profile. Please try logging in again.');
        console.error('No profile data received');
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('An error occurred while loading your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    console.log('Entering edit mode');
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCancelEdit = () => {
    console.log('Canceling edit mode');
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
    // Reset edit data to current user data
    setEditData({
      firstName: user?.field_first_name || '',
      lastName: user?.field_last_name || '',
      phone: user?.field_phone_number || '',
      email: user?.mail || '',
      nationality: user?.field_nationality || '',
      gender: user?.field_gender || '',
      idType: user?.field_type_of_id || '',
      idNumber: user?.field_id_number || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving profile changes:', editData);
      setSaving(true);
      setError('');
      setSuccessMessage('');

      // Basic validation
      if (!editData.firstName.trim() || !editData.lastName.trim()) {
        setError('First name and last name are required');
        return;
      }

      if (!editData.email.trim()) {
        setError('Email is required');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      const result = await updateUserProfile(editData);
      
      if (result.success) {
        console.log('Profile updated successfully');
        setUser(result.data);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('An error occurred while saving your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      console.log('Uploading profile picture:', file.name);
      setError('');
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      const result = await uploadProfilePicture(file);
      
      if (result.success) {
        console.log('Profile picture uploaded successfully');
        setUser(result.data);
        setSuccessMessage('Profile picture updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(result.message || 'Failed to upload profile picture');
      }
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError('An error occurred while uploading your profile picture. Please try again.');
    }
  };

  const handleLogout = () => {
    console.log('Logging out user');
    logout();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString * 1000).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName || '';
    const last = lastName || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading your profile...</h3>
          <p>Please wait while we fetch your information.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="error-container">
          <div className="error-message">
            <AlertCircle size={48} color="#e53e3e" />
            <h3>Profile Not Found</h3>
            <p>We couldn't load your profile information. Please try logging in again.</p>
            <button 
              onClick={() => navigate('/login')} 
              className="btn-primary"
              style={{ marginTop: '16px' }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Navbar />
      
      <div className="profile-content">
        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <AlertCircle size={20} style={{ marginRight: '8px' }} />
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #c3e6cb',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={20} />
            {successMessage}
          </div>
        )}

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user.profilePictureUrl || user.field_upload_id_scan_photo ? (
                  <img 
                    src={user.profilePictureUrl || user.field_upload_id_scan_photo} 
                    alt="Profile" 
                    className="profile-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<User size={48} />`;
                    }}
                  />
                ) : (
                  <div style={{ 
                    fontSize: '48px', 
                    fontWeight: 'bold', 
                    color: '#718096' 
                  }}>
                    {getInitials(user.field_first_name, user.field_last_name)}
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profilePictureInput"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                style={{ display: 'none' }}
              />
              <button
                className="avatar-edit-btn"
                onClick={() => document.getElementById('profilePictureInput').click()}
                title="Change profile picture"
              >
                <Camera size={16} />
              </button>
            </div>

            <div className="profile-info">
              <h1 className="profile-name">
                {user.field_first_name && user.field_last_name 
                  ? `${user.field_first_name} ${user.field_last_name}`
                  : user.name || 'User Profile'
                }
              </h1>
              <p className="profile-username">@{user.name}</p>
              <p className="profile-status">
                Status: <span className={user.status ? 'status-active' : 'status-inactive'}>
                  {user.status ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <>
                  <button onClick={handleEdit} className="btn-primary">
                    <Edit size={16} />
                    Edit Profile
                  </button>
                  <button onClick={handleLogout} className="btn-outline">
                    Logout
                  </button>
                </>
              ) : (
                <div className="edit-actions">
                  <button 
                    onClick={handleSave} 
                    className="btn-primary"
                    disabled={isSaving}
                  >
                    <Save size={16} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={handleCancelEdit} 
                    className="btn-secondary"
                    disabled={isSaving}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="details-grid">
            {/* Personal Information */}
            <div className="detail-section">
              <h3 className="section-title">
                <User size={20} />
                Personal Information
              </h3>
              <div className="detail-items">
                <div className="detail-item">
                  <label>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Enter first name"
                    />
                  ) : (
                    <span>{user.field_first_name || 'Not specified'}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Enter last name"
                    />
                  ) : (
                    <span>{user.field_last_name || 'Not specified'}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editData.gender}
                      onChange={handleInputChange}
                      className="edit-input"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <span>{user.field_gender || 'Not specified'}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Nationality</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nationality"
                      value={editData.nationality}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Enter nationality"
                    />
                  ) : (
                    <span>{user.field_nationality || 'Not specified'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="detail-section">
              <h3 className="section-title">
                <Mail size={20} />
                Contact Information
              </h3>
              <div className="detail-items">
                <div className="detail-item">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Enter email address"
                    />
                  ) : (
                    <span>{user.mail || 'Not specified'}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <span>{user.field_phone_number || 'Not specified'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Identification */}
            <div className="detail-section">
              <h3 className="section-title">
                <FileText size={20} />
                Identification
              </h3>
              <div className="detail-items">
                <div className="detail-item">
                  <label>ID Type</label>
                  {isEditing ? (
                    <select
                      name="idType"
                      value={editData.idType}
                      onChange={handleInputChange}
                      className="edit-input"
                    >
                      <option value="">Select ID type</option>
                      <option value="passport">Passport</option>
                      <option value="national_id">National ID</option>
                      <option value="drivers_license">Driver's License</option>
                    </select>
                  ) : (
                    <span>{user.field_type_of_id || 'Not specified'}</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>ID Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="idNumber"
                      value={editData.idNumber}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Enter ID number"
                    />
                  ) : (
                    <span>{user.field_id_number || 'Not specified'}</span>
                  )}
                </div>
                {user.field_upload_id_scan_photo && (
                  <div className="detail-item">
                    <label>ID Document</label>
                    <div className="id-document">
                      <FileText size={16} />
                      <span>Document uploaded</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="detail-section">
              <h3 className="section-title">
                <Shield size={20} />
                Account Information
              </h3>
              <div className="detail-items">
                <div className="detail-item">
                  <label>User ID</label>
                  <span>{user.uid || 'Not available'}</span>
                </div>
                <div className="detail-item">
                  <label>Username</label>
                  <span>{user.name || 'Not available'}</span>
                </div>
                <div className="detail-item">
                  <label>User Roles</label>
                  <span>
                    {Array.isArray(user.roles) 
                      ? user.roles.join(', ') 
                      : (typeof user.roles === 'object' 
                          ? Object.keys(user.roles).join(', ') 
                          : 'User')
                    }
                  </span>
                </div>
                <div className="detail-item">
                  <label>Member Since</label>
                  <span>{formatDate(user.created)}</span>
                </div>
                <div className="detail-item">
                  <label>Last Updated</label>
                  <span>{formatDate(user.updated)}</span>
                </div>
                <div className="detail-item">
                  <label>Profile Status</label>
                  <span>
                    {user.isProfileComplete ? (
                      <span style={{ color: '#48bb78' }}>Complete</span>
                    ) : (
                      <span style={{ color: '#f56565' }}>Incomplete - Please fill in missing information</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;






// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Calendar, 
//   CreditCard, 
//   FileText, 
//   Edit3, 
//   LogOut, 
//   Camera,
//   Save,
//   X
// } from 'lucide-react';
// import Navbar from '../Components/Navbar/Navbar';
// import { 
//   getUserProfile, 
//   fetchUserProfile, 
//   updateUserProfile, 
//   uploadProfilePicture, 
//   logout, 
//   isAuthenticated,
//   getAccessToken 
// } from '../services/authService';
// import './CSS/UserProfilePage.css';

// const UserProfilePage = () => {
//   const navigate = useNavigate();
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [editFormData, setEditFormData] = useState({});

//   useEffect(() => {
//     // Check if user is authenticated
//     if (!isAuthenticated()) {
//       navigate('/login');
//       return;
//     }

//     loadUserProfile();
//   }, [navigate]);

//   const loadUserProfile = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       // First try to get from localStorage
//       let profile = getUserProfile();

//       if (!profile) {
//         // If not in localStorage, fetch from API
//         console.log('Fetching fresh user profile from API...');
//         profile = await fetchUserProfileFromAPI();
//       }

//       if (profile) {
//         setUserProfile(profile);
//         setEditFormData({
//           firstName: profile.field_first_name || '',
//           lastName: profile.field_last_name || '',
//           email: profile.mail || '',
//           phone: profile.field_phone_number || '',
//           nationality: profile.field_nationality || '',
//           gender: profile.field_gender || '',
//           idType: profile.field_type_of_id || '',
//           idNumber: profile.field_id_number || ''
//         });
//       } else {
//         setError('Failed to load user profile. Please try logging in again.');
//       }
//     } catch (err) {
//       console.error('Error loading user profile:', err);
//       setError('An error occurred while loading your profile.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserProfileFromAPI = async () => {
//     try {
//       const token = getAccessToken();
//       if (!token) {
//         throw new Error('No access token available');
//       }

//       const response = await fetch('https://zodr.zodml.org/api/user-info', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const profileData = await response.json();
//         console.log('Fetched user profile:', profileData);
        
//         // Store in localStorage for future use
//         localStorage.setItem('userProfile', JSON.stringify(profileData));
        
//         return profileData;
//       } else {
//         console.error('Failed to fetch user profile:', response.status);
//         return null;
//       }
//     } catch (error) {
//       console.error('Error fetching user profile from API:', error);
//       return null;
//     }
//   };

//   const handleInputChange = (e) => {
//     setEditFormData({
//       ...editFormData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSaveProfile = async () => {
//     try {
//       setIsUpdating(true);
//       setError('');

//       const result = await updateUserProfile(editFormData);
      
//       if (result.success) {
//         setUserProfile(result.data);
//         setIsEditing(false);
//         // Optionally show success message
//         console.log('Profile updated successfully');
//       } else {
//         setError(result.message || 'Failed to update profile');
//       }
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       setError('An error occurred while updating your profile.');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="profile-container">
//         <Navbar />
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !userProfile) {
//     return (
//       <div className="profile-container">
//         <Navbar />
//         <div className="error-container">
//           <div className="error-message">
//             <h3>Error Loading Profile</h3>
//             <p>{error}</p>
//             <button onClick={() => navigate('/login')} className="btn-primary">
//               Go to Login
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-container">
//       <Navbar />
      
//       <div className="profile-content">
//         <div className="profile-header">
//           <div className="profile-header-content">
//             <div className="profile-avatar">
//               <div className="avatar-circle">
//                 {userProfile?.field_upload_id_scan_photo ? (
//                   <img 
//                     src={`https://zodr.zodml.org/sites/default/files/${userProfile.field_upload_id_scan_photo}`} 
//                     alt="Profile" 
//                     className="profile-image"
//                   />
//                 ) : (
//                   <User size={48} />
//                 )}
//               </div>
//               <button className="avatar-edit-btn" title="Change Photo">
//                 <Camera size={16} />
//               </button>
//             </div>
            
//             <div className="profile-info">
//               <h1 className="profile-name">
//                 {userProfile?.field_first_name} {userProfile?.field_last_name}
//               </h1>
//               <p className="profile-username">@{userProfile?.name}</p>
//               <p className="profile-status">
//                 Status: <span className={userProfile?.status === '1' ? 'status-active' : 'status-inactive'}>
//                   {userProfile?.status === '1' ? 'Active' : 'Inactive'}
//                 </span>
//               </p>
//             </div>
            
//             <div className="profile-actions">
//               {!isEditing ? (
//                 <button 
//                   onClick={() => setIsEditing(true)} 
//                   className="btn-secondary"
//                 >
//                   <Edit3 size={16} />
//                   Edit Profile
//                 </button>
//               ) : (
//                 <div className="edit-actions">
//                   <button 
//                     onClick={handleSaveProfile}
//                     disabled={isUpdating}
//                     className="btn-primary"
//                   >
//                     <Save size={16} />
//                     {isUpdating ? 'Saving...' : 'Save'}
//                   </button>
//                   <button 
//                     onClick={() => {
//                       setIsEditing(false);
//                       setError('');
//                     }}
//                     className="btn-outline"
//                   >
//                     <X size={16} />
//                     Cancel
//                   </button>
//                 </div>
//               )}
              
//               <button onClick={handleLogout} className="btn-danger">
//                 <LogOut size={16} />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="error-banner">
//             {error}
//           </div>
//         )}

//         <div className="profile-details">
//           <div className="details-grid">
//             {/* Personal Information */}
//             <div className="detail-section">
//               <h3 className="section-title">
//                 <User size={20} />
//                 Personal Information
//               </h3>
              
//               <div className="detail-items">
//                 <div className="detail-item">
//                   <label>First Name</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={editFormData.firstName}
//                       onChange={handleInputChange}
//                       className="edit-input"
//                     />
//                   ) : (
//                     <span>{userProfile?.field_first_name || 'N/A'}</span>
//                   )}
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Last Name</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={editFormData.lastName}
//                       onChange={handleInputChange}
//                       className="edit-input"
//                     />
//                   ) : (
//                     <span>{userProfile?.field_last_name || 'N/A'}</span>
//                   )}
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Gender</label>
//                   {isEditing ? (
//                     <select
//                       name="gender"
//                       value={editFormData.gender}
//                       onChange={handleInputChange}
//                       className="edit-input"
//                     >
//                       <option value="">Select Gender</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                       <option value="other">Other</option>
//                     </select>
//                   ) : (
//                     <span>{userProfile?.field_gender || 'N/A'}</span>
//                   )}
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Nationality</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="nationality"
//                       value={editFormData.nationality}
//                       onChange={handleInputChange}
//                       className="edit-input"
//                     />
//                   ) : (
//                     <span>{userProfile?.field_nationality || 'N/A'}</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="detail-section">
//               <h3 className="section-title">
//                 <Mail size={20} />
//                 Contact Information
//               </h3>
              
//               <div className="detail-items">
//                 <div className="detail-item">
//                   <label>Email</label>
//                   {isEditing ? (
//                     <input
//                       type="email"
//                       name="email"
//                       value={editFormData.email}
//                       onChange={handleInputChange}
//                       className="edit-input"
//                     />
//                   ) : (
//                     <span>{userProfile?.mail || 'N/A'}</span>
//                   )}
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Phone Number</label>
//                   {isEditing ? (
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={editFormData.phone}
//                       onChange={handleInputChange}
//                       className="edit-input"
//                     />
//                   ) : (
//                     <span>{userProfile?.field_phone_number || 'N/A'}</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Identification */}
//             <div className="detail-section">
//               <h3 className="section-title">
//                 <CreditCard size={20} />
//                 Identification
//               </h3>
              
//               <div className="detail-items">
//                 <div className="detail-item">
//                   <label>ID Type</label>
//                   {isEditing ? (
//                     <select
//                       name="idType"
//                       value={editFormData.idType}
//                       onChange={handleInputChange}
//                       className="edit-input"
//                     >
//                       <option value="">Select ID Type</option>
//                       <option value="International Passport">International Passport</option>
//                       <option value="National ID">National ID</option>
//                       <option value="Driver's License">Driver's License</option>
//                       <option value="Voter's Card">Voter's Card</option>
//                     </select>
//                   ) : (
//                     <span>{userProfile?.field_type_of_id || 'N/A'}</span>
//                   )}
//                 </div>
                
//                 <div className="detail-item">
//                   <label>ID Number</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="idNumber"
//                       value={editFormData.idNumber}
//                       onChange={handleInputChange}
//                       className="edit-input"
//                     />
//                   ) : (
//                     <span>{userProfile?.field_id_number || 'N/A'}</span>
//                   )}
//                 </div>
                
//                 {userProfile?.field_upload_id_scan_photo && (
//                   <div className="detail-item">
//                     <label>ID Document</label>
//                     <span className="id-document">
//                       <FileText size={16} />
//                       {userProfile.field_upload_id_scan_photo}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Account Information */}
//             <div className="detail-section">
//               <h3 className="section-title">
//                 <Calendar size={20} />
//                 Account Information
//               </h3>
              
//               <div className="detail-items">
//                 <div className="detail-item">
//                   <label>User ID</label>
//                   <span>{userProfile?.uid || 'N/A'}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Account Created</label>
//                   <span>{formatDate(userProfile?.created)}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Last Login</label>
//                   <span>{formatDate(userProfile?.login)}</span>
//                 </div>
                
//                 <div className="detail-item">
//                   <label>Last Access</label>
//                   <span>{formatDate(userProfile?.access)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;


