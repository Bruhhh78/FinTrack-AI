const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Goal = require('../models/Goal');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get dashboard overview
router.get('/overview', auth, async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const incomes = await Income.find({
      userId: req.userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const goals = await Goal.find({ userId: req.userId, status: 'Active' });

    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    const categoryExpenses = {};
    expenses.forEach(exp => {
      categoryExpenses[exp.category] = (categoryExpenses[exp.category] || 0) + exp.amount;
    });

    const user = await User.findById(req.userId);
    const savingsBalance = user ? (user.savingsBalance || 0) : 0;

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        savings,
        savingsRate,
        categoryExpenses,
        activeGoals: goals.length,
        expenseCount: expenses.length,
        incomeCount: incomes.length,
        savingsBalance
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get monthly trends
router.get('/trends', auth, async (req, res) => {
  try {
    const months = [];
    const incomeData = [];
    const expenseData = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      months.push(new Date(year, month - 1, 1).toLocaleString('default', { month: 'short', year: '2-digit' }));

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const income = await Income.find({
        userId: req.userId,
        date: { $gte: startDate, $lte: endDate }
      });

      const expenses = await Expense.find({
        userId: req.userId,
        date: { $gte: startDate, $lte: endDate }
      });

      incomeData.push(income.reduce((sum, inc) => sum + inc.amount, 0));
      expenseData.push(expenses.reduce((sum, exp) => sum + exp.amount, 0));
    }

    res.json({
      success: true,
      data: { months, incomeData, expenseData }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get category breakdown
router.get('/categories', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = parseInt(month) || new Date().getMonth() + 1;
    const currentYear = parseInt(year) || new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const categoryData = {};
    expenses.forEach(exp => {
      categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
    });

    const chartData = Object.keys(categoryData).map(category => ({
      name: category,
      value: categoryData[category]
    }));

    res.json({
      success: true,
      data: chartData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get financial health score
router.get('/health-score', auth, async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const incomes = await Income.find({
      userId: req.userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const goals = await Goal.find({ userId: req.userId });

    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savings = Math.max(0, totalIncome - totalExpense);

    // Calculate score factors (each 0-25)
    const savingsScore = totalIncome > 0 ? Math.min(25, (savings / totalIncome) * 100) : 0;
    const budgetScore = totalExpense > 0 ? Math.min(25, Math.max(0, 25 - (totalExpense / totalIncome) * 25)) : 25;
    const goalsScore = goals.length > 0 ? Math.min(25, (goals.filter(g => g.status === 'Completed').length / goals.length) * 25) : 0;
    const expenseScore = Math.min(25, Math.max(0, 25 - (expenses.length / 100) * 25));

    const healthScore = Math.round(savingsScore + budgetScore + goalsScore + expenseScore);

    let rating = 'Needs Improvement';
    if (healthScore >= 90) rating = 'Excellent';
    else if (healthScore >= 75) rating = 'Good';
    else if (healthScore >= 50) rating = 'Average';

    res.json({
      success: true,
      data: {
        score: healthScore,
        rating,
        breakdown: {
          savingsScore,
          budgetScore,
          goalsScore,
          expenseScore
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
