
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

// Login endpoint
// app.post('/api/login', async (req, res) => {
//   try {
//     console.log('Received login request:', JSON.stringify(req.body, null, 2));

//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ error: 'Username and password are required' });
//     }

//     // Try different login endpoints and methods
//     let response;
//     let errorDetails = '';
    
//     // Method 1: Try the OAuth token endpoint (most common for Drupal)
//     try {
//       response = await fetch('https://zodr.zodml.org/oauth/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Accept': 'application/json'
//         },
//         body: new URLSearchParams({
//           grant_type: 'password',
//           username,
//           password,
//           client_id: 'testman',
//           client_secret: 'Tigers3me.$'
//         })
//       });
      
//       if (response.ok) {
//         console.log('Login successful with OAuth method');
//       } else {
//         errorDetails = await response.text();
//         console.log('OAuth method failed:', errorDetails);
//       }
//     } catch (err) {
//       console.log('OAuth method error:', err.message);
//     }
    
//     // Method 2: If OAuth fails, try simple JSON login
//     if (!response || !response.ok) {
//       try {
//         response = await fetch('https://zodr.zodml.org/api/custom-login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': 'Basic dGVzdG1hbjpUaWdlcnMzbWUuJA=='
//           },
//           body: JSON.stringify({ username, password })
//         });
        
//         if (response.ok) {
//           console.log('Login successful with JSON method');
//         } else {
//           errorDetails = await response.text();
//           console.log('JSON method failed:', errorDetails);
//         }
//       } catch (err) {
//         console.log('JSON method error:', err.message);
//       }
//     }
    
//     // Method 3: Try custom login endpoint as fallback
//     if (!response || !response.ok) {
//       try {
//         response = await fetch('https://zodr.zodml.org/api/custom-login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': 'Basic dGVzdG1hbjpUaWdlcnMzbWUuJA=='
//           },
//           body: JSON.stringify({ username, password })
//         });
        
//         if (response.ok) {
//           console.log('Login successful with custom-login method');
//         } else {
//           errorDetails = await response.text();
//           console.log('custom-login method failed:', errorDetails);
//         }
//       } catch (err) {
//         console.log('custom-login method error:', err.message);
//       }
//     }

//     console.log('Login API response status:', response.status);

//     if (!response || !response.ok) {
//       console.error('All login methods failed. Last error:', errorDetails);
//       return res.status(401).json({ 
//         error: 'Login failed!', 
//         message: 'Invalid credentials or API configuration issue',
//         details: errorDetails || 'No response from login API'
//       });
//     }

//     const data = await response.json();
//     console.log('Login API success response:', JSON.stringify(data, null, 2));
    
//     // Return the response from the external API
//     res.json(data);
//   } catch (error) {
//     console.error('Login server error:', error);
//     res.status(500).json({ 
//       error: 'Server Error!', 
//       message: 'An error occurred during login',
//       details: error.toString() 
//     });
//   }
// });

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

      // Use the working Drupal user login method
      try {
        const response = await fetch('https://zodr.zodml.org/user/login?_format=json', {
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
        
        if (response.ok) {
          console.log('Login successful with Drupal user login method');
          const data = await response.json();
          console.log('Drupal login success response:', JSON.stringify(data, null, 2));
          
          // Extract user info from the response
          const userInfo = {
            uid: data.current_user?.uid,
            name: data.current_user?.name,
            roles: data.current_user?.roles || [],
            csrf_token: data.csrf_token,
            logout_token: data.logout_token
          };
          
          return res.json({
            success: true,
            message: 'Login successful',
            user: userInfo,
            data: data
          });
        } else {
          const errorDetails = await response.text();
          console.log('Drupal login method failed:', errorDetails);
          return res.status(401).json({ 
            success: false,
            error: 'Login failed!', 
            message: 'Invalid credentials',
            details: errorDetails
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












