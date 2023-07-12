const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  price: {
    type: String,
    trim: true,
    required: true
  },
  modules: [String],
  thumbnail: {
    type: String
  }
});

module.exports = mongoose.model('Course', courseSchema);
