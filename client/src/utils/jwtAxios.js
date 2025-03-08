import { message } from 'antd';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

// Get the API URL from .env
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create an axios instance
const jwtAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Attach token automatically
jwtAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor - Handle Unauthorized Users
jwtAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Remove token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      message.error('Unauthorized');
      Navigate('/login');
    }
    return Promise.reject(error);
  },
);

export default jwtAxios;
