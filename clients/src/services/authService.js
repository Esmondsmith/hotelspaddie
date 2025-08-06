
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
        
//         // Store enhanced user profile immediately
//         localStorage.setItem('userProfile', JSON.stringify(data.user));
//         console.log('Stored user profile from login');
//       }
      
//       // Set user role based on user data - FIX: Check if roles is an array
//       if (data.user?.roles) {
//         let userRole = 'guest';
//         const roles = Array.isArray(data.user.roles) ? data.user.roles : Object.keys(data.user.roles);
        
//         if (roles.includes('administrator')) {
//           userRole = 'admin';
//         } else if (roles.includes('authenticated')) {
//           userRole = 'user';
//         }
        
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

// // New function to fetch complete user profile using /api/user-info endpoint
// export async function fetchUserProfile(userId) {
//   try {
//     const token = getAccessToken();
//     if (!token) {
//       console.log('No token available for profile fetch');
//       return null;
//     }

//     // Use the new /api/user-info endpoint
//     const response = await fetch('http://localhost:3001/api/user-info', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (response.ok) {
//       const result = await response.json();
//       if (result.success) {
//         const userProfile = result.user;
//         console.log('User profile data:', userProfile);
        
//         // Store enhanced user profile
//         localStorage.setItem('userProfile', JSON.stringify(userProfile));
//         console.log('Stored enhanced user profile');
        
//         return userProfile;
//       }
//     } else {
//       console.log('Failed to fetch user profile:', response.status);
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     return null;
//   }
// }

// // Function to get complete user profile
// export function getUserProfile() {
//   const profile = localStorage.getItem('userProfile');
//   return profile ? JSON.parse(profile) : null;
// }

// // Function to update user profile
// export async function updateUserProfile(profileData) {
//   try {
//     const token = getAccessToken();
//     const userProfile = getUserProfile();
    
//     if (!token || !userProfile) {
//       throw new Error('Not authenticated');
//     }

//     // Use the backend API instead of direct Drupal call
//     const response = await fetch(`http://localhost:3001/api/user/profile/${userProfile.uid}`, {
//       method: 'PATCH',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         firstName: profileData.firstName,
//         lastName: profileData.lastName,
//         phone: profileData.phone,
//         email: profileData.email
//       })
//     });

//     if (response.ok) {
//       const result = await response.json();
//       if (result.success) {
//         console.log('Profile updated successfully');
        
//         // Update local storage
//         const updatedProfile = {
//           ...userProfile,
//           firstName: profileData.firstName,
//           lastName: profileData.lastName,
//           phone: profileData.phone,
//           mail: profileData.email
//         };
        
//         localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
//         return { success: true, data: updatedProfile };
//       }
//     }
    
//     const error = await response.json();
//     throw new Error(error.message || 'Failed to update profile');
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     return { success: false, message: error.message };
//   }
// }

// // Function to upload profile picture
// export async function uploadProfilePicture(file) {
//   try {
//     const token = getAccessToken();
//     const userProfile = getUserProfile();
    
//     if (!token || !userProfile) {
//       throw new Error('Not authenticated');
//     }

//     // Create FormData for file upload
//     const formData = new FormData();
//     formData.append('file', file);

//     // Upload to your backend first, then handle Drupal integration
//     const uploadResponse = await fetch('http://localhost:3001/api/user/upload-picture', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       },
//       body: formData
//     });

//     if (uploadResponse.ok) {
//       const result = await uploadResponse.json();
//       if (result.success) {
//         // Update local storage
//         const updatedProfile = {
//           ...userProfile,
//           profilePicture: result.profilePicture
//         };
        
//         localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
//         return { success: true, data: updatedProfile };
//       }
//     }
    
//     const error = await uploadResponse.json();
//     throw new Error(error.message || 'Failed to upload profile picture');
//   } catch (error) {
//     console.error('Error uploading profile picture:', error);
//     return { success: false, message: error.message };
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
  
//   // Check if token is expired only for OAuth tokens (not session tokens)
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
const USER_INFO_URL = 'http://localhost:3001/api/user-info';
const PROFILE_UPDATE_URL = 'http://localhost:3001/api/user/profile';
const PROFILE_PICTURE_URL = 'http://localhost:3001/api/user/upload-picture';

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
          roles: data.user?.roles,
          timestamp: Date.now()
        }));
        localStorage.setItem('access_token', sessionToken);
        console.log('Stored session token (fallback)');
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Stored user data:', data.user);
        
        // Transform and store enhanced user profile immediately
        const enhancedProfile = transformUserProfile(data.user, data.data);
        localStorage.setItem('userProfile', JSON.stringify(enhancedProfile));
        localStorage.setItem('userProfileCacheTime', Date.now().toString());
        console.log('Stored enhanced user profile from login:', enhancedProfile);
      }
      
      // Set user role based on user data
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

// Helper function to transform user profile data
function transformUserProfile(user, rawData) {
  console.log('Transforming user profile:', { user, rawData });
  
  // Extract data from rawData if available (Drupal response)
  const drupalUser = rawData?.current_user || user;
  
  return {
    uid: drupalUser?.uid || user?.uid,
    name: drupalUser?.name || user?.name,
    mail: user?.mail || drupalUser?.mail,
    roles: drupalUser?.roles || user?.roles || [],
    
    // Personal information (may not be available immediately after login)
    field_first_name: user?.field_first_name || '',
    field_last_name: user?.field_last_name || '',
    field_phone_number: user?.field_phone_number || '',
    field_gender: user?.field_gender || '',
    field_nationality: user?.field_nationality || '',
    field_type_of_id: user?.field_type_of_id || '',
    field_id_number: user?.field_id_number || '',
    field_upload_id_scan_photo: user?.field_upload_id_scan_photo || '',
    
    // Metadata
    created: user?.created,
    updated: user?.changed || user?.updated,
    status: user?.status !== undefined ? user.status : true,
    
    // Profile completeness check
    isProfileComplete: !!(
      user?.field_first_name && 
      user?.field_last_name && 
      user?.field_phone_number
    )
  };
}

// Fetch user profile from backend API (proxies to Drupal)
export async function fetchUserProfile(userId) {
  try {
    const token = getAccessToken();
    if (!token) {
      console.log('No token available for profile fetch');
      return null;
    }

    console.log('Fetching user profile via backend API...');

    // Use your backend API endpoint
    const response = await fetch(USER_INFO_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Backend API response status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('Backend API response:', result);
      
      if (result.success && result.user) {
        const userProfile = transformBackendUserProfile(result.user);
        console.log('Transformed user profile data:', userProfile);
        
        // Store enhanced user profile
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('userProfileCacheTime', Date.now().toString());
        console.log('Stored enhanced user profile');
        
        return userProfile;
      } else {
        console.log('Backend API returned unsuccessful response:', result);
        return null;
      }
    } else {
      const errorText = await response.text();
      console.log('Failed to fetch user profile via backend:', response.status, errorText);
      
      // If backend fails with 401, try to refresh token and retry once
      if (response.status === 401) {
        console.log('Token might be expired, attempting refresh...');
        const newToken = await refreshToken();
        if (newToken) {
          console.log('Token refreshed, retrying profile fetch...');
          return fetchUserProfile(userId); // Retry with new token
        }
      }
      
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile via backend:', error);
    return null;
  }
}

// Transform backend user profile data
function transformBackendUserProfile(backendUser) {
  console.log('Transforming backend user profile:', backendUser);
  
  // Handle different response formats from your backend
  if (Array.isArray(backendUser) && backendUser.length > 0) {
    // Handle array response
    const userData = backendUser[0];
    return extractUserFields(userData);
  } else if (backendUser.data) {
    // Handle JSON API response
    return extractUserFields(backendUser.data);
  } else {
    // Handle direct user object
    return extractUserFields(backendUser);
  }
}

// Extract user fields from various response formats
function extractUserFields(userData) {
  console.log('Extracting user fields from:', userData);
  
  const attributes = userData.attributes || userData;
  
  return {
    uid: userData.id || attributes.drupal_internal__uid || attributes.uid,
    name: attributes.name || attributes.display_name,
    mail: attributes.mail,
    
    // Personal information
    field_first_name: getFieldValue(attributes.field_first_name),
    field_last_name: getFieldValue(attributes.field_last_name),
    field_phone_number: getFieldValue(attributes.field_phone_number || attributes.field_phone),
    field_gender: getFieldValue(attributes.field_gender),
    field_nationality: getFieldValue(attributes.field_nationality),
    field_type_of_id: getFieldValue(attributes.field_type_of_id),
    field_id_number: getFieldValue(attributes.field_id_number),
    field_upload_id_scan_photo: getFieldValue(attributes.field_upload_id_scan_photo),
    
    // Metadata
    roles: attributes.roles || [],
    created: attributes.created,
    updated: attributes.changed || attributes.updated,
    status: attributes.status !== undefined ? attributes.status : true,
    
    // Calculate profile completeness
    isProfileComplete: !!(
      getFieldValue(attributes.field_first_name) && 
      getFieldValue(attributes.field_last_name) && 
      getFieldValue(attributes.field_phone_number || attributes.field_phone)
    )
  };
}

// Get field value from Drupal field format
function getFieldValue(field) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (Array.isArray(field) && field.length > 0) {
    return field[0].value || field[0];
  }
  if (field.value !== undefined) return field.value;
  return '';
}

// Fetch complete user profile with caching
export async function fetchCompleteUserProfile() {
  try {
    console.log('Fetching complete user profile...');
    
    // First check localStorage
    const cachedProfile = getUserProfile();
    if (cachedProfile) {
      console.log('Found cached profile, checking if fresh...');
      
      // Check if cached data is recent (less than 5 minutes old)
      const cacheTime = localStorage.getItem('userProfileCacheTime');
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (cacheTime && (now - parseInt(cacheTime)) < fiveMinutes) {
        console.log('Using fresh cached profile');
        return cachedProfile;
      }
    }
    
    // Fetch fresh data from API
    console.log('Fetching fresh profile data from API...');
    const freshProfile = await fetchUserProfile();
    
    if (freshProfile) {
      return freshProfile;
    }
    
    // Fallback to cached data if API fails
    if (cachedProfile) {
      console.log('API failed, using cached profile as fallback');
      return cachedProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchCompleteUserProfile:', error);
    
    // Return cached data if available
    const fallbackProfile = getUserProfile();
    if (fallbackProfile) {
      console.log('Error occurred, using cached profile as fallback');
      return fallbackProfile;
    }
    
    return null;
  }
}

// Function to get complete user profile from localStorage
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

    console.log('Updating user profile via backend...', profileData);

    // Use your backend API
    const response = await fetch(`${PROFILE_UPDATE_URL}/${userProfile.uid}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        email: profileData.email,
        nationality: profileData.nationality,
        gender: profileData.gender,
        idType: profileData.idType,
        idNumber: profileData.idNumber
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Profile update response:', result);
      
      if (result.success) {
        console.log('Profile updated successfully via backend');
        
        // Update local storage with new data
        const updatedProfile = {
          ...userProfile,
          field_first_name: profileData.firstName,
          field_last_name: profileData.lastName,
          field_phone_number: profileData.phone,
          mail: profileData.email,
          field_nationality: profileData.nationality,
          field_gender: profileData.gender,
          field_type_of_id: profileData.idType,
          field_id_number: profileData.idNumber,
          isProfileComplete: !!(profileData.firstName && profileData.lastName && profileData.phone)
        };
        
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        localStorage.setItem('userProfileCacheTime', Date.now().toString());
        
        return { success: true, data: updatedProfile };
      }
    }
    
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  } catch (error) {
    console.error('Error updating profile via backend:', error);
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

    console.log('Uploading profile picture...');

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uid', userProfile.uid);

    // Upload to your backend
    const uploadResponse = await fetch(PROFILE_PICTURE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData
    });

    if (uploadResponse.ok) {
      const result = await uploadResponse.json();
      console.log('Profile picture upload response:', result);
      
      if (result.success) {
        // Update local storage
        const updatedProfile = {
          ...userProfile,
          field_upload_id_scan_photo: result.fileName || result.profilePicture,
          profilePictureUrl: result.profilePictureUrl || result.profilePicture
        };
        
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        localStorage.setItem('userProfileCacheTime', Date.now().toString());
        
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

// Function to refresh OAuth token
export async function refreshToken() {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    console.log('No refresh token available');
    return null;
  }

  try {
    console.log('Attempting to refresh token...');
    
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
    console.log('Token refresh response:', data);
    
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
    
    console.log('Token refresh failed - no access token in response');
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

// Function to get access token with expiry check
export function getAccessToken() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.log('No access token found');
    return null;
  }
  
  // Check if token is expired only for OAuth tokens (not session tokens)
  const expiryTime = localStorage.getItem('token_expiry');
  if (expiryTime && Date.now() > parseInt(expiryTime)) {
    console.log('Token expired, attempting refresh...');
    
    // Don't block - refresh in background and return current token
    refreshToken().then(newToken => {
      if (newToken) {
        console.log('Token refreshed successfully in background');
      } else {
        console.log('Token refresh failed, will need to logout');
        // Don't logout immediately - let the API call fail first
      }
    }).catch(err => {
      console.error('Background token refresh error:', err);
    });
  }
  
  return token;
}

// Function to get user role
export function getUserRole() {
  return localStorage.getItem('user_role') || 'guest';
}

// Function to check if user is authenticated
export function isAuthenticated() {
  const token = getAccessToken();
  const user = localStorage.getItem('user');
  return !!(token && user);
}

// Function to get authentication headers
export function getAuthHeaders() {
  const token = getAccessToken();
  console.log('Getting auth headers, token present:', !!token);
  console.log('Token type:', token ? (token.length > 50 ? 'OAuth' : 'Session') : 'None');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  console.log('Auth headers:', headers);
  return headers;
}

// Function to get current user basic info
export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Function to clear profile cache
export function clearUserProfileCache() {
  localStorage.removeItem('userProfile');
  localStorage.removeItem('userProfileCacheTime');
  console.log('User profile cache cleared');
}

// Function to clear all authentication data and logout
export function logout() {
  console.log('Logging out user...');
  
  // Clear all authentication and profile data
  clearUserProfileCache();
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expiry');
  localStorage.removeItem('user');
  localStorage.removeItem('user_role');
  
  // Clear any other app-specific data
  localStorage.clear();
  
  // Redirect to login
  window.location.href = '/login';
}

// Function to handle API errors globally
export function handleApiError(error, response) {
  console.error('API Error:', error);
  
  if (response && response.status === 401) {
    console.log('Unauthorized - clearing auth data and redirecting to login');
    logout();
    return;
  }
  
  // Handle other errors as needed
  return error;
}

// Function to make authenticated API calls
export async function makeAuthenticatedRequest(url, options = {}) {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      console.log('Received 401, attempting token refresh...');
      const newToken = await refreshToken();
      
      if (newToken) {
        // Retry with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, {
          ...options,
          headers
        });
        
        if (!retryResponse.ok && retryResponse.status === 401) {
          logout();
          throw new Error('Authentication failed');
        }
        
        return retryResponse;
      } else {
        logout();
        throw new Error('Authentication failed');
      }
    }
    
    return response;
  } catch (error) {
    console.error('Authenticated request error:', error);
    throw error;
  }
}

// Function to validate token on app startup
export async function validateToken() {
  try {
    const token = getAccessToken();
    if (!token) {
      return false;
    }
    
    // Try to fetch user profile to validate token
    const profile = await fetchUserProfile();
    return !!profile;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

// Export all functions for use in components
export default {
  login,
  logout,
  refreshToken,
  getAccessToken,
  getUserProfile,
  fetchUserProfile,
  fetchCompleteUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  getCurrentUser,
  getUserRole,
  isAuthenticated,
  getAuthHeaders,
  clearUserProfileCache,
  handleApiError,
  makeAuthenticatedRequest,
  validateToken
};