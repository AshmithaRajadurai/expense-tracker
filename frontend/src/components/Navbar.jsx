import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, User as UserIcon } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Determine current page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/transactions')) return 'Transactions';
    if (path.startsWith('/add-transaction')) return 'Add Transaction';
    if (path.startsWith('/budget')) return 'Budget';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/profile')) return 'Profile';
    return 'ExpenseTracker';
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h2 className="header-title">{getPageTitle()}</h2>
      </div>

      <div className="header-right">
        {user && (
          <div className="header-profile">
            <span className="profile-greeting">Hi, {user.name.split(' ')[0]}</span>
            <div className="header-avatar">
              <UserIcon size={18} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
