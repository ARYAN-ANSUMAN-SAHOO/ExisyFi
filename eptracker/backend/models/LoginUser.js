const mongoose = require('mongoose');

const loginUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  loggedInAt: {
    type: Date,
    default: Date.now
  }
});

// Matches the database collection `loginusers` to strictly follow user requirement "in a different folder as loginusers"
module.exports = mongoose.model('LoginUser', loginUserSchema, 'loginusers');
