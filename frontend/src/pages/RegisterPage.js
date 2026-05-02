import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertDialog from '../components/AlertDialog';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      setSuccessDialog(true);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleSuccessClose = () => {
    setSuccessDialog(false);
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Register</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@school.edu"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone (Optional)</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              placeholder="Minimum 8 characters"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog
        isOpen={successDialog}
        onClose={handleSuccessClose}
        title="Registration Successful"
        message="Your account has been created successfully! You can now login with your credentials."
        type="success"
      />
    </div>
  );
}

export default RegisterPage;
