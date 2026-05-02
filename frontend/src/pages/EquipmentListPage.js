import React, { useState, useEffect } from 'react';
import { equipmentAPI, categoryAPI, borrowRequestAPI } from '../services/api';

function EquipmentListPage() {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [borrowForm, setBorrowForm] = useState({
    start_date: '',
    end_date: '',
    purpose: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, [search, categoryFilter, statusFilter]);

  const loadData = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (categoryFilter) params.category_id = categoryFilter;
      if (statusFilter) params.status = statusFilter;

      const [equipmentRes, categoriesRes] = await Promise.all([
        equipmentAPI.list(params),
        categoryAPI.list()
      ]);

      setEquipment(equipmentRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowClick = (item) => {
    setSelectedEquipment(item);
    setMessage(null);
    // Set default dates
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    setBorrowForm({
      start_date: today.toISOString().split('T')[0],
      end_date: nextWeek.toISOString().split('T')[0],
      purpose: ''
    });
  };

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await borrowRequestAPI.create({
        equipment_id: selectedEquipment.id,
        ...borrowForm
      });

      setMessage({ type: 'success', text: 'Borrow request submitted successfully!' });
      setSelectedEquipment(null);
      setBorrowForm({ start_date: '', end_date: '', purpose: '' });
      loadData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to submit request'
      });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: 'badge-success',
      checked_out: 'badge-danger',
      under_maintenance: 'badge-warning',
      retired: 'badge-secondary'
    };
    return `badge ${badges[status] || 'badge-secondary'}`;
  };

  const getConditionBadge = (condition) => {
    const badges = {
      excellent: 'badge-success',
      good: 'badge-info',
      fair: 'badge-warning',
      poor: 'badge-danger',
      damaged: 'badge-danger'
    };
    return `badge ${badges[condition] || 'badge-secondary'}`;
  };

  if (loading) {
    return <div className="loading">Loading equipment...</div>;
  }

  return (
    <div className="container">
      <h1>Equipment Catalog</h1>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="checked_out">Checked Out</option>
          <option value="under_maintenance">Under Maintenance</option>
        </select>
      </div>

      {/* Equipment Grid */}
      <div className="equipment-grid">
        {equipment.length === 0 ? (
          <p>No equipment found.</p>
        ) : (
          equipment.map((item) => (
            <div key={item.id} className="equipment-card">
              <div className="equipment-name">{item.name}</div>
              <div className="equipment-serial">Serial: {item.serial_number}</div>
              <div className="equipment-description">{item.description}</div>
              <div className="equipment-meta">
                <div>
                  <span className={getStatusBadge(item.status)}>
                    {item.status.replace('_', ' ')}
                  </span>
                  {' '}
                  <span className={getConditionBadge(item.condition_status)}>
                    {item.condition_status}
                  </span>
                </div>
                <div>
                  <small style={{ color: '#7f8c8d' }}>
                    {item.category.name}
                  </small>
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <small style={{ color: '#7f8c8d' }}>
                  Available: {item.available_quantity} / {item.quantity}
                </small>
              </div>
              {item.status === 'available' && item.available_quantity > 0 && (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => handleBorrowClick(item)}
                >
                  Request to Borrow
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Borrow Request Modal */}
      {selectedEquipment && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedEquipment(null)}
        >
          <div
            className="card"
            style={{ maxWidth: '500px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="card-title">Request to Borrow</h2>
            <p><strong>{selectedEquipment.name}</strong></p>
            <p style={{ color: '#7f8c8d', fontSize: '0.875rem' }}>
              Serial: {selectedEquipment.serial_number}
            </p>

            <form onSubmit={handleBorrowSubmit}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={borrowForm.start_date}
                  onChange={(e) => setBorrowForm({ ...borrowForm, start_date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={borrowForm.end_date}
                  onChange={(e) => setBorrowForm({ ...borrowForm, end_date: e.target.value })}
                  required
                  min={borrowForm.start_date}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Purpose (Optional)</label>
                <textarea
                  className="form-textarea"
                  value={borrowForm.purpose}
                  onChange={(e) => setBorrowForm({ ...borrowForm, purpose: e.target.value })}
                  placeholder="Describe why you need this equipment..."
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit Request
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setSelectedEquipment(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EquipmentListPage;
