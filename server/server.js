
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); 
const app = express();

app.use(cors()); 
app.use(express.json()); 

app.post('/api/Register', async (req, res) => {
  try {
    const response = await fetch('https://zodr.zodml.org/user/Register', {
      method: 'POST',
      headers: {
        Authorization: 'Basic dGVzdG1hbjpUaWdlcnMzbWUuJA==',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Zodr API Error!', text);
      return res.status(500).json({error:'Registration failed!', details: text});
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:'Server Error!', details:error.toString()});
  }
});

// Start server
const port = 5000;
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