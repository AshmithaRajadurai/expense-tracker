const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number,
      required: [true, 'Please specify a month (1-12)'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Please specify a year'],
    },
    amount: {
      type: Number,
      required: [true, 'Please specify budget amount in ₹ (INR)'],
      min: [0, 'Budget must be at least 0'],
    },
  },
  {
    timestamps: true,
  }
);

// Keep budget unique for a user per month/year combination
BudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
