const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a transaction title'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount in ₹ (INR)'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Food',
        'Transport',
        'Shopping',
        'Entertainment',
        'Bills',
        'Education',
        'Healthcare',
        'Travel',
        'Salary',
        'Freelance',
        'Other',
      ],
    },
    type: {
      type: String,
      required: [true, 'Please select transaction type'],
      enum: ['Income', 'Expense'],
    },
    date: {
      type: Date,
      required: [true, 'Please select a date'],
    },
    description: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please select a payment method'],
      enum: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', ExpenseSchema);
