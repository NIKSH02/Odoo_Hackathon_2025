// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 10000,
  
  // Environment-specific configurations
  DEVELOPMENT: {
    BASE_URL: 'http://localhost:5000/api',
  },
  PRODUCTION: {
    BASE_URL: 'https://your-production-api.com/api',
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/users/register',
    VERIFY_EMAIL: '/users/verify-email',
    RESEND_EMAIL_OTP: '/users/resend-email-otp',
    LOGIN: '/users/login',
    SEND_LOGIN_OTP: '/users/send-login-otp',
    LOGIN_WITH_OTP: '/users/login-with-otp',
    LOGOUT: '/users/logout',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    PROFILE_STATUS: '/users/profile/status',
    REFRESH_TOKEN: '/users/refresh-token',
  },
  ITEMS: {
    GET_ALL: '/items',
    GET_BY_ID: '/items',
    CREATE: '/items',
    UPDATE: '/items',
    DELETE: '/items',
  },
  ORDERS: {
    GET_USER_ORDERS: '/orders',
    GET_BY_ID: '/orders',
    COMPLETE: '/orders',
    CANCEL: '/orders',
  },
  SWAPS: {
    REQUEST: '/swaps/request',
    GET_USER_SWAPS: '/swaps',
    ACCEPT: '/swaps',
    REJECT: '/swaps',
    COMPLETE: '/swaps',
  },
  POINTS: {
    REDEEM: '/points/redeem',
    HISTORY: '/points/history',
  }
};

// Get current environment configuration
export const getCurrentConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return env === 'production' ? API_CONFIG.PRODUCTION : API_CONFIG.DEVELOPMENT;
};
