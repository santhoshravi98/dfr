// server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const DFRClient = require('./DFRModule');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const client = new DFRClient({
  username:     process.env.DFR_USERNAME,
  password:     process.env.DFR_PASSWORD,
  clientSecret: process.env.DFR_CLIENT_SECRET
});

// GET /api/get_item?item_number=123&revision=A&qualifier=Part.0
app.get('/api/get_item', async (req, res) => {
  const { item_number, revision = 'A', qualifier = 'Part.0' } = req.query;
  try {
    const data = await client.getItem(item_number, revision, qualifier);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
