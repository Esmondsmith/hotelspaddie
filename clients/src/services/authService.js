// const API_URL = 'http://localhost:3001/api/login';

// export async function login(username, password) {
//   try {
//     console.log('Attempting login with:', { username, password: '***' });
//     console.log('Login URL:', API_URL);
    
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, password })
//     });

//     console.log('Login response status:', response.status);
//     console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

//     const data = await response.json();
//     console.log('Login response data:', data);

//     if (!response.ok) {
//       throw new Error(data.message || 'Invalid credentials');
//     }

//     // Store user data and tokens
//     if (data.success) {
//       // Store the real OAuth access token if available
//       if (data.access_token) {
//         localStorage.setItem('access_token', data.access_token);
//         console.log('Stored OAuth access token');
        
//         // Store refresh token if available
//         if (data.refresh_token) {
//           localStorage.setItem('refresh_token', data.refresh_token);
//           console.log('Stored refresh token');
//         }
        
//         // Store token expiry info
//         if (data.expires_in) {
//           const expiryTime = Date.now() + (data.expires_in * 1000);
//           localStorage.setItem('token_expiry', expiryTime.toString());
//           console.log('Stored token expiry:', new Date(expiryTime));
//         }
//       } else {
//         // Fallback to session token if OAuth token not available
//         const sessionToken = btoa(JSON.stringify({
//           uid: data.user?.uid,
//           name: data.user?.name,
//           timestamp: Date.now()
//         }));
//         localStorage.setItem('access_token', sessionToken);
//         console.log('Stored session token (fallback)');
//       }
      
//       if (data.user) {
//         localStorage.setItem('user', JSON.stringify(data.user));
//         console.log('Stored user data');
//       }
      
//       // Set user role based on user data
//       if (data.user?.roles) {
//         const roles = Object.keys(data.user.roles);
//         const userRole = roles.includes('administrator') ? 'admin' : 
//                         roles.includes('authenticated') ? 'user' : 'guest';
//         localStorage.setItem('user_role', userRole);
//         console.log('Stored user_role:', userRole);
//       }
//     }

//     return { success: true, data };
//   } catch (err) {
//     console.error('Login error:', err);
//     return { success: false, message: err.message };
//   }
// }

// export function logout() {
//   localStorage.clear();
//   window.location.href = '/login';
// }

// export async function refreshToken() {
//   const refresh_token = localStorage.getItem('refresh_token');
//   if (!refresh_token) return null;

//   try {
//     const response = await fetch('https://zodr.zodml.org/oauth/token', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: new URLSearchParams({
//         grant_type: 'refresh_token',
//         refresh_token,
//         client_id: 'testman',
//         client_secret: 'Tigers3me.$'
//       }),
//     });

//     const data = await response.json();
//     if (data.access_token) {
//       localStorage.setItem('access_token', data.access_token);
      
//       // Update refresh token if provided
//       if (data.refresh_token) {
//         localStorage.setItem('refresh_token', data.refresh_token);
//       }
      
//       // Update expiry time
//       if (data.expires_in) {
//         const expiryTime = Date.now() + (data.expires_in * 1000);
//         localStorage.setItem('token_expiry', expiryTime.toString());
//       }
      
//       console.log('Token refreshed successfully');
//       return data.access_token;
//     }
//     return null;
//   } catch (error) {
//     console.error('Token refresh failed:', error);
//     return null;
//   }
// }

// export function getAccessToken() {
//   const token = localStorage.getItem('access_token');
  
//   // Check if token is expired
//   const expiryTime = localStorage.getItem('token_expiry');
//   if (expiryTime && Date.now() > parseInt(expiryTime)) {
//     console.log('Token expired, attempting refresh...');
//     // Token is expired, try to refresh it
//     refreshToken().then(newToken => {
//       if (newToken) {
//         console.log('Token refreshed successfully');
//       } else {
//         console.log('Token refresh failed, logging out');
//         logout();
//       }
//     });
//   }
  
//   return token;
// }

// export function getUserRole() {
//   return localStorage.getItem('user_role');
// }

// export function isAuthenticated() {
//   return !!getAccessToken();
// }

// export function getAuthHeaders() {
//   const token = getAccessToken();
//   console.log('Getting auth headers, token present:', !!token);
//   console.log('Token type:', token ? (token.length > 50 ? 'OAuth' : 'Session') : 'None');
  
//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': token ? `Bearer ${token}` : ''
//   };
  
//   console.log('Auth headers:', headers);
//   return headers;
// } 



const API_URL = 'http://localhost:3001/api/login';

export async function login(username, password) {
  try {
    console.log('Attempting login with:', { username, password: '***' });
    console.log('Login URL:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    console.log('Login response status:', response.status);
    console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('Login response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Invalid credentials');
    }

    // Store user data and tokens
    if (data.success) {
      // Store the real OAuth access token if available
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        console.log('Stored OAuth access token');
        
        // Store refresh token if available
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
          console.log('Stored refresh token');
        }
        
        // Store token expiry info
        if (data.expires_in) {
          const expiryTime = Date.now() + (data.expires_in * 1000);
          localStorage.setItem('token_expiry', expiryTime.toString());
          console.log('Stored token expiry:', new Date(expiryTime));
        }
      } else {
        // Fallback to session token if OAuth token not available
        const sessionToken = btoa(JSON.stringify({
          uid: data.user?.uid,
          name: data.user?.name,
          timestamp: Date.now()
        }));
        localStorage.setItem('access_token', sessionToken);
        console.log('Stored session token (fallback)');
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Stored user data');
        
        // Store enhanced user profile immediately
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        console.log('Stored user profile from login');
      }
      
      // Set user role based on user data - FIX: Check if roles is an array
      if (data.user?.roles) {
        let userRole = 'guest';
        const roles = Array.isArray(data.user.roles) ? data.user.roles : Object.keys(data.user.roles);
        
        if (roles.includes('administrator')) {
          userRole = 'admin';
        } else if (roles.includes('authenticated')) {
          userRole = 'user';
        }
        
        localStorage.setItem('user_role', userRole);
        console.log('Stored user_role:', userRole);
      }
    }

    return { success: true, data };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, message: err.message };
  }
}

// New function to fetch complete user profile
export async function fetchUserProfile(userId) {
  try {
    const token = getAccessToken();
    if (!token || !userId) {
      console.log('No token or user ID available for profile fetch');
      return null;
    }
  // Use the backend API instead of direct Drupal call
    const response = await fetch(`http://localhost:3001/api/user/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        const userProfile = result.user;
        console.log('User profile data:', userProfile);
        
        // Store enhanced user profile
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        console.log('Stored enhanced user profile');
        
        return userProfile;
      }
    } else {
      console.log('Failed to fetch user profile:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Function to get complete user profile
export function getUserProfile() {
  const profile = localStorage.getItem('userProfile');
  return profile ? JSON.parse(profile) : null;
}

// Function to update user profile
export async function updateUserProfile(profileData) {
  try {
    const token = getAccessToken();
    const userProfile = getUserProfile();
    
    if (!token || !userProfile) {
      throw new Error('Not authenticated');
    }

    // Use the backend API instead of direct Drupal call
    const response = await fetch(`http://localhost:3001/api/user/profile/${userProfile.uid}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        email: profileData.email
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        console.log('Profile updated successfully');
        
        // Update local storage
        const updatedProfile = {
          ...userProfile,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          mail: profileData.email
        };
        
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        return { success: true, data: updatedProfile };
      }
    }
    
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: error.message };
  }
}

// Function to upload profile picture
export async function uploadProfilePicture(file) {
  try {
    const token = getAccessToken();
    const userProfile = getUserProfile();
    
    if (!token || !userProfile) {
      throw new Error('Not authenticated');
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);

    // Upload to your backend first, then handle Drupal integration
    const uploadResponse = await fetch('http://localhost:3001/api/user/upload-picture', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (uploadResponse.ok) {
      const result = await uploadResponse.json();
      if (result.success) {
        // Update local storage
        const updatedProfile = {
          ...userProfile,
          profilePicture: result.profilePicture
        };
        
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        return { success: true, data: updatedProfile };
      }
    }
    
    const error = await uploadResponse.json();
    throw new Error(error.message || 'Failed to upload profile picture');
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return { success: false, message: error.message };
  }
}

export function logout() {
  localStorage.clear();
  window.location.href = '/login';
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) return null;

  try {
    const response = await fetch('https://zodr.zodml.org/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        client_id: 'testman',
        client_secret: 'Tigers3me.$'
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      
      // Update refresh token if provided
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      
      // Update expiry time
      if (data.expires_in) {
        const expiryTime = Date.now() + (data.expires_in * 1000);
        localStorage.setItem('token_expiry', expiryTime.toString());
      }
      
      console.log('Token refreshed successfully');
      return data.access_token;
    }
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

export function getAccessToken() {
  const token = localStorage.getItem('access_token');
  
  // Check if token is expired only for OAuth tokens (not session tokens)
  const expiryTime = localStorage.getItem('token_expiry');
  if (expiryTime && Date.now() > parseInt(expiryTime)) {
    console.log('Token expired, attempting refresh...');
    // Token is expired, try to refresh it
    refreshToken().then(newToken => {
      if (newToken) {
        console.log('Token refreshed successfully');
      } else {
        console.log('Token refresh failed, logging out');
        logout();
      }
    });
  }
  
  return token;
}

export function getUserRole() {
  return localStorage.getItem('user_role');
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function getAuthHeaders() {
  const token = getAccessToken();
  console.log('Getting auth headers, token present:', !!token);
  console.log('Token type:', token ? (token.length > 50 ? 'OAuth' : 'Session') : 'None');
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
  
  console.log('Auth headers:', headers);
  return headers;
}