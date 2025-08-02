// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  plan: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  payment_success_status: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }); // adds createdAt and updatedAt fields

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
