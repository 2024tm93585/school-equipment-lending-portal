import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAdmin, isStaffOrAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">📚</span>
          <span className="brand-text">Equipment Portal</span>
        </Link>
        <div className="navbar-menu">
          <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard')}`}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link to="/equipment" className={`navbar-link ${isActive('/equipment')}`}>
            <span className="nav-icon">🔧</span>
            <span className="nav-text">Equipment</span>
          </Link>
          <Link to="/my-requests" className={`navbar-link ${isActive('/my-requests')}`}>
            <span className="nav-icon">📋</span>
            <span className="nav-text">My Requests</span>
          </Link>
          {isStaffOrAdmin() && (
            <Link to="/manage-requests" className={`navbar-link ${isActive('/manage-requests')}`}>
              <span className="nav-icon">✅</span>
              <span className="nav-text">Manage Requests</span>
            </Link>
          )}
          {isAdmin() && (
            <Link to="/manage-equipment" className={`navbar-link ${isActive('/manage-equipment')}`}>
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Manage Equipment</span>
            </Link>
          )}
          <div className="navbar-divider"></div>
          <div className="navbar-user">
            <span className="user-icon">👤</span>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button onClick={logout} className="btn-logout">
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
