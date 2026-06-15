const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  targetAmount: {
    type: Number,
    required: true
  },
  currentSavings: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['Education', 'Travel', 'Purchase', 'Emergency', 'Investment', 'Other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  icon: String,
  color: String,
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Abandoned'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

goalSchema.virtual('progressPercentage').get(function() {
  return (this.currentSavings / this.targetAmount) * 100;
});

goalSchema.virtual('remainingAmount').get(function() {
  return this.targetAmount - this.currentSavings;
});

goalSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Goal', goalSchema);
