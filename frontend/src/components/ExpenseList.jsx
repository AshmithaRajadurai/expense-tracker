import React from 'react';
import { Link } from 'react-router-dom';
import ExpenseItem from './ExpenseItem';
import { Receipt, Plus } from 'lucide-react';

const ExpenseList = ({ expenses, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="table-loader-container">
        <div className="spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-circle">
          <Receipt size={40} className="empty-icon" />
        </div>
        <h3>No transactions yet</h3>
        <p>Start tracking your money by adding your first transaction.</p>
        <Link to="/add-transaction" className="btn btn-primary add-transaction-empty-btn">
          <Plus size={18} />
          <span>Add Transaction</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="transactions-table">
        <thead>
          <tr>
            <th className="col-title">Title</th>
            <th className="col-category">Category</th>
            <th className="col-payment">Payment Method</th>
            <th className="col-date">Date</th>
            <th className="col-amount">Amount</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
