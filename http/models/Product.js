const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productDescription: {
    type: String,
    required: true
  },
  productRating: {
    type: Number,
    required: false,
    default: null
  },
  productMainImage: {
    type: String,
    required: true
  },
  productImages: {
    type: Array,
    required: false
  },
  productOwner: {
    type: String,
    required: true
  },
  productReviews: {
    type: Array,
    required: false,
    default: []
  }
});

module.exports = Post = mongoose.model('posts', postSchema);
