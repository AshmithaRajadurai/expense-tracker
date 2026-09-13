/**
 * Format a numeric amount to Indian Rupee (₹) currency format.
 * Uses the Indian numbering system (e.g. ₹1,00,000 instead of ₹100,000).
 * 
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal values (defaults to false)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showDecimals = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
};

/**
 * Format a date string or object into a human-readable date.
 * 
 * @param {string|Date} date - The date to format
 * @param {boolean} includeYear - Whether to include the year (defaults to true)
 * @returns {string} Formatted date (e.g., "Aug 21, 2026" or "Aug 21")
 */
export const formatDate = (date, includeYear = true) => {
  if (!date) return '';
  const d = new Date(date);
  
  const options = {
    month: 'short',
    day: 'numeric',
  };
  
  if (includeYear) {
    options.year = 'numeric';
  }
  
  return d.toLocaleDateString('en-IN', options);
};

/**
 * Get current month and year values.
 * 
 * @returns {object} { month: 1-12, year: 2026, monthName: "August" }
 */
export const getCurrentPeriod = () => {
  const today = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return {
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    monthName: months[today.getMonth()]
  };
};
