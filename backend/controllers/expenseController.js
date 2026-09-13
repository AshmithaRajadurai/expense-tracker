const Expense = require('../models/Expense');

// @desc    Create new transaction (income/expense)
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date, description, paymentMethod } = req.body;

    // Validation
    if (!title || !amount || !category || !type || !date || !paymentMethod) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount,
      category,
      type,
      date,
      description,
      paymentMethod,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user transactions with filters, search, sorting and pagination
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { search, category, type, startDate, endDate, sortBy, page = 1, limit = 10 } = req.query;

    const queryObject = { userId: req.user._id };

    // Search filter (title or description)
    if (search) {
      queryObject.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      queryObject.category = category;
    }

    // Type filter (Income or Expense)
    if (type && type !== 'All') {
      queryObject.type = type;
    }

    // Date range filter
    if (startDate || endDate) {
      queryObject.date = {};
      if (startDate) {
        queryObject.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of that day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        queryObject.date.$lte = end;
      }
    }

    // Sorting
    let sortQuery = { date: -1 }; // Default: Latest first
    if (sortBy === 'amount_asc') {
      sortQuery = { amount: 1 };
    } else if (sortBy === 'amount_desc') {
      sortQuery = { amount: -1 };
    } else if (sortBy === 'date_asc') {
      sortQuery = { date: 1 };
    } else if (sortBy === 'date_desc') {
      sortQuery = { date: -1 };
    }

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Expense.countDocuments(queryObject);
    const expenses = await Expense.find(queryObject)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNumber);

    res.json({
      expenses,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date, description, paymentMethod } = req.body;

    let expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update fields
    expense.title = title || expense.title;
    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.category = category || expense.category;
    expense.type = type || expense.type;
    expense.date = date || expense.date;
    expense.description = description !== undefined ? description : expense.description;
    expense.paymentMethod = paymentMethod || expense.paymentMethod;

    if (expense.amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const result = await Expense.deleteOne({ _id: req.params.id, userId: req.user._id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard summary counters
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total income/expense calculation
    const aggregates = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    aggregates.forEach((item) => {
      if (item._id === 'Income') totalIncome = item.total;
      if (item._id === 'Expense') totalExpenses = item.total;
    });

    const balance = totalIncome - totalExpenses;

    // Current Month Expenses calculation
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyExpenseAgg = await Expense.aggregate([
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

    const currentMonthExpenses = monthlyExpenseAgg.length > 0 ? monthlyExpenseAgg[0].total : 0;

    // Fetch 5 recent transactions
    const recentTransactions = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      currentMonthExpenses,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get category-wise expense details for current user
// @route   GET /api/dashboard/category-summary
// @access  Private
const getCategorySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const categoryAgg = await Expense.aggregate([
      { $match: { userId, type: 'Expense' } },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    const formattedData = categoryAgg.map((item) => ({
      category: item._id,
      amount: item.amount,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly comparison of income vs expense
// @route   GET /api/dashboard/monthly-summary
// @access  Private
const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Grouping by year and month
    const monthlyAgg = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format data into calendar months format
    // [{ month: 'Jan 2026', Income: X, Expense: Y }]
    const monthsMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    monthlyAgg.forEach((item) => {
      const year = item._id.year;
      const monthIdx = item._id.month - 1;
      const monthLabel = `${monthNames[monthIdx]} ${year}`;
      const type = item._id.type; // 'Income' or 'Expense'

      if (!monthsMap[monthLabel]) {
        monthsMap[monthLabel] = {
          month: monthLabel,
          Income: 0,
          Expense: 0,
          year: year,
          monthNum: monthIdx,
        };
      }

      monthsMap[monthLabel][type] = item.total;
    });

    // Sort key list based on date chronological order
    const formattedData = Object.values(monthsMap).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNum - b.monthNum;
    });

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getDashboardSummary,
  getCategorySummary,
  getMonthlySummary,
};
