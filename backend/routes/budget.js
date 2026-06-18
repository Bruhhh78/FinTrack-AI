const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Create/Update monthly budget
router.post('/', auth, async (req, res) => {
  try {
    const { month, categoryLimits, notes } = req.body;

    let budget = await Budget.findOne({
      userId: req.userId,
      month: new Date(month)
    });

    if (budget) {
      budget.categoryLimits = categoryLimits;
      budget.notes = notes;
      budget.totalBudget = categoryLimits.reduce((sum, cat) => sum + cat.limit, 0);
    } else {
      budget = new Budget({
        userId: req.userId,
        month: new Date(month),
        categoryLimits,
        totalBudget: categoryLimits.reduce((sum, cat) => sum + cat.limit, 0),
        notes
      });
    }

    await budget.save();
    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get monthly budget
router.get('/:month', auth, async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.params.month);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    let budget = await Budget.findOne({
      userId: req.userId,
      month: { $gte: startDate, $lte: endDate }
    });

    if (!budget) {
      // Create default budget if doesn't exist
      budget = new Budget({
        userId: req.userId,
        month: new Date(year, month - 1, 1),
        categoryLimits: [
          { category: 'Food', limit: 0 },
          { category: 'Shopping', limit: 0 },
          { category: 'Transportation', limit: 0 },
          { category: 'Bills', limit: 0 },
          { category: 'Entertainment', limit: 0 },
          { category: 'Education', limit: 0 },
          { category: 'Health', limit: 0 },
          { category: 'Other', limit: 0 }
        ]
      });
      budget.totalBudget = 0;
      await budget.save();
    }

    // Get expenses for this month
    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate spent per category
    let totalSpent = 0;
    expenses.forEach(exp => {
      const categoryLimit = budget.categoryLimits.find(cat => cat.category === exp.category);
      if (categoryLimit) {
        categoryLimit.spent = (categoryLimit.spent || 0) + exp.amount;
        categoryLimit.percentage = (categoryLimit.spent / categoryLimit.limit) * 100;
      }
      totalSpent += exp.amount;
    });

    budget.totalSpent = totalSpent;
    await budget.save();

    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all budgets
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId }).sort({ month: -1 });
    res.json({ success: true, budgets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
