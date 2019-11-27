const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: Number,
    required: false
  },
  isAdmin: {
    type: Boolean, // 'admin' 1 || 'buyer' 0
    required: true
  },
  username: {
    // username || company name for sellers
    type: String,
    required: true
  },
  userCreatedAt: {
    type: Date,
    default: Date.now()
  },
  userLastLoggedIn: {
    type: Date,
    required: false,
    default: Date.now()
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  addresses: {
    type: Array,
    required: false
  },
  cart: {
    type: String,
    require: true,
    default: '{}'
  },
  wishlist: {
    type: String,
    required: false,
    default: '{}'
  }
});

module.exports = User = mongoose.model('users', userSchema);
