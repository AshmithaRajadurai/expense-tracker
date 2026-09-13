const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getDashboardSummary,
  getCategorySummary,
  getMonthlySummary,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// Dashboard endpoints
router.get('/dashboard/summary', protect, getDashboardSummary);
router.get('/dashboard/category-summary', protect, getCategorySummary);
router.get('/dashboard/monthly-summary', protect, getMonthlySummary);

// CRUD endpoints for expenses
router.route('/expenses')
  .post(protect, createExpense)
  .get(protect, getExpenses);

router.route('/expenses/:id')
  .get(protect, getExpenseById)
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

module.exports = router;
