const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  caseNumber: { type: String, required: true },
  caseDescription: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);