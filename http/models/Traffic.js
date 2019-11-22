const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema({
  time: {
    type: Date,
    default: Date().now
  },
  ip: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    required: true
  },
  deviceModel: {
    type: String,
    required: false
  },
  requestTime: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: false
  },
  path: {
    type: String,
    required: false
  }
});

module.exports = Post = mongoose.model('traffic', trafficSchema);
