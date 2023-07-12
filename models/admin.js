const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  }
});

module.exports = mongoose.model('Admin', adminSchema);
