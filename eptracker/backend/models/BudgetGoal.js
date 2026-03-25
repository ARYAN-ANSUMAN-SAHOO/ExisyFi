const mongoose = require('mongoose');

const budgetGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  savedAmount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    enum: ['Monthly', 'Quarterly', 'Yearly']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BudgetGoal', budgetGoalSchema);
