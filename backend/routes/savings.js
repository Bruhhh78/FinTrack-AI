const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SavingsLog = require('../models/SavingsLog');
const auth = require('../middleware/auth');

// Get savings details & logs
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const logs = await SavingsLog.find({ userId: req.userId }).sort({ date: -1 });

    res.json({
      success: true,
      savingsBalance: user.savingsBalance || 0,
      logs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Record a deposit or withdrawal
router.post('/transaction', auth, async (req, res) => {
  try {
    const { type, amount, description } = req.body;

    if (!['deposit', 'withdrawal'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction type' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (type === 'withdrawal' && (user.savingsBalance || 0) < numAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient savings balance' });
    }

    // Update user balance
    if (type === 'deposit') {
      user.savingsBalance = (user.savingsBalance || 0) + numAmount;
    } else {
      user.savingsBalance = (user.savingsBalance || 0) - numAmount;
    }
    await user.save();

    // Create log
    const log = new SavingsLog({
      userId: req.userId,
      type,
      amount: numAmount,
      description: description || (type === 'deposit' ? 'Savings Deposit' : 'Savings Withdrawal')
    });
    await log.save();

    res.json({
      success: true,
      savingsBalance: user.savingsBalance,
      log
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
