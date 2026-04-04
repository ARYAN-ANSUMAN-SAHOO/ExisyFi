const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SplitBill = require('../models/SplitBill');

// @route   POST /api/splits
// @desc    Record a new Split Bill mapped to the authenticated user and execute mathematical division logic
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { description, totalAmount, participants, includeMyself } = req.body;

    // Validate inputs robustly so math doesn't fail
    if (!description || !totalAmount || !participants || participants < 1) {
        return res.status(400).json({ message: 'Please provide valid split parameters.' });
    }

    // Determine the raw participants divider integer
    const divider = includeMyself ? (participants + 1) : participants;

    // Execute Division Engine logic
    const calculatedPendingAmount = totalAmount / divider;

    const newSplit = new SplitBill({
      userId: req.user.id,
      description,
      totalAmount,
      participants: divider, // Track exactly how many ways it was split
      pendingAmount: calculatedPendingAmount
    });

    const split = await newSplit.save();
    res.status(201).json(split);
  } catch (err) {
    console.error('Save Split Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/splits
// @desc    Fetch ALL splits for the authenticated user natively
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
      // The frontend will perform the .filter() logic securely
      const splits = await SplitBill.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.json(splits);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route   PUT /api/splits/:id/settle
// @desc    Hook endpoint to change generic status to Settled permanently
// @access  Private
router.put('/:id/settle', auth, async (req, res) => {
    try {
      let split = await SplitBill.findById(req.params.id);

      if (!split) return res.status(404).json({ message: 'Bill not found' });
      
      // Ensure User owns this specific bill before letting them modify it
      if (split.userId.toString() !== req.user.id) {
          return res.status(401).json({ message: 'User inherently not authorized to modify this document' });
      }

      split = await SplitBill.findByIdAndUpdate(
          req.params.id,
          { $set: { status: 'settled' } },
          { new: true }
      );

      res.json(split);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route   PUT /api/splits/:id
// @desc    Update an active split bill base properties
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let split = await SplitBill.findById(req.params.id);
    if (!split) return res.status(404).json({ message: 'Bill not found' });
    if (split.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const { description, totalAmount, participants, includeMyself } = req.body;
    
    // Re-verify inputs
    if (!description || !totalAmount || !participants || participants < 1) {
        return res.status(400).json({ message: 'Please provide valid split parameters.' });
    }

    const divider = includeMyself ? (participants + 1) : participants;
    const calculatedPendingAmount = totalAmount / divider;

    split = await SplitBill.findByIdAndUpdate(
      req.params.id,
      { $set: { description, totalAmount, participants: divider, pendingAmount: calculatedPendingAmount } },
      { new: true }
    );
    res.json(split);
  } catch (err) {
    console.error('Update Split Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/splits/:id
// @desc    Delete a split bill
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const split = await SplitBill.findById(req.params.id);
    if (!split) return res.status(404).json({ message: 'Bill not found' });
    if (split.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await split.deleteOne();
    res.json({ message: 'Bill removed' });
  } catch (err) {
    console.error('Delete Split Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
