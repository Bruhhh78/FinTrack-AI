import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getCurrentUser: () => API.get('/auth/me'),
};

export const expenseAPI = {
  create: (data) => API.post('/expenses', data),
  getAll: (params) => API.get('/expenses', { params }),
  getOne: (id) => API.get(`/expenses/${id}`),
  update: (id, data) => API.put(`/expenses/${id}`, data),
  delete: (id) => API.delete(`/expenses/${id}`),
  getMonthly: (month, year) => API.get(`/expenses/monthly/${month}`, { params: { year } }),
};

export const incomeAPI = {
  create: (data) => API.post('/income', data),
  getAll: (params) => API.get('/income', { params }),
  getOne: (id) => API.get(`/income/${id}`),
  update: (id, data) => API.put(`/income/${id}`, data),
  delete: (id) => API.delete(`/income/${id}`),
  getMonthly: (month, year) => API.get(`/income/monthly/${month}`, { params: { year } }),
};

export const budgetAPI = {
  create: (data) => API.post('/budget', data),
  getMonthly: (month, year) => API.get(`/budget/${month}`, { params: { year } }),
  getAll: () => API.get('/budget'),
};

export const goalAPI = {
  create: (data) => API.post('/goals', data),
  getAll: (params) => API.get('/goals', { params }),
  getOne: (id) => API.get(`/goals/${id}`),
  update: (id, data) => API.put(`/goals/${id}`, data),
  // Support both (id, data) and ([id, data]) call styles
  contribute: (idOrArr, data) => {
    const id = Array.isArray(idOrArr) ? idOrArr[0] : idOrArr;
    const body = Array.isArray(idOrArr) ? idOrArr[1] : data;
    return API.post(`/goals/${id}/contribute`, body);
  },
  delete: (id) => API.delete(`/goals/${id}`),
};

export const analyticsAPI = {
  getOverview: () => API.get('/analytics/overview'),
  getTrends: () => API.get('/analytics/trends'),
  getCategories: (params) => API.get('/analytics/categories', { params }),
  getHealthScore: () => API.get('/analytics/health-score'),
};

export const userAPI = {
  getProfile: () => API.get('/user/profile'),
  updateProfile: (data) => API.put('/user/profile', data),
  deleteAccount: () => API.delete('/user/profile'),
};

export const aiAPI = {
  getInsights: () => API.get('/ai/insights'),
  chat: (data) => API.post('/ai/chat', data),
};

export const savingsAPI = {
  getDetails: () => API.get('/savings'),
  createTransaction: (data) => API.post('/savings/transaction', data),
};

export default API;
