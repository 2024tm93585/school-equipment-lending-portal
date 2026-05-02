import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Equipment API
export const equipmentAPI = {
  list: (params) => api.get('/equipment', { params }),
  get: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
};

// Category API
export const categoryAPI = {
  list: () => api.get('/categories'),
};

// Borrow Request API
export const borrowRequestAPI = {
  list: (params) => api.get('/borrow-requests', { params }),
  myRequests: () => api.get('/borrow-requests/my-requests'),
  create: (data) => api.post('/borrow-requests', data),
  approve: (id) => api.put(`/borrow-requests/${id}/approve`),
  reject: (id, notes) => api.put(`/borrow-requests/${id}/reject`, null, { params: { notes } }),
  markReturned: (id, data) => api.put(`/borrow-requests/${id}/return`, data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
