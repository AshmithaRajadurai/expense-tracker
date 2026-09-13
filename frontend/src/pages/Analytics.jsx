import React, { useState, useEffect } from 'react';
import { dashboardAPI, expenseAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import { CategoryPieChart, IncomeExpenseBarChart, SpendingTrendChart } from '../components/Charts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Coins, 
  Calendar, 
  Receipt,
  Percent
} from 'lucide-react';

const Analytics = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [summaryRes, categoryRes, monthlyRes, expensesRes] = await Promise.all([
          dashboardAPI.getSummary(),
          dashboardAPI.getCategorySummary(),
          dashboardAPI.getMonthlySummary(),
          expenseAPI.getAll({ limit: 1 }), // to get total transaction count
        ]);

        setSummary(summaryRes.data);
        setCategoryData(categoryRes.data);
        setMonthlyData(monthlyRes.data);
        setTotalTransactions(expensesRes.data.total || 0);
      } catch (err) {
        console.error(err);
        setError('Failed to load financial statistics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Analyzing your financial accounts...</p>
      </div>
    );
  }

  // Calculate statistics
  const highestSpend = categoryData.length > 0 ? categoryData[0] : null;
  
  // Calculate average spending per month
  const totalMonths = monthlyData.length;
  const averageMonthlySpend = totalMonths > 0 
    ? monthlyData.reduce((sum, item) => sum + (item.Expense || 0), 0) / totalMonths
    : 0;

  const totalExpenseSum = summary.totalExpenses;
  const savingsRate = summary.totalIncome > 0 
    ? Math.round(((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100) 
    : 0;

  return (
    <div className="analytics-page-container">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="page-header-actions">
        <div>
          <h1>Financial Analytics</h1>
          <p className="subtitle">Visual representation of your income, spending trends, and categories</p>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="stats-metric-grid">
        <div className="metric-card">
          <div className="metric-header-flex">
            <span className="metric-label">Highest Spending Bucket</span>
            <PieIcon size={20} className="text-indigo" />
          </div>
          <div className="metric-body">
            <h3 className="metric-value">
              {highestSpend ? highestSpend.category : 'N/A'}
            </h3>
            {highestSpend && (
              <p className="metric-subtext text-red">
                Spent {formatCurrency(highestSpend.amount)} total
              </p>
            )}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header-flex">
            <span className="metric-label">Average Monthly Expenses</span>
            <Calendar size={20} className="text-blue" />
          </div>
          <div className="metric-body">
            <h3 className="metric-value">
              {formatCurrency(averageMonthlySpend)}
            </h3>
            <p className="metric-subtext text-gray">
              Over {totalMonths} tracking month{totalMonths !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header-flex">
            <span className="metric-label">Savings Rate</span>
            <Percent size={20} className="text-green" />
          </div>
          <div className="metric-body">
            <h3 className="metric-value">
              {savingsRate}%
            </h3>
            <p className={`metric-subtext ${savingsRate >= 20 ? 'text-green' : 'text-amber'}`}>
              {savingsRate >= 20 ? 'Healthy savings index' : 'Increase savings targets'}
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header-flex">
            <span className="metric-label">Total Transactions</span>
            <Receipt size={20} className="text-violet" />
          </div>
          <div className="metric-body">
            <h3 className="metric-value">
              {totalTransactions}
            </h3>
            <p className="metric-subtext text-gray">
              Logged records in database
            </p>
          </div>
        </div>
      </div>

      {/* Charts Display Grid */}
      <div className="analytics-charts-grid">
        {/* Monthly Income vs Expense Bar Chart */}
        <div className="section-card chart-card-wide">
          <div className="card-header">
            <h3>Monthly Income vs Expenses</h3>
          </div>
          <div className="card-body">
            {monthlyData.length > 0 ? (
              <IncomeExpenseBarChart data={monthlyData} />
            ) : (
              <div className="empty-chart-fallback">
                <p>Not enough data. Please log transactions under Income and Expense to populate the bar chart.</p>
              </div>
            )}
          </div>
        </div>

        {/* Category breakdown pie chart */}
        <div className="section-card">
          <div className="card-header">
            <h3>Expenses by Category</h3>
          </div>
          <div className="card-body">
            {categoryData.length > 0 ? (
              <CategoryPieChart data={categoryData} />
            ) : (
              <div className="empty-chart-fallback">
                <p>No expenses logged. Add expense items to see your category share breakdown.</p>
              </div>
            )}
          </div>
        </div>

        {/* General Trends area chart */}
        <div className="section-card chart-card-wide">
          <div className="card-header">
            <h3>Income & Spending Trends</h3>
          </div>
          <div className="card-body">
            {monthlyData.length > 0 ? (
              <SpendingTrendChart data={monthlyData} />
            ) : (
              <div className="empty-chart-fallback">
                <p>Not enough trend history. Create transactions across different months to view the trend area chart.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
