const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const auth = require('../middleware/auth');

// Get all clients
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new client
router.post('/', auth, async (req, res) => {
  const { name, caseNumber, caseDescription, phone, email } = req.body;
  const newClient = new Client({ name, caseNumber, caseDescription, phone, email });

  try {
    const savedClient = await newClient.save();
    res.json({ message: 'Client added', client: savedClient });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search clients by name or case number
router.get('/search', auth, async (req, res) => {
  const { query } = req.query;
  try {
    const clients = await Client.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { caseNumber: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;