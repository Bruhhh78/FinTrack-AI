const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get recurring transactions
router.get('/', auth, async (req, res) => {
  try {
    res.json({ success: true, recurring: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
