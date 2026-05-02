import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';

function DashboardPage() {
  const { user, isStaffOrAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1>Welcome, {user?.name}!</h1>
      <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
        Role: {user?.role}
      </p>

      {isStaffOrAdmin() ? (
        // Admin/Staff Dashboard
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats?.total_equipment || 0}</div>
            <div className="stat-label">Total Equipment</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.available_equipment || 0}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.pending_requests || 0}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.active_borrows || 0}</div>
            <div className="stat-label">Active Borrows</div>
          </div>
        </div>
      ) : (
        // Student Dashboard
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats?.my_pending_requests || 0}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.my_active_borrows || 0}</div>
            <div className="stat-label">Active Borrows</div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/equipment" className="btn btn-primary">
            Browse Equipment
          </a>
          <a href="/my-requests" className="btn btn-secondary">
            View My Requests
          </a>
          {isStaffOrAdmin() && (
            <>
              <a href="/manage-requests" className="btn btn-success">
                Manage Requests
              </a>
              {user?.role === 'administrator' && (
                <a href="/manage-equipment" className="btn btn-success">
                  Manage Equipment
                </a>
              )}
            </>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">System Information</h2>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Account Status:</strong>{' '}
          <span className="badge badge-success">Active</span>
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
