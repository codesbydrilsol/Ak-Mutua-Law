// server.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const clientRoutes = require('./routes/clients'); // Routes for client CRUD operations

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- MIDDLEWARE --------------------
// Enable CORS so frontend can communicate with backend
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// -------------------- ROUTES --------------------
// Client routes
app.use('/clients', clientRoutes);

// Root route (for quick server check)
app.get('/', (req, res) => {
  res.send('Law Firm Backend Running');
});

// -------------------- MONGODB CONNECTION --------------------
mongoose.connect(process.env.MONGO_URI) // No options needed for Mongoose 9.x
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});