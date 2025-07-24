
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Make sure you've installed node-fetch: npm install node-fetch
const app = express();
const bcrypt = require('bcrypt');


app.use(cors());
app.use(express.json());



//Working register api
app.post('/api/Register', async (req, res) => {
  try {
    console.log('Received registration request:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const requiredFields = ['name', 'mail', 'pass', 'field_first_name', 'field_last_name', 'field_phone_number', 'field_gender', 'field_nationality'];
    for (const field of requiredFields) {
      if (!req.body[field] || !req.body[field][0] || !req.body[field][0].value) {
        return res.status(400).json({
          error: 'Validation failed',
          details: `Missing required field: ${field}`
        });
      }
    }

    // Additional validation for specific fields
    const email = req.body.mail[0].value;
    const phoneNumber = req.body.field_phone_number[0].value;
    const gender = req.body.field_gender[0].value;
    const nationality = req.body.field_nationality[0].value;


    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'Invalid email format'
      });
    }

    // Phone number validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'Invalid phone number format'
      });
    }

    // Gender validation
    if (!['male', 'female'].includes(gender.toLowerCase())) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'Invalid gender value'
      });
    }

    // Nationality validation
    if (!nationality.trim()) { // Basic check if it's not empty
    return res.status(400).json({
        error: 'Validation failed',
        details: 'Country field cannot be empty'
    });
}

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
      
      // Try to parse the error response for better error messages
      let errorDetails = text;
      try {
        const errorData = JSON.parse(text);
        if (errorData.message) {
          errorDetails = errorData.message;
        } else if (errorData.error) {
          errorDetails = errorData.error;
        }
      } catch (parseError) {
        // Keep original text if parsing fails
        console.warn('Could not parse Zodr API error response as JSON:', parseError);
      }
      
      return res.status(response.status).json({
        error: 'Registration failed!', 
        details: errorDetails
      });
    }

    const data = await response.json();
    console.log('External API success response:', JSON.stringify(data, null, 2));
    
    // Return success response
    res.json({
      success: true,
      message: 'User registered successfully',
      data: data
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Server Error!', 
      details: error.toString()
    });
  }
});
//WORKING CODE WITH PHONE,GENDER,COUNTRY AND BCRYPT
// app.post('/api/Register', async (req, res) => {
//   try {
//     console.log('Received registration request:', req.body);

//     const requiredFields = [
//       'name', 'mail', 'pass',
//       'field_first_name', 'field_last_name',
//       'field_phone_number', 'field_gender',
//       'field_nationality'
//     ];

//     for (const field of requiredFields) {
//       if (!req.body[field] || !req.body[field][0]?.value) {
//         return res.status(400).json({ error: 'Validation failed', details: `Missing required field: ${field}` });
//       }
//     }

//     const email = req.body.mail[0].value;
//     const phone = req.body.field_phone_number[0].value;
//     const gender = req.body.field_gender[0].value.toLowerCase();

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
//       return res.status(400).json({ error: 'Validation failed', details: 'Invalid email format' });

//     if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, '')))
//       return res.status(400).json({ error: 'Validation failed', details: 'Invalid phone number format' });

//     if (!['male', 'female'].includes(gender))
//       return res.status(400).json({ error: 'Validation failed', details: 'Invalid gender value' });

//     //Hash password before sending to external API
//     const plainPassword = req.body.pass[0].value;
//     const hashedPassword = await bcrypt.hash(plainPassword, 10);

//     const externalPayload = {
//       ...req.body,
//       pass: [{ value: hashedPassword }]
//     };

//     const response = await fetch('https://zodr.zodml.org/entity/user?_format=json', {
//       method: 'POST',
//       headers: {
//         'Authorization': 'Basic dGVzdG1hbjpUaWdlcnMzbWUuJA==',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(externalPayload)
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       let errorDetails = text;
//       try {
//         const errorData = JSON.parse(text);
//         errorDetails = errorData.message || errorData.error || text;
//       } catch {}
//       return res.status(response.status).json({ error: 'Registration failed', details: errorDetails });
//     }

//     const data = await response.json();
//     res.status(201).json({ message: 'Registration successful', data });
//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ error: 'Server error', details: err.message });
//   }
// });





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

    const url = `https://zodr.zodml.org/api/hotel-rooms/${nid}`;
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


// User Past Bookings Endpoint
app.get('/api/user-past-bookings', async (req, res) => {
  try {
    console.log('Fetching user past bookings...');
    
    // Extract access token from Authorization header
    const authHeader = req.headers.authorization;
    let access_token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      access_token = authHeader.substring(7); // Remove 'Bearer ' prefix
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
      console.log('Using session token for user past bookings');
    } catch (error) {
      // If decoding fails, assume it's an OAuth token
      isOAuthToken = true;
      console.log('Using OAuth token for user past bookings');
    }

    if (isOAuthToken) {
      // Use real OAuth token for external API
      console.log('Using OAuth token for user past bookings');
      
      // First, get the current user info to get their UUID
      const userResponse = await fetch('https://zodr.zodml.org/jsonapi/user/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      });

      console.log('User info API response status:', userResponse.status);

      if (!userResponse.ok) {
        const text = await userResponse.text();
        console.error('User info API Error!', text);
        return res.status(userResponse.status).json({
          success: false,
          error: 'Failed to fetch user info',
          message: 'Could not retrieve user information',
          details: text
        });
      }

      const userData = await userResponse.json();
      console.log('User info API success response:', JSON.stringify(userData, null, 2));

      const userUuid = userData.data?.id;
      if (!userUuid) {
        return res.status(400).json({
          success: false,
          error: 'User UUID not found',
          message: 'Could not retrieve user UUID'
        });
      }

      console.log('User UUID:', userUuid);

      // Now get the user's bookings using their UUID
      const bookingsResponse = await fetch(`https://zodr.zodml.org/jsonapi/node/booking?filter[uid.id]=${userUuid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      });

      console.log('User bookings API response status:', bookingsResponse.status);

      if (!bookingsResponse.ok) {
        const text = await bookingsResponse.text();
        console.error('User bookings API Error!', text);
        return res.status(bookingsResponse.status).json({
          success: false,
          error: 'Failed to fetch user bookings',
          message: 'Could not retrieve booking history',
          details: text
        });
      }

      const bookingsData = await bookingsResponse.json();
      console.log('User bookings API success response:', JSON.stringify(bookingsData, null, 2));

      // Enhance bookings with hotel and room details if available
      const enhancedBookings = await Promise.all(
        (bookingsData.data || []).map(async (booking) => {
          try {
            // Get hotel details if available
            if (booking.relationships?.field_hotel?.data?.id) {
              const hotelResponse = await fetch(`https://zodr.zodml.org/jsonapi/node/hotel/${booking.relationships.field_hotel.data.id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Accept': 'application/vnd.api+json',
                  'Content-Type': 'application/vnd.api+json'
                }
              });
              
              if (hotelResponse.ok) {
                const hotelData = await hotelResponse.json();
                booking.attributes.hotel_name = hotelData.data?.attributes?.title;
              }
            }

            // Get room details if available
            if (booking.relationships?.field_room?.data?.id) {
              const roomResponse = await fetch(`https://zodr.zodml.org/jsonapi/node/room_type/${booking.relationships.field_room.data.id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Accept': 'application/vnd.api+json',
                  'Content-Type': 'application/vnd.api+json'
                }
              });
              
              if (roomResponse.ok) {
                const roomData = await roomResponse.json();
                booking.attributes.room_name = roomData.data?.attributes?.title;
              }
            }

            return booking;
          } catch (error) {
            console.error('Error enhancing booking with hotel/room details:', error);
            return booking;
          }
        })
      );

      res.json({
        success: true,
        message: 'User past bookings retrieved successfully',
        bookings: enhancedBookings
      });
    } else {
      // Use session token - try to get real data from external API
      console.log('Using session token for user past bookings - attempting external API call');
      
      // Try to call external API even with session token
      const response = await fetch('https://zodr.zodml.org/jsonapi/node/booking', {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      });

      console.log('External API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('External API success response:', JSON.stringify(data, null, 2));
        
        res.json({
          success: true,
          message: 'User past bookings retrieved successfully',
          bookings: data.data || []
        });
      } else {
        // If external API fails, return empty array instead of mock data
        console.log('External API failed, returning empty bookings array');
        
        res.json({
          success: true,
          message: 'No bookings found',
          bookings: []
        });
      }
    }

  } catch (error) {
    console.error('User past bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An error occurred while fetching user past bookings',
      details: error.toString()
    });
  }
});

// User Info Endpoint
app.get('/api/user-info', async (req, res) => {
  try {
    console.log('Fetching user info...');
    
    // Extract access token from Authorization header
    const authHeader = req.headers.authorization;
    let access_token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      access_token = authHeader.substring(7); // Remove 'Bearer ' prefix
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
      console.log('Using session token for user info');
    } catch (error) {
      // If decoding fails, assume it's an OAuth token
      isOAuthToken = true;
      console.log('Using OAuth token for user info');
    }

    if (isOAuthToken) {
      // Use real OAuth token for external API
      const response = await fetch('https://zodr.zodml.org/jsonapi/user/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      });

      console.log('User info API response status:', response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error('User info API Error!', text);
        return res.status(response.status).json({
          success: false,
          error: 'Failed to fetch user info',
          message: 'Could not retrieve user information',
          details: text
        });
      }

      const data = await response.json();
      console.log('User info API success response:', JSON.stringify(data, null, 2));

      // Extract user data from the response
      const userData = data.data;
      if (!userData) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: 'No user data available'
        });
      }

      const userProfile = {
        uid: userData.id,
        name: userData.attributes?.name || userData.attributes?.display_name,
        mail: userData.attributes?.mail,
        firstName: userData.attributes?.field_first_name || '',
        lastName: userData.attributes?.field_last_name || '',
        phone: userData.attributes?.field_phone || '',
        roles: userData.attributes?.roles || [],
        created: userData.attributes?.created,
        updated: userData.attributes?.changed,
        status: userData.attributes?.status
      };

      res.json({
        success: true,
        message: 'User info retrieved successfully',
        user: userProfile
      });
    } else {
      // Use session token - return user info from session
      console.log('Returning user info from session token');
      
      res.json({
        success: true,
        message: 'User info retrieved successfully',
        user: {
          uid: userInfo.uid,
          name: userInfo.name,
          roles: userInfo.roles || [],
          timestamp: userInfo.timestamp
        }
      });
    }

  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An error occurred while fetching user info',
      details: error.toString()
    });
  }
});

// Start server
const port = 3001; // Ensure this matches the port in your frontend fetch calls
app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`));












