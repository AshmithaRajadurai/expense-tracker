const express = require('express');
const router = express.Router();
const {
  getBudget,
  createOrUpdateBudget,
  updateBudgetById,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getBudget)
  .post(protect, createOrUpdateBudget);

router.route('/:id')
  .put(protect, updateBudgetById);

module.exports = router;
