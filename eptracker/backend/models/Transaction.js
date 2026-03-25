const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  merchant: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
