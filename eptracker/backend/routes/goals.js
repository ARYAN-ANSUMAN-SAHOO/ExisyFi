const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BudgetGoal = require('../models/BudgetGoal');

// @route   POST /api/goals
// @desc    Record a new target budget goal specific to authenticated user
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { targetAmount, category, duration } = req.body;

    const newGoal = new BudgetGoal({
      userId: req.user.id,
      targetAmount,
      category,
      duration
    });

    const goal = await newGoal.save();
    res.status(201).json(goal);
  } catch (err) {
    console.error('Save Goal Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/goals
// @desc    Fetch all active budget goals mapped to User
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
      const goals = await BudgetGoal.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.json(goals);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
