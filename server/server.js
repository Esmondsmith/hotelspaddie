const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); 
const app = express();

app.use(cors()); 
app.use(express.json()); 

app.post('/api/Register', async (req, res) => {
  try {
    console.log('Received registration request:', JSON.stringify(req.body, null, 2));
    
    // Use the correct API endpoint from api.txt
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

// New endpoint for fetching hotels
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

// New endpoint for fetching hotel rooms
app.get('/api/hotel-rooms', async (req, res) => {
  try {
    console.log('Fetching hotel rooms from external API...');
    
    const response = await fetch('https://zodr.zodml.org/api/hotel-rooms/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Hotel Rooms API response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Hotel Rooms API Error!', text);
      return res.status(response.status).json({error:'Failed to fetch hotel rooms!', details: text});
    }

    const data = await response.json();
    console.log('Hotel Rooms API success response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Hotel Rooms API error:', error);
    res.status(500).json({error:'Failed to fetch hotel rooms!', details: error.toString()});
  }
});

// Start server
const port = 3001;
app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`));





// const express = require('express');
// const cors = require('cors'); 
// const fetch = require('node-fetch'); 

// const app = express();

// app.use(cors()); 
// app.use(express.json());

// app.post('/api/Register', async (req, res) => {
//   try {
//     const response = await fetch('https://zodr.zodml.org/user/Register', {
//       method: 'POST',
//       headers: {
//         Authorization: 'Basic dGVzdG1hbjpUaWdlcnMzbWUuJA==',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(req.body)
//     });

//     const data = await response.json();

//     res.status(response.status).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({error: error.toString()});
//   }
// });

// // Start server
// const port = 5000;
// app.listen(port, () => console.log(`Server started on http://localhost:${port}`));