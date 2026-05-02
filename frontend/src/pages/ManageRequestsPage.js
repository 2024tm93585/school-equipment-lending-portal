import React, { useState, useEffect } from 'react';
import { borrowRequestAPI } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import PromptDialog from '../components/PromptDialog';
import AlertDialog from '../components/AlertDialog';

function ManageRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState(null);
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, requestId: null });
  const [rejectDialog, setRejectDialog] = useState({ isOpen: false, requestId: null });
  const [returnDialog, setReturnDialog] = useState({ isOpen: false, requestId: null });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const loadRequests = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      
      const response = await borrowRequestAPI.list(params);
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setConfirmDialog({ isOpen: true, requestId });
  };

  const confirmApprove = async () => {
    try {
      await borrowRequestAPI.approve(confirmDialog.requestId);
      setMessage({ type: 'success', text: 'Request approved successfully!' });
      loadRequests();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to approve request'
      });
    }
  };

  const handleReject = async (requestId) => {
    setRejectDialog({ isOpen: true, requestId });
  };

  const confirmReject = async (notes) => {
    try {
      await borrowRequestAPI.reject(rejectDialog.requestId, notes);
      setMessage({ type: 'success', text: 'Request rejected successfully!' });
      loadRequests();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to reject request'
      });
    }
  };

  const handleReturn = async (requestId) => {
    setReturnDialog({ isOpen: true, requestId });
  };

  const confirmReturn = async (condition) => {
    if (!condition) return;

    const validConditions = ['excellent', 'good', 'fair', 'poor', 'damaged'];
    if (!validConditions.includes(condition.toLowerCase())) {
      setAlertDialog({
        isOpen: true,
        title: 'Invalid Condition',
        message: 'Please select a valid condition: excellent, good, fair, poor, or damaged',
        type: 'error'
      });
      return;
    }

    try {
      await borrowRequestAPI.markReturned(returnDialog.requestId, {
        return_condition: condition.toLowerCase()
      });
      setMessage({ type: 'success', text: 'Equipment marked as returned!' });
      loadRequests();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to mark as returned'
      });
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
    return <div className="loading">Loading requests...</div>;
  }

  return (
    <div className="container">
      <h1>Manage Borrow Requests</h1>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ maxWidth: '300px' }}
        >
          <option value="">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {requests.length === 0 ? (
        <div className="card">
          <p>No requests found.</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Equipment</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Approved By</th>
                <th>Purpose</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <strong>{request.user.name}</strong>
                    <br />
                    <small style={{ color: '#7f8c8d' }}>
                      {request.user.email}
                    </small>
                  </td>
                  <td>
                    <strong>{request.equipment.name}</strong>
                    <br />
                    <small style={{ color: '#7f8c8d' }}>
                      {request.equipment.serial_number}
                    </small>
                  </td>
                  <td>
                    {formatDate(request.start_date)} - {formatDate(request.end_date)}
                    <br />
                    <small style={{ color: '#7f8c8d' }}>
                      Requested: {formatDate(request.request_date)}
                    </small>
                  </td>
                  <td>
                    <span className={getStatusBadge(request.status)}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {request.approver ? (
                      <>
                        <strong>{request.approver.name}</strong>
                        <br />
                        <small style={{ color: '#7f8c8d' }}>
                          {request.approver.email}
                        </small>
                      </>
                    ) : (
                      <span style={{ color: '#95a5a6' }}>-</span>
                    )}
                  </td>
                  <td>
                    <small>{request.purpose || '-'}</small>
                  </td>
                  <td>
                    {request.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <button
                          className="btn btn-success"
                          style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {request.status === 'approved' && (
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                        onClick={() => handleReturn(request.id)}
                      >
                        Mark Returned
                      </button>
                    )}
                    {(request.status === 'rejected' || request.status === 'returned') && (
                      <span style={{ color: '#7f8c8d', fontSize: '0.875rem' }}>
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Approve Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, requestId: null })}
        onConfirm={confirmApprove}
        title="Approve Request"
        message="Are you sure you want to approve this borrow request? The equipment will be marked as checked out."
        confirmText="Approve"
        type="success"
      />

      {/* Reject Dialog */}
      <PromptDialog
        isOpen={rejectDialog.isOpen}
        onClose={() => setRejectDialog({ isOpen: false, requestId: null })}
        onSubmit={confirmReject}
        title="Reject Request"
        message="Please provide a reason for rejecting this request (optional):"
        placeholder="Enter rejection reason..."
        inputType="textarea"
      />

      {/* Return Dialog */}
      <PromptDialog
        isOpen={returnDialog.isOpen}
        onClose={() => setReturnDialog({ isOpen: false, requestId: null })}
        onSubmit={confirmReturn}
        title="Mark Equipment as Returned"
        message="Please select the condition of the returned equipment:"
        options={[
          { value: 'excellent', label: 'Excellent - Like new condition' },
          { value: 'good', label: 'Good - Minor wear and tear' },
          { value: 'fair', label: 'Fair - Noticeable wear' },
          { value: 'poor', label: 'Poor - Significant wear' },
          { value: 'damaged', label: 'Damaged - Requires repair' }
        ]}
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ isOpen: false, title: '', message: '', type: 'info' })}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
      />
    </div>
  );
}

export default ManageRequestsPage;
