const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  caseNumber: { type: String, required: true, unique: true },
  caseDescription: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: false },  // optional
  status: { type: String, enum: ['pending', 'closed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);