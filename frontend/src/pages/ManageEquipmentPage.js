import React, { useState, useEffect } from 'react';
import { equipmentAPI, categoryAPI } from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

function ManageEquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    serial_number: '',
    description: '',
    category_id: '',
    quantity: 1,
    available_quantity: 1,
    condition_status: 'good'
  });
  const [message, setMessage] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, equipmentId: null, equipmentName: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [equipmentRes, categoriesRes] = await Promise.all([
        equipmentAPI.list({}),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (editingId) {
        await equipmentAPI.update(editingId, formData);
        setMessage({ type: 'success', text: 'Equipment updated successfully!' });
      } else {
        await equipmentAPI.create(formData);
        setMessage({ type: 'success', text: 'Equipment created successfully!' });
      }
      
      resetForm();
      loadData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Operation failed'
      });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      serial_number: item.serial_number,
      description: item.description || '',
      category_id: item.category_id,
      quantity: item.quantity,
      available_quantity: item.available_quantity,
      condition_status: item.condition_status
    });
    setShowModal(true);
    setMessage(null);
  };

  const handleDelete = async (item) => {
    setDeleteDialog({ isOpen: true, equipmentId: item.id, equipmentName: item.name });
  };

  const confirmDelete = async () => {
    try {
      await equipmentAPI.delete(deleteDialog.equipmentId);
      setMessage({ type: 'success', text: 'Equipment deleted successfully!' });
      loadData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to delete equipment'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      serial_number: '',
      description: '',
      category_id: '',
      quantity: 1,
      available_quantity: 1,
      condition_status: 'good'
    });
    setEditingId(null);
    setShowModal(false);
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

  if (loading) {
    return <div className="loading">Loading equipment...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Manage Equipment</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Add Equipment
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Modal for Add/Edit Equipment */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={editingId ? 'Edit Equipment' : 'Add New Equipment'}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Serial Number *</label>
            <input
              type="text"
              className="form-input"
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Total Quantity *</label>
              <input
                type="number"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Available Quantity *</label>
              <input
                type="number"
                className="form-input"
                value={formData.available_quantity}
                onChange={(e) => setFormData({ ...formData, available_quantity: parseInt(e.target.value) })}
                min="0"
                max={formData.quantity}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Condition *</label>
            <select
              className="form-select"
              value={formData.condition_status}
              onChange={(e) => setFormData({ ...formData, condition_status: e.target.value })}
              required
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Equipment' : 'Add Equipment'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <div className="card">
        <h2 className="card-title">Equipment List</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Serial Number</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Condition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                  {item.description && (
                    <div style={{ fontSize: '0.875rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
                      {item.description}
                    </div>
                  )}
                </td>
                <td>{item.serial_number}</td>
                <td>{item.category.name}</td>
                <td>
                  {item.available_quantity} / {item.quantity}
                </td>
                <td>
                  <span className={getStatusBadge(item.status)}>
                    {item.status.replace('_', ' ')}
                  </span>
                </td>
                <td>{item.condition_status}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, equipmentId: null, equipmentName: '' })}
        onConfirm={confirmDelete}
        title="Delete Equipment"
        message={`Are you sure you want to delete "${deleteDialog.equipmentName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default ManageEquipmentPage;
