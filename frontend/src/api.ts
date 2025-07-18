// @ts-nocheck
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Serviços de autenticação
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/api/auth/login/', { username, password });
    return response.data;
  },

  register: async (userData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }) => {
    const response = await api.post('/api/auth/register/', userData);
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await api.post('/api/auth/logout/', { refresh: refreshToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/profile/');
    return response.data;
  },
};

export default api;
