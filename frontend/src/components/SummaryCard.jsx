import React from 'react';
import { formatCurrency } from '../utils/helpers';

const SummaryCard = ({ title, amount, icon: Icon, type, trend }) => {
  let cardClass = 'summary-card';
  let iconClass = 'summary-icon';

  if (type === 'income') {
    cardClass += ' card-income';
    iconClass += ' icon-income';
  } else if (type === 'expense') {
    cardClass += ' card-expense';
    iconClass += ' icon-expense';
  } else if (type === 'balance') {
    cardClass += ' card-balance';
    iconClass += ' icon-balance';
  }

  return (
    <div className={cardClass}>
      <div className="card-header-flex">
        <span className="card-label">{title}</span>
        <div className={iconClass}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-value">{formatCurrency(amount)}</h3>
        {trend && (
          <p className={`card-trend ${trend.positive ? 'trend-up' : 'trend-down'}`}>
            {trend.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
