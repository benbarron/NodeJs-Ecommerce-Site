const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: false
  },
  rating: {
    type: Number,
    required: false,
    default: null
  },
  images: {
    type: Array,
    required: false
  },
  reviews: {
    type: Array,
    required: false,
    default: []
  },
  live: {
    type: Boolean,
    required: true
  }
});

module.exports = Post = mongoose.model('products', postSchema);
