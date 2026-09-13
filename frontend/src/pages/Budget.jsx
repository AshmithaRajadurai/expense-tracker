import React, { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import { formatCurrency, getCurrentPeriod } from '../utils/helpers';
import { Wallet, Pencil, Save, AlertTriangle, Calendar, Sparkles } from 'lucide-react';

const monthsList = [
  { val: 1, label: 'January' },
  { val: 2, label: 'February' },
  { val: 3, label: 'March' },
  { val: 4, label: 'April' },
  { val: 5, label: 'May' },
  { val: 6, label: 'June' },
  { val: 7, label: 'July' },
  { val: 8, label: 'August' },
  { val: 9, label: 'September' },
  { val: 10, label: 'October' },
  { val: 11, label: 'November' },
  { val: 12, label: 'December' },
];

const Budget = () => {
  const currentPeriod = getCurrentPeriod();
  
  // Date selector state
  const [selectedMonth, setSelectedMonth] = useState(currentPeriod.month);
  const [selectedYear, setSelectedYear] = useState(currentPeriod.year);

  // Budget details state
  const [budgetData, setBudgetData] = useState({
    _id: null,
    amount: 0,
    spent: 0,
    remaining: 0,
    percentage: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  const fetchBudgetDetails = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const response = await budgetAPI.get({
        month: selectedMonth,
        year: selectedYear,
      });
      setBudgetData(response.data);
      setEditAmount(response.data.amount.toString());
      setIsEditing(response.data.amount === 0); // Open editing automatically if budget is 0
    } catch (err) {
      console.error(err);
      setError('Failed to fetch budget settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetDetails();
  }, [selectedMonth, selectedYear]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setAmountError('');
    setSuccessMsg('');
    setError('');

    const parsedAmount = parseFloat(editAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setAmountError('Budget amount must be a positive number');
      return;
    }

    setIsSaving(true);
    try {
      await budgetAPI.createOrUpdate({
        amount: parsedAmount,
        month: selectedMonth,
        year: selectedYear,
      });

      setSuccessMsg('Budget limit saved successfully!');
      setIsEditing(false);
      // Reload budget calculations
      fetchBudgetDetails();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save budget settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const yearsList = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 3; y <= currentYear + 1; y++) {
    yearsList.push(y);
  }

  // Warning thresholds
  const isClose = budgetData.percentage >= 80 && budgetData.percentage < 100;
  const isExceeded = budgetData.percentage >= 100;

  return (
    <div className="budget-page-container">
      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="page-header-actions">
        <div>
          <h1>Monthly Budget Tracker</h1>
          <p className="subtitle">Set targets, monitor expenses, and check remaining savings</p>
        </div>

        {/* Month/Year selector widget */}
        <div className="period-selector-container">
          <Calendar size={16} className="calendar-icon-period" />
          <select
            className="select-period"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthsList.map((m) => (
              <option key={m.val} value={m.val}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            className="select-period"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {yearsList.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="page-loading">
          <div className="spinner"></div>
          <p>Loading budget calculations...</p>
        </div>
      ) : (
        <div className="budget-grid-layout">
          {/* Main Card: Summary & Visuals */}
          <div className="budget-details-card">
            <div className="section-card">
              <div className="card-header flex-header">
                <div className="header-icon-title">
                  <Wallet size={22} className="text-indigo" />
                  <h3>Monthly Budget details</h3>
                </div>
                {!isEditing && budgetData.amount > 0 && (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil size={14} />
                    <span>Edit Budget</span>
                  </button>
                )}
              </div>
              <div className="card-body">
                {/* Budget overview numbers */}
                <div className="budget-large-stats">
                  <div className="large-stat-item">
                    <span className="large-stat-label">Total Monthly Budget</span>
                    <span className="large-stat-value">{formatCurrency(budgetData.amount)}</span>
                  </div>
                  <div className="large-stat-item">
                    <span className="large-stat-label">Spent Till Date</span>
                    <span className="large-stat-value text-red">{formatCurrency(budgetData.spent)}</span>
                  </div>
                  <div className="large-stat-item">
                    <span className="large-stat-label">Remaining Balance</span>
                    <span className={`large-stat-value ${budgetData.remaining < 0 ? 'text-red' : 'text-green'}`}>
                      {formatCurrency(budgetData.remaining)}
                    </span>
                  </div>
                </div>

                {/* Warning status alerts */}
                {isExceeded && (
                  <div className="alert alert-danger budget-wide-alert mt-4">
                    <AlertTriangle size={20} />
                    <div>
                      <strong>Budget Limit Exceeded!</strong> You are over budget by {formatCurrency(Math.abs(budgetData.remaining))} for this month. Focus on reducing non-essential costs.
                    </div>
                  </div>
                )}
                {isClose && (
                  <div className="alert alert-warning budget-wide-alert mt-4">
                    <AlertTriangle size={20} />
                    <div>
                      <strong>Approaching Budget Limit!</strong> You have spent {budgetData.percentage}% of your monthly allocation. Limit further expenditures.
                    </div>
                  </div>
                )}

                {/* Progress bar visualizer */}
                {budgetData.amount > 0 && (
                  <div className="budget-detailed-progress mt-6">
                    <div className="progress-bar-label-row">
                      <span className="progress-status-title">Budget Utilization</span>
                      <span className="progress-percentage">{budgetData.percentage}%</span>
                    </div>
                    <div className="progress-bar-bg-large">
                      <div 
                        className={`progress-bar-fill-large ${
                          isExceeded ? 'bg-danger' : isClose ? 'bg-warning' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(budgetData.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="progress-bar-subtext">
                      {isExceeded 
                        ? '100% of your budget has been exhausted.' 
                        : `You have ${formatCurrency(budgetData.remaining)} available to spend.`}
                    </div>
                  </div>
                )}

                {budgetData.amount === 0 && !isEditing && (
                  <div className="empty-budget-state py-8 text-center">
                    <Wallet size={48} className="text-gray mb-4 mx-auto" />
                    <h4>No Budget Configured</h4>
                    <p className="mb-4">Setting up a monthly budget is the first step towards healthy savings.</p>
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                      Configure Budget
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Side Card: Update Budget Limit */}
          {isEditing && (
            <div className="budget-form-card">
              <div className="section-card">
                <div className="card-header">
                  <h3>{budgetData.amount > 0 ? 'Update Budget Limit' : 'Configure New Budget'}</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSaveBudget} className="budget-settings-form">
                    <div className="form-group">
                      <label className="form-label" htmlFor="editAmount">
                        Budget Limit Amount (₹)
                      </label>
                      <div className="amount-input-wrapper">
                        <span className="currency-symbol-input">₹</span>
                        <input
                          type="number"
                          id="editAmount"
                          className={`form-input amount-field ${amountError ? 'input-error' : ''}`}
                          placeholder="e.g. 30000"
                          value={editAmount}
                          onChange={(e) => {
                            setEditAmount(e.target.value);
                            setAmountError('');
                          }}
                        />
                      </div>
                      {amountError && <span className="error-text">{amountError}</span>}
                    </div>

                    <div className="period-display-info mt-4">
                      <span className="info-label">Applicable Period:</span>
                      <span className="info-val font-semibold">
                        {monthsList.find((m) => m.val === selectedMonth)?.label} {selectedYear}
                      </span>
                    </div>

                    <div className="form-actions mt-6">
                      {budgetData.amount > 0 && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditAmount(budgetData.amount.toString());
                            setIsEditing(false);
                            setAmountError('');
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="btn btn-primary flex-center-btn"
                        disabled={isSaving}
                      >
                        <Save size={16} className="btn-icon" />
                        <span>{isSaving ? 'Saving...' : 'Save Limit'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="section-card mt-6 bg-gradient-tip">
                <div className="card-body tips-body">
                  <div className="tip-header-flex">
                    <Sparkles size={18} className="text-amber" />
                    <h4>Saving Tips</h4>
                  </div>
                  <ul className="tips-list">
                    <li>Maintain an emergency reserve equal to at least 3-6 months of expenses.</li>
                    <li>Follow the 50/30/20 rule: 50% essentials, 30% wants, 20% savings/investments.</li>
                    <li>Utilize the Category Analytics page to inspect your highest spending buckets.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Budget;
