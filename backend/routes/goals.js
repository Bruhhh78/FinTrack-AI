const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const User = require('../models/User');
const SavingsLog = require('../models/SavingsLog');
const auth = require('../middleware/auth');

// Create goal
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, targetAmount, deadline, category, priority, icon, color } = req.body;

    const goal = new Goal({
      userId: req.userId,
      name,
      description,
      targetAmount,
      deadline: new Date(deadline),
      category,
      priority,
      icon,
      color
    });

    await goal.save();
    res.status(201).json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all goals
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.userId };

    if (status) {
      query.status = status;
    }

    const goals = await Goal.find(query).sort({ deadline: 1 });
    res.json({ success: true, goals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single goal
router.get('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update goal
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, targetAmount, currentSavings, deadline, category, priority, icon, color, status } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        name,
        description,
        targetAmount,
        currentSavings,
        deadline: new Date(deadline),
        category,
        priority,
        icon,
        color,
        status,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    res.json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add savings to goal
router.post('/:id/contribute', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid contribution amount' });
    }

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if ((user.savingsBalance || 0) < numAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient savings balance. Please add money to your Savings Pot first.' });
    }

    // Deduct from user savings balance
    user.savingsBalance = (user.savingsBalance || 0) - numAmount;
    await user.save();

    // Add to goal savings
    goal.currentSavings += numAmount;
    if (goal.currentSavings >= goal.targetAmount) {
      goal.status = 'Completed';
    }
    await goal.save();

    // Create a SavingsLog record
    const log = new SavingsLog({
      userId: req.userId,
      type: 'allocation',
      amount: numAmount,
      description: `Allocated to savings goal: "${goal.name}"`
    });
    await log.save();

    res.json({ success: true, goal, savingsBalance: user.savingsBalance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
