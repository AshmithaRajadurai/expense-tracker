import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { expenseAPI } from '../services/api';
import ExpenseList from '../components/ExpenseList';
import Modal from '../components/Modal';
import { Search, Plus, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  'All',
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

const Transactions = () => {
  const navigate = useNavigate();
  
  // State for list and pagination
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'All',
    startDate: '',
    endDate: '',
    sortBy: 'date_desc', // Default: Latest first
  });

  // Intermediate filters to prevent queries on every character keystroke
  const [searchInput, setSearchInput] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Load transactions on filter or page change
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await expenseAPI.getAll({
        search: filters.search,
        category: filters.category,
        type: filters.type,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy: filters.sortBy,
        page: currentPage,
        limit: 10,
      });

      setExpenses(response.data.expenses);
      setTotalPages(response.data.pages);
      setTotalCount(response.data.total);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchInput,
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      category: 'All',
      type: 'All',
      startDate: '',
      endDate: '',
      sortBy: 'date_desc',
    });
    setCurrentPage(1);
  };

  const handleEdit = (expense) => {
    // Navigate to AddTransaction and pass the state
    navigate('/add-transaction', { state: { editExpense: expense } });
  };

  const handleDeleteClick = (id) => {
    setExpenseToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await expenseAPI.delete(expenseToDelete);
      // Fetch updated list
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError('Failed to delete transaction. Please try again.');
    } finally {
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="transactions-page-container">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="page-header-actions">
        <div>
          <h1>Transactions History</h1>
          <p className="subtitle">View, edit, filter and export your records ({totalCount} items)</p>
        </div>
        <Link to="/add-transaction" className="btn btn-primary">
          <Plus size={18} />
          <span>Add Transaction</span>
        </Link>
      </div>

      {/* Filters and Controls Card */}
      <div className="filters-card">
        <form onSubmit={handleSearchSubmit} className="search-form-row">
          <div className="search-input-group">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search title, description..."
              className="form-input search-field"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>

        <div className="filters-grid">
          <div className="filter-item">
            <label className="filter-label">Type</label>
            <select
              name="type"
              className="form-input select-filter"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="All">All Types</option>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Category</label>
            <select
              name="category"
              className="form-input select-filter"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">Sort By</label>
            <select
              name="sortBy"
              className="form-input select-filter"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="date_desc">Latest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
          </div>

          <div className="filter-item date-range-picker-group">
            <label className="filter-label">From</label>
            <input
              type="date"
              name="startDate"
              className="form-input date-filter"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-item date-range-picker-group">
            <label className="filter-label">To</label>
            <input
              type="date"
              name="endDate"
              className="form-input date-filter"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filters-actions-row">
          <button 
            type="button" 
            className="btn-text-link" 
            onClick={handleResetFilters}
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Main Transactions List Section */}
      <div className="section-card mt-6">
        <ExpenseList
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isLoading={isLoading}
        />

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              className="pagination-btn"
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>
            
            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagination-page-num ${currentPage === p ? 'active' : ''}`}
                  disabled={isLoading}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages || isLoading}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Transaction?"
        message="Are you sure you want to delete this transaction? This action will permanently remove the record from database."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Transactions;
