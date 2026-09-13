import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { formatCurrency } from '../utils/helpers';

// Vibrant premium color palette
const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#3b82f6', // Blue
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#64748b', // Slate
];

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label || payload[0].name}</p>
        <ul className="chart-tooltip-items">
          {payload.map((entry, index) => (
            <li key={index} style={{ color: entry.color || entry.fill }}>
              <span className="tooltip-item-name">{entry.name}: </span>
              <span className="tooltip-item-value">{formatCurrency(entry.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

/**
 * 1. Category Distribution Pie/Donut Chart
 */
export const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="no-chart-data">No expense data available for categorization</div>;
  }

  // Calculate total to display in center of donut
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            nameKey="category"
            dataKey="amount"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={3}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center-label">
        <span className="donut-center-title">Total Spent</span>
        <span className="donut-center-value">{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

/**
 * 2. Monthly Income vs Expense Bar Chart
 */
export const IncomeExpenseBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="no-chart-data">No monthly comparison data available</div>;
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" tickLine={false} stroke="#94a3b8" fontSize={12} />
          <YAxis
            tickLine={false}
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000) + 'k' : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} align="right" iconType="circle" />
          <Bar name="Income" dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar name="Expense" dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * 3. Spending Trends Line / Area Chart
 */
export const SpendingTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="no-chart-data">No trend data available</div>;
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" tickLine={false} stroke="#94a3b8" fontSize={12} />
          <YAxis
            tickLine={false}
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000) + 'k' : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} align="right" iconType="circle" />
          <Area
            type="monotone"
            name="Expense"
            dataKey="Expense"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpense)"
          />
          <Line 
            type="monotone"
            name="Income"
            dataKey="Income"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
