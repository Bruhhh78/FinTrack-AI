const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const Goal = require('../models/Goal');
const Income = require('../models/Income');
const SavingsLog = require('../models/SavingsLog');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, currency, theme, savingsBalance } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        name, 
        currency, 
        theme, 
        savingsBalance: savingsBalance !== undefined ? Number(savingsBalance) : undefined,
        updatedAt: Date.now() 
      },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete user account
router.delete('/profile', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Delete all associated data
    await Promise.all([
      Expense.deleteMany({ userId }),
      Income.deleteMany({ userId }),
      Budget.deleteMany({ userId }),
      Goal.deleteMany({ userId }),
      SavingsLog.deleteMany({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
