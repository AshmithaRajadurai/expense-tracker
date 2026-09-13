import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
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
];

const paymentMethods = [
  'Cash',
  'UPI',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Other',
];

const ExpenseForm = ({ initialData, onSubmit, submitText = 'Submit', isSubmitting = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'Expense',
    date: new Date().toISOString().split('T')[0], // yyyy-mm-dd format
    paymentMethod: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Format date to yyyy-mm-dd
      const formattedDate = initialData.date 
        ? new Date(initialData.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || '',
        type: initialData.type || 'Expense',
        date: formattedDate,
        paymentMethod: initialData.paymentMethod || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      // Reset category if switching type to guide correct selection
      category: type === 'Income' && prev.category !== 'Salary' && prev.category !== 'Freelance' && prev.category !== 'Other'
        ? '' 
        : prev.category,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-group type-toggle-group">
        <label className="form-label">Transaction Type</label>
        <div className="toggle-container">
          <button
            type="button"
            className={`toggle-btn ${formData.type === 'Expense' ? 'active expense' : ''}`}
            onClick={() => handleTypeChange('Expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`toggle-btn ${formData.type === 'Income' ? 'active income' : ''}`}
            onClick={() => handleTypeChange('Income')}
          >
            Income
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className={`form-input ${errors.title ? 'input-error' : ''}`}
          placeholder="e.g. Weekly Groceries, Freelance Salary"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label" htmlFor="amount">Amount (₹)</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol-input">₹</span>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              className={`form-input amount-field ${errors.amount ? 'input-error' : ''}`}
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className={`form-input ${errors.date ? 'input-error' : ''}`}
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label" htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className={`form-input ${errors.category ? 'input-error' : ''}`}
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            className={`form-input ${errors.paymentMethod ? 'input-error' : ''}`}
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          {errors.paymentMethod && <span className="error-text">{errors.paymentMethod}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          className="form-input textarea-field"
          placeholder="Enter description here..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : submitText}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
