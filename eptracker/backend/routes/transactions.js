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
    const { amount, category, merchant, date, type, goalId } = req.body;

    // Explicitly force user linkage so no cross-pollution occurs
    const newTransaction = new Transaction({
      userId: req.user.id,
      amount,
      category,
      merchant,
      date: date || Date.now(),
      type: type || 'expense', // Default to expense if not explicit
      goalId: goalId || undefined
    });

    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error('Save Transaction Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.userId.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    const { amount, category, merchant, date, type, goalId } = req.body;
    
    // Build update object dynamically
    const updateFields = { amount, category, merchant, date, type };
    if (goalId) updateFields.goalId = goalId;

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    res.json(transaction);
  } catch (err) {
    console.error('Update Transaction Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.userId.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (err) {
    console.error('Delete Transaction Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
