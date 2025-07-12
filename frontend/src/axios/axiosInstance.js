import axios from 'axios';
import { getCurrentConfig } from './apiConfig';

// Get current configuration
const config = getCurrentConfig();

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: config.BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor to add auth token or handle requests
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      // You can dispatch a logout action or redirect here
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - server might be down');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
