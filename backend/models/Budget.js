const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Date,
    required: true
  },
  categoryLimits: [{
    category: {
      type: String,
      enum: ['Food', 'Shopping', 'Transportation', 'Bills', 'Entertainment', 'Education', 'Health', 'Other'],
      required: true
    },
    limit: {
      type: Number,
      required: true
    },
    spent: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  }],
  totalBudget: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

budgetSchema.index({ userId: 1, month: -1 });

module.exports = mongoose.model('Budget', budgetSchema);
