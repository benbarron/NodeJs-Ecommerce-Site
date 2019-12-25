const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subTotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  products: {
    type: Array,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  stripeToken: {
    type: String,
    required: true
  },
  stripeTokenType: {
    type: String,
    required: true
  }
});

module.exports = User = mongoose.model('orders', orderSchema);
