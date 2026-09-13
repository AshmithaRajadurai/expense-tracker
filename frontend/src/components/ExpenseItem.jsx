import React from 'react';
import { formatDate, formatCurrency } from '../utils/helpers';
import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  FileText,
  GraduationCap,
  Activity,
  Plane,
  Briefcase,
  Laptop,
  HelpCircle,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const categoryIcons = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Film,
  Bills: FileText,
  Education: GraduationCap,
  Healthcare: Activity,
  Travel: Plane,
  Salary: Briefcase,
  Freelance: Laptop,
  Other: HelpCircle,
};

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const { _id, title, amount, category, type, date, paymentMethod, description } = expense;
  
  const IconComponent = categoryIcons[category] || HelpCircle;
  const isIncome = type === 'Income';

  return (
    <tr className="transaction-row">
      <td className="col-title">
        <div className="title-cell">
          <div className={`category-icon-wrapper ${isIncome ? 'icon-wrapper-income' : 'icon-wrapper-expense'}`}>
            <IconComponent size={18} />
          </div>
          <div className="title-text-group">
            <span className="transaction-title">{title}</span>
            {description && (
              <span className="transaction-desc" title={description}>
                {description}
              </span>
            )}
          </div>
        </div>
      </td>
      
      <td className="col-category">
        <span className="badge-category">{category}</span>
      </td>

      <td className="col-payment">
        <span className="badge-payment">{paymentMethod}</span>
      </td>

      <td className="col-date">
        <span className="transaction-date">{formatDate(date)}</span>
      </td>

      <td className={`col-amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
        <div className="amount-cell">
          {isIncome ? <TrendingUp size={14} className="amount-arrow" /> : <TrendingDown size={14} className="amount-arrow" />}
          <span>{isIncome ? '+' : '-'}{formatCurrency(amount)}</span>
        </div>
      </td>

      <td className="col-actions">
        <div className="actions-group">
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(expense)}
            title="Edit Transaction"
          >
            <Pencil size={15} />
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={() => onDelete(_id)}
            title="Delete Transaction"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ExpenseItem;
