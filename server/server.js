
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Make sure you've installed node-fetch: npm install node-fetch
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/Register', async (req, res) => {
  try {
    console.log('Received registration request:', JSON.stringify(req.body, null, 2));

    // API to register users
    const response = await fetch('https://zodr.zodml.org/entity/user?_format=json', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic dGVzdG1hbjpUaWdlcnMzbWUuJA==',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    console.log('External API response status:', response.status);
    console.log('External API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const text = await response.text();
      console.error('Zodr API Error!', text);
      return res.status(response.status).json({error:'Registration failed!', details: text});
    }

    const data = await response.json();
    console.log('External API success response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({error:'Server Error!', details: error.toString()});
  }
});


// Endpoint for user login
// This method uses the working Drupal user login method
app.post('/api/login', async (req, res) => {
  try {
    console.log('Received login request:', JSON.stringify(req.body, null, 2));

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Username and password are required' 
      });
    }

    // First, verify user credentials with Drupal user login
    try {
      const drupalResponse = await fetch('https://zodr.zodml.org/user/login?_format=json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          name: username, 
          pass: password 
        })
      });
      
      if (!drupalResponse.ok) {
        const errorDetails = await drupalResponse.text();
        console.log('Drupal login method failed:', errorDetails);
        return res.status(401).json({ 
          success: false,
          error: 'Login failed!', 
          message: 'Invalid credentials',
          details: errorDetails
        });
      }

      const drupalData = await drupalResponse.json();
      console.log('Drupal login successful, now getting OAuth token...');
      
      // If Drupal login successful, get OAuth access token
      try {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'password');
        formData.append('username', username);
        formData.append('password', password);
        formData.append('client_id', 'testman');
        formData.append('client_secret', 'Tigers3me.$');

        const oauthResponse = await fetch('https://zodr.zodml.org/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: formData.toString()
        });

        if (oauthResponse.ok) {
          const oauthData = await oauthResponse.json();
          console.log('OAuth token obtained successfully');
          
          // Extract user info from the Drupal response
          const userInfo = {
            uid: drupalData.current_user?.uid,
            name: drupalData.current_user?.name,
            roles: drupalData.current_user?.roles || [],
            csrf_token: drupalData.csrf_token,
            logout_token: drupalData.logout_token
          };
          
          return res.json({
            success: true,
            message: 'Login successful',
            user: userInfo,
            access_token: oauthData.access_token,
            refresh_token: oauthData.refresh_token,
            token_type: oauthData.token_type,
            expires_in: oauthData.expires_in,
            data: drupalData
          });
        } else {
          const oauthError = await oauthResponse.text();
          console.log('OAuth token request failed:', oauthError);
          
          // Even if OAuth fails, we can still proceed with session-based auth
          const userInfo = {
            uid: drupalData.current_user?.uid,
            name: drupalData.current_user?.name,
            roles: drupalData.current_user?.roles || [],
            csrf_token: drupalData.csrf_token,
            logout_token: drupalData.logout_token
          };
          
          return res.json({
            success: true,
            message: 'Login successful (session-based)',
            user: userInfo,
            data: drupalData
          });
        }
      } catch (oauthErr) {
        console.log('OAuth token request error:', oauthErr.message);
        
        // Fallback to session-based auth
        const userInfo = {
          uid: drupalData.current_user?.uid,
          name: drupalData.current_user?.name,
          roles: drupalData.current_user?.roles || [],
          csrf_token: drupalData.csrf_token,
          logout_token: drupalData.logout_token
        };
        
        return res.json({
          success: true,
          message: 'Login successful (session-based)',
          user: userInfo,
          data: drupalData
        });
      }
    } catch (err) {
      console.log('Drupal login method error:', err.message);
      return res.status(500).json({ 
        success: false,
        error: 'Server Error!', 
        message: 'An error occurred during login',
        details: err.message
      });
    }

  } catch (error) {
    console.error('Login server error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server Error!', 
      message: 'An error occurred during login',
      details: error.toString() 
    });
  }
});

// // New login endpoint that combines Drupal login and OAuth token retrieval
// app.post('/api/login', async (req, res) => {
//   try {
//     console.log('Received login request:', JSON.stringify(req.body, null, 2));

//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Username and password are required' 
//       });
//     }

//     // First, verify user credentials with Drupal user login
//     try {
//       const drupalResponse = await fetch('https://zodr.zodml.org/user/login?_format=json', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify({ 
//           name: username, 
//           pass: password 
//         })
//       });
      
//       if (!drupalResponse.ok) {
//         const errorDetails = await drupalResponse.text();
//         console.log('Drupal login method failed:', errorDetails);
//         return res.status(401).json({ 
//           success: false,
//           error: 'Login failed!', 
//           message: 'Invalid credentials',
//           details: errorDetails
//         });
//       }

//       const drupalData = await drupalResponse.json();
//       console.log('Drupal login successful, now getting OAuth token...');
      
//       // Get OAuth access token
//       let oauthToken = null;
//       try {
//         const formData = new URLSearchParams();
//         formData.append('grant_type', 'password');
//         formData.append('username', username);
//         formData.append('password', password);
//         formData.append('client_id', 'testman');
//         formData.append('client_secret', 'Tigers3me.$');

//         const oauthResponse = await fetch('https://zodr.zodml.org/oauth/token', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Accept': 'application/json'
//           },
//           body: formData.toString()
//         });

//         if (oauthResponse.ok) {
//           oauthToken = await oauthResponse.json();
//           console.log('OAuth token obtained successfully');
//         } else {
//           console.log('OAuth token request failed, continuing with session auth');
//         }
//       } catch (oauthErr) {
//         console.log('OAuth token request error:', oauthErr.message);
//       }

//       // Fetch detailed user profile if we have OAuth token
//       let userProfile = null;
//       if (oauthToken && drupalData.current_user?.uid) {
//         try {
//           const profileResponse = await fetch(`https://zodr.zodml.org/jsonapi/user/user/${drupalData.current_user.uid}`, {
//             method: 'GET',
//             headers: {
//               'Authorization': `Bearer ${oauthToken.access_token}`,
//               'Accept': 'application/vnd.api+json',
//               'Content-Type': 'application/vnd.api+json'
//             }
//           });

//           if (profileResponse.ok) {
//             const profileData = await profileResponse.json();
//             console.log('User profile fetched successfully');
            
//             // Extract and structure user profile data
//             userProfile = {
//               uid: profileData.data.attributes.drupal_internal__uid,
//               name: profileData.data.attributes.name,
//               displayName: profileData.data.attributes.display_name,
//               mail: profileData.data.attributes.mail,
//               status: profileData.data.attributes.status,
//               created: profileData.data.attributes.created,
//               changed: profileData.data.attributes.changed,
//               // Custom fields (adjust based on your Drupal setup)
//               firstName: profileData.data.attributes.field_first_name || '',
//               lastName: profileData.data.attributes.field_last_name || '',
//               phone: profileData.data.attributes.field_phone || '',
//               // Handle profile picture if it exists
//               profilePicture: profileData.data.relationships?.user_picture?.data
//                 ? `https://zodr.zodml.org${profileData.data.relationships.user_picture.data.attributes?.uri?.url || ''}`
//                 : null,
//               // Extract roles
//               roles: profileData.data.relationships?.roles?.data?.map(role => role.id) || []
//             };
//           }
//         } catch (profileErr) {
//           console.log('Failed to fetch user profile:', profileErr.message);
//         }
//       }

//       // Prepare user info (use profile data if available, otherwise fallback to basic data)
//       const userInfo = userProfile || {
//         uid: drupalData.current_user?.uid,
//         name: drupalData.current_user?.name,
//         mail: drupalData.current_user?.mail || '',
//         roles: drupalData.current_user?.roles || [],
//         csrf_token: drupalData.csrf_token,
//         logout_token: drupalData.logout_token,
//         firstName: '',
//         lastName: '',
//         phone: '',
//         profilePicture: null
//       };

//       // Prepare response based on whether we have OAuth token
//       const response = {
//         success: true,
//         message: oauthToken ? 'Login successful' : 'Login successful (session-based)',
//         user: userInfo,
//         data: drupalData
//       };

//       // Add OAuth token data if available
//       if (oauthToken) {
//         response.access_token = oauthToken.access_token;
//         response.refresh_token = oauthToken.refresh_token;
//         response.token_type = oauthToken.token_type;
//         response.expires_in = oauthToken.expires_in;
//       }

//       return res.json(response);

//     } catch (err) {
//       console.log('Drupal login method error:', err.message);
//       return res.status(500).json({ 
//         success: false,
//         error: 'Server Error!', 
//         message: 'An error occurred during login',
//         details: err.message
//       });
//     }

//   } catch (error) {
//     console.error('Login server error:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server Error!', 
//       message: 'An error occurred during login',
//       details: error.toString() 
//     });
//   }
// });
// // Add a new endpoint to fetch user profile separately
// app.get('/api/user/profile/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         error: 'Authorization token required'
//       });
//     }

//     const token = authHeader.substring(7);

//     const profileResponse = await fetch(`https://zodr.zodml.org/jsonapi/user/user/${userId}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/vnd.api+json',
//         'Content-Type': 'application/vnd.api+json'
//       }
//     });

//     if (!profileResponse.ok) {
//       const errorText = await profileResponse.text();
//       return res.status(profileResponse.status).json({
//         success: false,
//         error: 'Failed to fetch user profile',
//         details: errorText
//       });
//     }

//     const profileData = await profileResponse.json();
    
//     // Structure the profile data
//     const userProfile = {
//       uid: profileData.data.attributes.drupal_internal__uid,
//       name: profileData.data.attributes.name,
//       displayName: profileData.data.attributes.display_name,
//       mail: profileData.data.attributes.mail,
//       status: profileData.data.attributes.status,
//       created: profileData.data.attributes.created,
//       changed: profileData.data.attributes.changed,
//       firstName: profileData.data.attributes.field_first_name || '',
//       lastName: profileData.data.attributes.field_last_name || '',
//       phone: profileData.data.attributes.field_phone || '',
//       profilePicture: profileData.data.relationships?.user_picture?.data
//         ? `https://zodr.zodml.org${profileData.data.relationships.user_picture.data.attributes?.uri?.url || ''}`
//         : null,
//       roles: profileData.data.relationships?.roles?.data?.map(role => role.id) || []
//     };

//     res.json({
//       success: true,
//       user: userProfile
//     });

//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server Error!',
//       message: 'An error occurred while fetching profile',
//       details: error.toString()
//     });
//   }
// });
// // Add endpoint to update user profile
// app.patch('/api/user/profile/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { firstName, lastName, phone, email } = req.body;
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         error: 'Authorization token required'
//       });
//     }

//     const token = authHeader.substring(7);

//     const updateData = {
//       data: {
//         type: 'user--user',
//         id: userId,
//         attributes: {}
//       }
//     };

//     // Add fields that are being updated
//     if (firstName !== undefined) updateData.data.attributes.field_first_name = firstName;
//     if (lastName !== undefined) updateData.data.attributes.field_last_name = lastName;
//     if (phone !== undefined) updateData.data.attributes.field_phone = phone;
//     if (email !== undefined) updateData.data.attributes.mail = email;

//     const updateResponse = await fetch(`https://zodr.zodml.org/jsonapi/user/user/${userId}`, {
//       method: 'PATCH',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/vnd.api+json',
//         'Content-Type': 'application/vnd.api+json'
//       },
//       body: JSON.stringify(updateData)
//     });

//     if (!updateResponse.ok) {
//       const errorText = await updateResponse.text();
//       return res.status(updateResponse.status).json({
//         success: false,
//         error: 'Failed to update user profile',
//         details: errorText
//       });
//     }

//     const updatedData = await updateResponse.json();
    
//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       user: updatedData.data
//     });

//   } catch (error) {
//     console.error('Profile update error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server Error!',
//       message: 'An error occurred while updating profile',
//       details: error.toString()
//     });
//   }
// });


// Endpoint for fetching all hotels
app.get('/api/hotels', async (req, res) => {
  try {
    console.log('Fetching hotels from external API...');

    const response = await fetch('https://zodr.zodml.org/api/hotels', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Hotels API response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Hotels API Error!', text);
      return res.status(response.status).json({error:'Failed to fetch hotels!', details: text});
    }

    const data = await response.json();
    console.log('Hotels API success response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Hotels API error:', error);
    res.status(500).json({error:'Failed to fetch hotels!', details: error.toString()});
  }
});


// New endpoint for searching hotels with filters
app.get('/api/search/hotels', async (req, res) => {
  try {
    console.log('Searching hotels with filters:', req.query);

    // Build the search URL with query parameters
    const baseUrl = 'https://zodr.zodml.org/api/search/hotels';
    const queryParams = new URLSearchParams();

    // Add filters to query params if they exist
    if (req.query.field_state_target_id) {
      queryParams.append('field_state_target_id', req.query.field_state_target_id);
    }
    if (req.query.title) {
      queryParams.append('title', req.query.title);
    }
    if (req.query.field_rating_value) {
      queryParams.append('field_rating_value', req.query.field_rating_value);
    }
    if (req.query.field_amenities_target_id) {
      queryParams.append('field_amenities_target_id', req.query.field_amenities_target_id);
    }

    const searchUrl = queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;
    console.log('Search URL:', searchUrl);

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Search API response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Search API Error!', text);
      return res.status(response.status).json({error:'Failed to search hotels!', details: text});
    }

    const data = await response.json();
    console.log('Search API success response:', JSON.stringify(data, null, 2));
    // Ensure we return an array
    const hotels = Array.isArray(data) ? data : (data.data ? data.data : []);
    res.json(hotels);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({error:'Failed to search hotels!', details: error.toString()});
  }
});


// Endpoint for fetching hotel rooms
app.get('/api/hotel-rooms', async (req, res) => {
  try {
    const { nid } = req.query;
    if (!nid) {
      return res.status(400).json({ error: 'Missing nid parameter' });
    }

    const url = `https://zodr.zodml.org/api/hotel-rooms/?nid=${encodeURIComponent(nid)}`;
    console.log('Fetching hotel rooms from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Hotel rooms API response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Hotel rooms API Error!', text);
      return res.status(response.status).json({error:'Failed to fetch hotel rooms!', details: text});
    }

    const data = await response.json();
    console.log("Hotel rooms API response:", data);

    if (!Array.isArray(data)) {
      return res.status(500).json({error:'Failed to fetch hotel rooms!', details: 'No rooms found or error fetching rooms.'});
    }

    res.json(data);
  } catch (error) {
    console.error('Hotel rooms API error:', error);
    res.status(500).json({error:'Failed to fetch hotel rooms!', details: error.toString()});
  }
});


// Booking API Endpoints
// 1. Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    console.log('Creating new booking with data:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);

    // Extract access token from Authorization header
    const authHeader = req.headers.authorization;
    let access_token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      access_token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else if (req.body.access_token) {
      access_token = req.body.access_token;
    }
    
    console.log('Extracted access token:', access_token ? 'Present' : 'Missing');
    
    if (!access_token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'Access token is required'
      });
    }

    // Check if this is a real OAuth token or a session token
    let isOAuthToken = false;
    let userInfo = null;

    try {
      // Try to decode as session token first
      const decodedToken = JSON.parse(atob(access_token));
      userInfo = decodedToken;
      console.log('Using session token for booking creation');
    } catch (error) {
      // If decoding fails, assume it's an OAuth token
      isOAuthToken = true;
      console.log('Using OAuth token for booking creation');
    }

    const bookingData = req.body;
    
    if (isOAuthToken) {
      // Use real OAuth token for external API
      const bookingPayload = {
        data: {
          type: "node--booking",
          attributes: {
            title: bookingData.title,
            field_check_in_date: bookingData.field_check_in_date,
            field_check_out_date: bookingData.field_check_out_date,
            field_number_of_guest: bookingData.field_number_of_guest,
            field_total_price: bookingData.field_total_price,
            field_booking_status: bookingData.field_booking_status || "pending",
            field_payment_status: bookingData.field_payment_status || "unpaid",
            field_special_requests: bookingData.field_special_requests || ""
          }
        }
      };

      console.log('Sending booking payload to external API:', JSON.stringify(bookingPayload, null, 2));

      const response = await fetch('https://zodr.zodml.org/jsonapi/node/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.api+json'
        },
        body: JSON.stringify(bookingPayload)
      });

      console.log('External booking API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create booking with external API:', errorText);
        return res.status(response.status).json({
          success: false,
          error: 'Failed to create booking',
          message: 'Could not create booking with external service',
          details: errorText
        });
      }

      const bookingResponse = await response.json();
      console.log('External booking API success response:', JSON.stringify(bookingResponse, null, 2));

      res.json({
        success: true,
        message: 'Booking created successfully',
        booking: bookingResponse.data,
        booking_id: bookingResponse.data.id,
        booking_nid: bookingResponse.data.attributes.drupal_internal__nid
      });
    } else {
      // Use session token - create mock booking
      const mockBookingResponse = {
        data: {
          id: `booking-${Date.now()}`,
          type: "node--booking",
          attributes: {
            title: bookingData.title,
            field_check_in_date: bookingData.field_check_in_date,
            field_check_out_date: bookingData.field_check_out_date,
            field_number_of_guest: bookingData.field_number_of_guest,
            field_total_price: bookingData.field_total_price,
            field_booking_status: bookingData.field_booking_status,
            field_payment_status: bookingData.field_payment_status,
            field_special_requests: bookingData.field_special_requests,
            drupal_internal__nid: Math.floor(Math.random() * 1000) + 1
          }
        }
      };

      console.log('Mock booking created successfully:', mockBookingResponse);

      res.json({
        success: true,
        message: 'Booking created successfully',
        booking: mockBookingResponse.data,
        booking_id: mockBookingResponse.data.id,
        booking_nid: mockBookingResponse.data.attributes.drupal_internal__nid
      });
    }

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An error occurred while creating the booking',
      details: error.toString()
    });
  }
});

// 2. Get user's bookings
// app.get('/api/bookings', async (req, res) => {
//   try {
//     console.log('Fetching user bookings...');

//     // Extract access token from Authorization header
//     const authHeader = req.headers.authorization;
//     let access_token = null;
    
//     if (authHeader && authHeader.startsWith('Bearer ')) {
//       access_token = authHeader.substring(7); // Remove 'Bearer ' prefix
//     } else if (req.query.access_token) {
//       access_token = req.query.access_token;
//     }
    
//     console.log('Extracted access token:', access_token ? 'Present' : 'Missing');
    
//     if (!access_token) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'Authentication required',
//         message: 'Access token is required'
//       });
//     }

//     // Decode session token to get user info
//     let userInfo;
//     try {
//       const decodedToken = JSON.parse(atob(access_token));
//       userInfo = decodedToken;
//       console.log('Decoded session token for bookings:', userInfo);
//     } catch (error) {
//       console.error('Invalid session token:', error);
//       return res.status(401).json({
//         success: false,
//         error: 'Invalid session token',
//         message: 'Please login again'
//       });
//     }

//     // Mock bookings for the user
//     const mockBookings = [
//       {
//         id: `booking-${Date.now()}-1`,
//         type: "node--booking",
//         attributes: {
//           title: "Booking for Room 101 at Sample Hotel",
//           field_check_in_date: "2025-01-15",
//           field_check_out_date: "2025-01-18",
//           field_number_of_guest: 2,
//           field_total_price: "450.00",
//           field_booking_status: "confirmed",
//           field_payment_status: "paid",
//           field_special_requests: "High floor preferred"
//         }
//       },
//       {
//         id: `booking-${Date.now()}-2`,
//         type: "node--booking",
//         attributes: {
//           title: "Booking for Suite 205 at Luxury Hotel",
//           field_check_in_date: "2025-02-20",
//           field_check_out_date: "2025-02-25",
//           field_number_of_guest: 3,
//           field_total_price: "1200.00",
//           field_booking_status: "pending",
//           field_payment_status: "unpaid",
//           field_special_requests: "Late check-in"
//         }
//       }
//     ];

//     console.log('Returning mock bookings for user:', userInfo.name);

//     res.json({
//       success: true,
//       message: 'Bookings retrieved successfully',
//       bookings: mockBookings
//     });

//   } catch (error) {
//     console.error('Fetch bookings error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error',
//       message: 'An error occurred while fetching bookings',
//       details: error.toString()
//     });
//   }
// });
app.get('/api/bookings', async (req, res) => {
  try {
    console.log('Fetching user bookings...');
    // Extract access token
    const authHeader = req.headers.authorization;
    let access_token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      access_token = authHeader.substring(7);
    } else if (req.query.access_token) {
      access_token = req.query.access_token;
    }

    if (!access_token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Access token is required'
      });
    }
    // STEP 1: Get user UUID
    const userRes = await fetch('https://zodr.zodml.org/jsonapi/user/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.api+json'
      }
    });

    if (!userRes.ok) {
      const errText = await userRes.text();
      console.error('User info fetch failed:', errText);
      return res.status(401).json({
        success: false,
        error: 'Invalid token or unauthorized',
        details: errText
      });
    }

    const userData = await userRes.json();
    const userUUID = userData.data.id;
    console.log('User UUID:', userUUID);

    // STEP 2: Get user bookings using UUID
    const bookingsRes = await fetch(`https://zodr.zodml.org/jsonapi/node/booking?filter[uid.id]=${userUUID}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.api+json'
      }
    });

    if (!bookingsRes.ok) {
      const errText = await bookingsRes.text();
      console.error('Bookings fetch failed:', errText);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch bookings',
        details: errText
      });
    }

    const bookingsData = await bookingsRes.json();
    console.log(`Fetched ${bookingsData.data.length} bookings`);

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      bookings: bookingsData.data
    });

  } catch (error) {
    console.error('Error in /api/bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An error occurred while fetching bookings',
      details: error.toString()
    });
  }
});


// 3. Get specific booking
app.get('/api/bookings/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log('Fetching specific booking:', bookingId);

    // Extract access token from Authorization header
    const authHeader = req.headers.authorization;
    let access_token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      access_token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else if (req.query.access_token) {
      access_token = req.query.access_token;
    }
    
    console.log('Extracted access token:', access_token ? 'Present' : 'Missing');
    
    if (!access_token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'Access token is required'
      });
    }

    // Check if this is a real OAuth token or a session token
    let isOAuthToken = false;
    let userInfo = null;

    try {
      // Try to decode as session token first
      const decodedToken = JSON.parse(atob(access_token));
      userInfo = decodedToken;
      console.log('Using session token for fetching specific booking');
    } catch (error) {
      // If decoding fails, assume it's an OAuth token
      isOAuthToken = true;
      console.log('Using OAuth token for fetching specific booking');
    }

    if (isOAuthToken) {
      // Use real OAuth token for external API
      const response = await fetch(`https://zodr.zodml.org/jsonapi/node/booking/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.api+json'
        }
      });

      console.log('Specific booking API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch specific booking:', errorText);
        return res.status(response.status).json({
          success: false,
          error: 'Failed to fetch booking',
          message: 'Could not retrieve booking details',
          details: errorText
        });
      }

      const bookingData = await response.json();
      console.log('Specific booking API success response:', JSON.stringify(bookingData, null, 2));

      res.json({
        success: true,
        message: 'Booking retrieved successfully',
        booking: bookingData.data
      });
    } else {
      // Use session token - return mock booking data
      console.log('Returning mock booking data for user:', userInfo.name);
      
      const mockBooking = {
        id: bookingId,
        type: "node--booking",
        attributes: {
          title: "Sample Booking",
          field_check_in_date: "2025-01-15",
          field_check_out_date: "2025-01-18",
          field_number_of_guest: 2,
          field_total_price: "450.00",
          field_booking_status: "confirmed",
          field_payment_status: "paid",
          field_special_requests: "High floor preferred"
        }
      };

      res.json({
        success: true,
        message: 'Booking retrieved successfully',
        booking: mockBooking
      });
    }

  } catch (error) {
    console.error('Fetch specific booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An error occurred while fetching the booking',
      details: error.toString()
    });
  }
});

// 4. Update booking after payment
app.patch('/api/bookings/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log('Updating booking:', bookingId, 'with data:', JSON.stringify(req.body, null, 2));

    // Extract access token from Authorization header
    const authHeader = req.headers.authorization;
    let access_token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      access_token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else if (req.body.access_token) {
      access_token = req.body.access_token;
    }
    
    console.log('Extracted access token:', access_token ? 'Present' : 'Missing');
    
    if (!access_token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'Access token is required'
      });
    }

    // Check if this is a real OAuth token or a session token
    let isOAuthToken = false;
    let userInfo = null;

    try {
      // Try to decode as session token first
      const decodedToken = JSON.parse(atob(access_token));
      userInfo = decodedToken;
      console.log('Using session token for booking update');
    } catch (error) {
      // If decoding fails, assume it's an OAuth token
      isOAuthToken = true;
      console.log('Using OAuth token for booking update');
    }

    const updateData = req.body;
    
    if (isOAuthToken) {
      // Use real OAuth token for external API
      const updatePayload = {
        data: {
          type: "node--booking",
          id: bookingId,
          attributes: {
            field_booking_status: updateData.field_booking_status || "confirmed",
            field_payment_status: updateData.field_payment_status || "paid"
          }
        }
      };

      console.log('Sending update payload to external API:', JSON.stringify(updatePayload, null, 2));

      const response = await fetch(`https://zodr.zodml.org/jsonapi/node/booking/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.api+json'
        },
        body: JSON.stringify(updatePayload)
      });

      console.log('Update booking API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update booking:', errorText);
        return res.status(response.status).json({
          success: false,
          error: 'Failed to update booking',
          message: 'Could not update booking status',
          details: errorText
        });
      }

      const updateResponse = await response.json();
      console.log('Update booking API success response:', JSON.stringify(updateResponse, null, 2));

      res.json({
        success: true,
        message: 'Booking updated successfully',
        booking: updateResponse.data
      });
    } else {
      // Use session token - return mock success response
      console.log('Mock booking update successful for user:', userInfo.name);
      
      res.json({
        success: true,
        message: 'Booking updated successfully',
        booking: {
          id: bookingId,
          type: "node--booking",
          attributes: {
            field_booking_status: updateData.field_booking_status || "confirmed",
            field_payment_status: updateData.field_payment_status || "paid"
          }
        }
      });
    }

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An error occurred while updating the booking',
      details: error.toString()
    });
  }
});

// Test endpoint to check each login method individually
app.get('/api/test-login', async (req, res) => {
  try {
    console.log('Testing all login methods...');
    const testUsername = 'testman';
    const testPassword = 'Tigers3me.$';
    
    const results = {};
    
    // Test 1: OAuth Token Endpoint
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', testUsername);
      formData.append('password', testPassword);
      formData.append('client_id', 'testman');
      formData.append('client_secret', 'Tigers3me.$');

      const oauthResponse = await fetch('https://zodr.zodml.org/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: formData.toString()
      });
      
      results.oauth = {
        status: oauthResponse.status,
        ok: oauthResponse.ok,
        response: await oauthResponse.text()
      };
    } catch (err) {
      results.oauth = { error: err.message };
    }
    
    // Test 2: Drupal User Login
    try {
      const drupalResponse = await fetch('https://zodr.zodml.org/user/login?_format=json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          name: testUsername, 
          pass: testPassword 
        })
      });
      
      results.drupal = {
        status: drupalResponse.status,
        ok: drupalResponse.ok,
        response: await drupalResponse.text()
      };
    } catch (err) {
      results.drupal = { error: err.message };
    }
    
    // Test 3: Session Token Method
    try {
      const sessionResponse = await fetch('https://zodr.zodml.org/session/token', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (sessionResponse.ok) {
        const sessionToken = await sessionResponse.text();
        
        const loginResponse = await fetch('https://zodr.zodml.org/user/login?_format=json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-Token': sessionToken
          },
          body: JSON.stringify({ 
            name: testUsername, 
            pass: testPassword 
          })
        });
        
        results.session = {
          status: loginResponse.status,
          ok: loginResponse.ok,
          response: await loginResponse.text()
        };
      } else {
        results.session = {
          status: sessionResponse.status,
          error: 'Failed to get session token'
        };
      }
    } catch (err) {
      results.session = { error: err.message };
    }
    
    // Test 4: Basic Auth
    try {
      const credentials = Buffer.from(`${testUsername}:${testPassword}`).toString('base64');
      
      const basicResponse = await fetch('https://zodr.zodml.org/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({ 
          username: testUsername, 
          password: testPassword 
        })
      });
      
      results.basic = {
        status: basicResponse.status,
        ok: basicResponse.ok,
        response: await basicResponse.text()
      };
    } catch (err) {
      results.basic = { error: err.message };
    }
    
    console.log('Test results:', JSON.stringify(results, null, 2));
    res.json({
      message: 'Login methods test completed',
      results: results
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      error: 'Test failed',
      message: error.message
    });
  }
});


// Start server
const port = 3001; // Ensure this matches the port in your frontend fetch calls
app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`));












