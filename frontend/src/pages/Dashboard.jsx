import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardAPI, budgetAPI, expenseAPI } from '../services/api';
import SummaryCard from '../components/SummaryCard';
import Modal from '../components/Modal';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CategoryPieChart, SpendingTrendChart } from '../components/Charts';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Coins,
  ArrowRight,
  Plus,
  Receipt,
  AlertTriangle,
  Pencil,
  Trash2
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    currentMonthExpenses: 0,
    recentTransactions: [],
  });
  
  const [budget, setBudget] = useState({
    amount: 0,
    spent: 0,
    remaining: 0,
    percentage: 0,
  });

  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [summaryRes, budgetRes, trendRes] = await Promise.all([
        dashboardAPI.getSummary(),
        budgetAPI.get(),
        dashboardAPI.getMonthlySummary(),
      ]);
      
      setSummary(summaryRes.data);
      setBudget(budgetRes.data);
      setMonthlyTrend(trendRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteClick = (id) => {
    setTransactionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await expenseAPI.delete(transactionToDelete);
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete transaction. Please try again.');
    } finally {
      setTransactionToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading your financial dashboard...</p>
      </div>
    );
  }

  // Budget status variables
  const isCloseToBudget = budget.percentage >= 80 && budget.percentage < 100;
  const isOverBudget = budget.percentage >= 100;

  return (
    <div className="dashboard-container">
      {error && <div className="alert alert-error">{error}</div>}

      {/* Welcome header */}
      <div className="dashboard-welcome">
        <div>
          <h1>Financial Overview</h1>
          <p className="subtitle">Track, analyze, and optimize your expenditures in INR (₹).</p>
        </div>
        <div className="quick-actions-bar">
          <Link to="/add-transaction" className="btn btn-primary">
            <Plus size={18} />
            <span>Add Transaction</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="summary-cards-grid">
        <SummaryCard
          title="Current Balance"
          amount={summary.balance}
          icon={Coins}
          type="balance"
        />
        <SummaryCard
          title="Total Income"
          amount={summary.totalIncome}
          icon={TrendingUp}
          type="income"
        />
        <SummaryCard
          title="Total Expenses"
          amount={summary.totalExpenses}
          icon={TrendingDown}
          type="expense"
        />
        <SummaryCard
          title="This Month Spent"
          amount={summary.currentMonthExpenses}
          icon={Wallet}
          type="expense"
        />
      </div>

      <div className="dashboard-grid-main">
        {/* Main section: Charts and Trends */}
        <div className="dashboard-charts-column">
          <div className="section-card">
            <div className="card-header">
              <h3>Monthly Income vs Expenses Trend</h3>
            </div>
            <div className="card-body">
              {monthlyTrend.length > 0 ? (
                <SpendingTrendChart data={monthlyTrend} />
              ) : (
                <div className="empty-chart-fallback">
                  <p>Not enough data to map trends. Add transactions for different months to see line visualizers.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent transactions list */}
          <div className="section-card">
            <div className="card-header flex-header">
              <h3>Recent Transactions</h3>
              <Link to="/transactions" className="link-action-icon">
                <span>View All</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card-body">
              {summary.recentTransactions && summary.recentTransactions.length > 0 ? (
                <div className="table-responsive">
                  <table className="transactions-table-simple">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.recentTransactions.map((tx) => {
                        const isInc = tx.type === 'Income';
                        return (
                          <tr key={tx._id} className="simple-row">
                            <td>
                              <span className="tx-title-text">{tx.title}</span>
                            </td>
                            <td>
                              <span className="badge-category">{tx.category}</span>
                            </td>
                            <td>
                              <span className="tx-date">{formatDate(tx.date)}</span>
                            </td>
                            <td className={isInc ? 'amount-income font-medium' : 'amount-expense font-medium'}>
                              {isInc ? '+' : '-'}{formatCurrency(tx.amount)}
                            </td>
                            <td>
                              <div className="actions-group">
                                <button 
                                  className="action-btn edit-btn" 
                                  onClick={() => navigate(`/add-transaction`, { state: { editExpense: tx } })}
                                >
                                  <Pencil size={13} />
                                </button>
                                <button 
                                  className="action-btn delete-btn" 
                                  onClick={() => handleDeleteClick(tx._id)}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state-mini">
                  <Receipt size={32} />
                  <p>No recent transactions. Add your first record to populate the dashboard.</p>
                  <Link to="/add-transaction" className="btn btn-secondary btn-sm">Add Transaction</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar section: Budget progress and quick widgets */}
        <div className="dashboard-widgets-column">
          <div className="section-card">
            <div className="card-header">
              <h3>Monthly Budget Status</h3>
            </div>
            <div className="card-body">
              {budget.amount > 0 ? (
                <div className="budget-widget-content">
                  <div className="budget-target">
                    <span className="budget-label">Set Budget</span>
                    <span className="budget-val">{formatCurrency(budget.amount)}</span>
                  </div>
                  <div className="budget-row-flex">
                    <div className="budget-stat">
                      <span className="stat-label">Spent</span>
                      <span className="stat-value text-red">{formatCurrency(budget.spent)}</span>
                    </div>
                    <div className="budget-stat">
                      <span className="stat-label">Remaining</span>
                      <span className={`stat-value ${budget.remaining < 0 ? 'text-red' : 'text-green'}`}>
                        {formatCurrency(budget.remaining)}
                      </span>
                    </div>
                  </div>

                  {/* Warning Alerts */}
                  {isOverBudget && (
                    <div className="alert alert-danger budget-alert">
                      <AlertTriangle size={16} />
                      <span>Budget exceeded by {formatCurrency(Math.abs(budget.remaining))}!</span>
                    </div>
                  )}
                  {isCloseToBudget && (
                    <div className="alert alert-warning budget-alert">
                      <AlertTriangle size={16} />
                      <span>Warning: You have used {budget.percentage}% of your budget.</span>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="budget-progress-container">
                    <div className="progress-bar-label-row">
                      <span>Progress</span>
                      <span>{budget.percentage}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className={`progress-bar-fill ${
                          isOverBudget ? 'bg-danger' : isCloseToBudget ? 'bg-warning' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link to="/budget" className="btn btn-secondary btn-block text-center mt-4">
                    Manage Budget
                  </Link>
                </div>
              ) : (
                <div className="empty-budget-widget">
                  <Wallet size={32} />
                  <p>You haven't set a budget for this month yet.</p>
                  <Link to="/budget" className="btn btn-primary btn-sm">Set Monthly Budget</Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="section-card quick-links-card">
            <div className="card-header">
              <h3>Quick Navigation</h3>
            </div>
            <div className="card-body nav-buttons-grid">
              <Link to="/transactions" className="quick-nav-item">
                <Receipt size={20} />
                <span>View Transactions</span>
              </Link>
              <Link to="/analytics" className="quick-nav-item">
                <TrendingUp size={20} />
                <span>View Analytics</span>
              </Link>
              <Link to="/profile" className="quick-nav-item">
                <Plus size={20} />
                <span>User Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Transaction?"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Dashboard;
