const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const auth = require('../middleware/auth');

// Create income
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, source, description, date, tags } = req.body;

    const income = new Income({
      userId: req.userId,
      title,
      amount,
      source,
      description,
      date: new Date(date),
      tags: tags || []
    });

    await income.save();
    res.status(201).json({ success: true, income });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all income
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, source } = req.query;
    const query = { userId: req.userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (source) {
      query.source = source;
    }

    const incomes = await Income.find(query).sort({ date: -1 });
    res.json({ success: true, incomes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single income
router.get('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, userId: req.userId });
    if (!income) {
      return res.status(404).json({ success: false, message: 'Income not found' });
    }
    res.json({ success: true, income });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update income
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, amount, source, description, date, tags } = req.body;

    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, amount, source, description, date: new Date(date), tags, updatedAt: Date.now() },
      { new: true }
    );

    if (!income) {
      return res.status(404).json({ success: false, message: 'Income not found' });
    }

    res.json({ success: true, income });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete income
router.delete('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!income) {
      return res.status(404).json({ success: false, message: 'Income not found' });
    }
    res.json({ success: true, message: 'Income deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get monthly income
router.get('/monthly/:month', auth, async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.params.month);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const incomes = await Income.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const bySource = {};
    let total = 0;

    incomes.forEach(inc => {
      total += inc.amount;
      bySource[inc.source] = (bySource[inc.source] || 0) + inc.amount;
    });

    res.json({ success: true, total, bySource, incomes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
