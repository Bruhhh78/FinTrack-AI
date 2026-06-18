const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Goal = require('../models/Goal');
const Budget = require('../models/Budget');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GEMINI_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
].filter(Boolean);

async function generateGeminiText(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }

  let lastError;
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      const retryable = /404|429|503|not found|quota|high demand/i.test(err.message);
      if (!retryable) throw err;
      console.warn(`Gemini model "${modelName}" unavailable, trying next...`, err.message);
    }
  }
  throw lastError || new Error('No Gemini models available');
}

// @route   GET /api/ai/insights
// @desc    Get AI personalized financial insights and savings advice
// @access  Private
router.get('/insights', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch user details & recent data
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 }).limit(100);
    const incomes = await Income.find({ userId: req.userId }).sort({ date: -1 }).limit(100);
    const goals = await Goal.find({ userId: req.userId });
    const latestBudget = await Budget.findOne({ userId: req.userId }).sort({ month: -1 });

    const currency = user.currency || 'INR';
    const savingsBalance = user.savingsBalance || 0;

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

    const expenseByCategory = {};
    expenses.forEach(exp => {
      expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + exp.amount;
    });

    const goalsSummary = goals.map(g => ({
      title: g.title,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      status: g.status,
      deadline: g.deadline
    }));

    const budgetLimits = latestBudget ? latestBudget.categoryLimits.map(l => ({
      category: l.category,
      limit: l.limit,
      spent: l.spent
    })) : [];

    const financialContext = {
      currency,
      savingsBalance,
      recentExpensesSummary: {
        total: totalExpense,
        categories: expenseByCategory,
        sample: expenses.slice(0, 10).map(e => ({ title: e.title, amount: e.amount, category: e.category, date: e.date }))
      },
      recentIncomesSummary: {
        total: totalIncome,
        sample: incomes.slice(0, 10).map(i => ({ title: i.title, amount: i.amount, date: i.date }))
      },
      goals: goalsSummary,
      budgetLimits
    };

    const prompt = `
      You are an expert personal finance AI advisor. Analyze the following user financial data:
      ${JSON.stringify(financialContext, null, 2)}

      Based on this data, assess their financial health, predict future trends, highlight unnecessary spending, and generate personalized savings & investment recommendations.
      You MUST respond ONLY with a raw, valid JSON object (do not wrap in markdown tags like \`\`\`json or similar). The JSON object must strictly match this format:
      {
        "healthScore": <Number between 0 and 100 assessing their current health based on savings ratio and budget compliance>,
        "summary": "<A 2-3 sentence overview of their financial situation>",
        "predictions": "<A paragraph forecasting their future savings or budget risks based on their trends>",
        "warnings": ["<Specific warning 1>", "<Specific warning 2>"],
        "unnecessaryExpenses": ["<Specific transaction or category where spending is higher than average or looks like luxury/non-essential spending>"],
        "recommendations": ["<Actionable investment/savings tip 1>", "<Actionable investment/savings tip 2>"]
      }

      Ensure all advice is specific, helpful, and tailored to the data provided. Write recommendations in standard clean text.
    `;

    const text = await generateGeminiText(prompt);

    let parsedData;
    try {
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7);
      }
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
      }
      parsedData = JSON.parse(cleanedText.trim());
    } catch (parseErr) {
      console.error('Failed to parse Gemini response:', text, parseErr);
      parsedData = {
        healthScore: 70,
        summary: "Your profile is loaded, but we encountered an issue generating your customized report. Please review your dashboard details directly.",
        predictions: "We forecast a steady budget usage, but please monitor discretionary expenses.",
        warnings: ["Unable to load specific warnings. Keep monitoring expenses."],
        unnecessaryExpenses: ["Review your Entertainment and Shopping logs for non-essential transactions."],
        recommendations: [
          "Set aside 20% of your income automatically.",
          "Establish an emergency fund of 3-6 months of basic expenses.",
          "Consider low-risk mutual funds or index funds for wealth growth."
        ]
      };
    }

    res.json({ success: true, insights: parsedData });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/ai/chat
// @desc    Chat with the AI advisor about savings & investing (highly constrained)
// @access  Private
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const user = await User.findById(req.userId);
    const currency = user ? user.currency : 'INR';
    const savingsBalance = user ? user.savingsBalance : 0;
    const activeGoalsCount = await Goal.countDocuments({ userId: req.userId, status: 'Active' });

    const systemInstructions = `
You are FinTrack AI Advisor, a personal finance chatbot.
Your goal is to help the user manage savings, grow wealth, and invest.

Strict Rules:
1. ONLY answer questions about personal finance, budgeting, savings, investing, wealth building, retirement planning, emergency funds, debt management, and stock/mutual fund basics.
2. If the user asks about ANY unrelated topic (e.g. coding, programming, history, science, pop culture, general conversation outside finance, weather, writing stories, jokes, math puzzles), you MUST politely refuse, stating: 'I am here specifically to help you manage your savings and grow your wealth. Let's get back to your financial goals!'
3. Do not break character under any circumstances.
4. Keep responses structured, professional, and concise. Use bullet points where appropriate.

Context about the user:
- Current Currency: ${currency}
- Current Savings/Capital Balance: ${savingsBalance}
- Active Savings Goals Count: ${activeGoalsCount}
Use this context only if they ask about their own data, but do not share it unnecessarily.
`;

    // Compile history
    let prompt = systemInstructions + "\n\nConversation History:\n";
    if (history && Array.isArray(history)) {
      history.forEach(h => {
        const senderName = h.sender === 'user' ? 'User' : 'Advisor';
        prompt += `${senderName}: ${h.text}\n`;
      });
    }
    prompt += `User: ${message}\nAdvisor:`;

    const replyText = await generateGeminiText(prompt);

    res.json({ success: true, reply: replyText.trim() });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
