import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({ baseURL: API_BASE });

// Add token to admin requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Public APIs
export const publicAPI = {
  getEvents: (params) => api.get('/api/public/events', { params }),
  getEvent: (id) => api.get(`/api/public/events/${id}`),
  submitEvent: (data) => api.post('/api/public/events/submit', data),
  verifyCode: (eventId, code) => api.post('/api/public/events/verify', { eventId, code }),
  getMyEvents: (email) => api.get(`/api/public/events/by-email/${email}`),
};

// Admin APIs
export const adminAPI = {
  login: (email, password) => api.post('/api/admin/login', { email, password }),
  getEvents: () => api.get('/api/admin/events'),
  getEvent: (id) => api.get(`/api/admin/events/${id}`),
  approveEvent: (id) => api.post(`/api/admin/events/${id}/approve`),
  rejectEvent: (id, reason) => api.post(`/api/admin/events/${id}/reject`, { reason }),
  getStats: () => api.get('/api/admin/stats'),
};

export default api;
