const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get budget for a specific month and year
// @route   GET /api/budget
// @access  Private
const getBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    // Default to current month and year if not query parameters
    const today = new Date();
    const month = parseInt(req.query.month) || today.getMonth() + 1; // 1-12
    const year = parseInt(req.query.year) || today.getFullYear();

    let budget = await Budget.findOne({ userId, month, year });

    // Calculate actual expenses for that specific month/year
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const expenseAgg = await Expense.aggregate([
      {
        $match: {
          userId,
          type: 'Expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const spent = expenseAgg.length > 0 ? expenseAgg[0].total : 0;

    if (!budget) {
      // If no budget is found, return a default mock object with 0 budget
      return res.json({
        _id: null,
        userId,
        month,
        year,
        amount: 0,
        spent,
        remaining: -spent,
        percentage: 0,
      });
    }

    const remaining = budget.amount - spent;
    const percentage = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;

    res.json({
      _id: budget._id,
      userId: budget.userId,
      month: budget.month,
      year: budget.year,
      amount: budget.amount,
      spent,
      remaining,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update budget
// @route   POST /api/budget
// @access  Private
const createOrUpdateBudget = async (req, res) => {
  try {
    const { amount, month, year } = req.body;
    const userId = req.user._id;

    if (amount === undefined || amount < 0) {
      return res.status(400).json({ message: 'Budget amount must be 0 or greater' });
    }

    const today = new Date();
    const targetMonth = month || today.getMonth() + 1;
    const targetYear = year || today.getFullYear();

    // Use findOneAndUpdate with upsert
    const budget = await Budget.findOneAndUpdate(
      { userId, month: targetMonth, year: targetYear },
      { amount },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update budget by ID
// @route   PUT /api/budget/:id
// @access  Private
const updateBudgetById = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    if (amount === undefined || amount < 0) {
      return res.status(400).json({ message: 'Budget amount must be 0 or greater' });
    }

    let budget = await Budget.findOne({ _id: req.params.id, userId });

    if (!budget) {
      return res.status(404).json({ message: 'Budget record not found' });
    }

    budget.amount = amount;
    const updatedBudget = await budget.save();

    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBudget,
  createOrUpdateBudget,
  updateBudgetById,
};
