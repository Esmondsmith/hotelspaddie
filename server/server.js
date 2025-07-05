
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

// Start server
const port = 3001; // Ensure this matches the port in your frontend fetch calls
app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`));












