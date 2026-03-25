const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// @route   GET /api/transactions
// @desc    Get all active transactions for the logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/transactions
// @desc    Record a new transaction tied specifically to the authenticated User 
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, merchant, date, type } = req.body;

    // Explicitly force user linkage so no cross-pollution occurs
    const newTransaction = new Transaction({
      userId: req.user.id,
      amount,
      category,
      merchant,
      date: date || Date.now(),
      type: type || 'expense' // Default to expense if not explicit
    });

    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error('Save Transaction Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
