import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EquipmentListPage from './pages/EquipmentListPage';
import MyRequestsPage from './pages/MyRequestsPage';
import ManageRequestsPage from './pages/ManageRequestsPage';
import ManageEquipmentPage from './pages/ManageEquipmentPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="app">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipment"
          element={
            <ProtectedRoute>
              <EquipmentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute>
              <MyRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-requests"
          element={
            <ProtectedRoute>
              <ManageRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-equipment"
          element={
            <AdminRoute>
              <ManageEquipmentPage />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
