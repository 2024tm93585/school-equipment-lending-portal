import React, { useState, useEffect } from 'react';
import { borrowRequestAPI } from '../services/api';

function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await borrowRequestAPI.myRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      returned: 'badge-secondary'
    };
    return `badge ${badges[status] || 'badge-secondary'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading your requests...</div>;
  }

  return (
    <div className="container">
      <h1>My Borrow Requests</h1>

      {requests.length === 0 ? (
        <div className="card">
          <p>You haven't made any borrow requests yet.</p>
          <a href="/equipment" className="btn btn-primary">
            Browse Equipment
          </a>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Request Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <strong>{request.equipment.name}</strong>
                    <br />
                    <small style={{ color: '#7f8c8d' }}>
                      {request.equipment.serial_number}
                    </small>
                  </td>
                  <td>{formatDate(request.start_date)}</td>
                  <td>{formatDate(request.end_date)}</td>
                  <td>
                    <span className={getStatusBadge(request.status)}>
                      {request.status}
                    </span>
                  </td>
                  <td>{formatDate(request.request_date)}</td>
                  <td>
                    {request.notes || '-'}
                    {request.purpose && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#7f8c8d' }}>
                        Purpose: {request.purpose}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyRequestsPage;
