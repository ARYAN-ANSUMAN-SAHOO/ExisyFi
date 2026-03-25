const mongoose = require('mongoose');

const splitBillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  participants: {
    type: Number,
    required: true
  },
  pendingAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'settled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SplitBill', splitBillSchema);
