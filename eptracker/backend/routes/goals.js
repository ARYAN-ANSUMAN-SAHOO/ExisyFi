const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BudgetGoal = require('../models/BudgetGoal');
const Transaction = require('../models/Transaction');

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
      const goals = await BudgetGoal.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
      
      // Fetch all expense transactions for the user that have a goalId assigned
      const goalExpenses = await Transaction.find({ userId: req.user.id, type: 'expense', goalId: { $ne: null } });

      const enrichedGoals = goals.map(goal => {
        const matchingExpenses = goalExpenses.filter(txn => txn.goalId.toString() === goal._id.toString());
        const dynamicallySavedAmount = matchingExpenses.reduce((sum, txn) => sum + txn.amount, 0);
        
        return {
           ...goal,
           savedAmount: dynamicallySavedAmount
        };
      });

      res.json(enrichedGoals);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route   PUT /api/goals/:id
// @desc    Update a budget goal
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
      let goal = await BudgetGoal.findById(req.params.id);
      if (!goal) return res.status(404).json({ message: 'Goal not found' });
      if (goal.userId.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });
  
      const { targetAmount, category, duration } = req.body;
      goal = await BudgetGoal.findByIdAndUpdate(
        req.params.id,
        { $set: { targetAmount, category, duration } },
        { new: true }
      );
      res.json(goal);
    } catch (err) {
      console.error('Update Goal Error:', err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // @route   DELETE /api/goals/:id
  // @desc    Delete a budget goal
  // @access  Private
  router.delete('/:id', auth, async (req, res) => {
    try {
      const goal = await BudgetGoal.findById(req.params.id);
      if (!goal) return res.status(404).json({ message: 'Goal not found' });
      if (goal.userId.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });
  
      await goal.deleteOne();
      res.json({ message: 'Goal removed' });
    } catch (err) {
      console.error('Delete Goal Error:', err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
