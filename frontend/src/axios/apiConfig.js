// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api/users',
  TIMEOUT: 10000,
  
  // Environment-specific configurations
  DEVELOPMENT: {
    BASE_URL: 'http://localhost:5000/api/users',
  },
  PRODUCTION: {
    BASE_URL: 'https://your-production-api.com/api/users',
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/register',
    VERIFY_EMAIL: '/verify-email',
    RESEND_EMAIL_OTP: '/resend-email-otp',
    LOGIN: '/login',
    SEND_LOGIN_OTP: '/send-login-otp',
    LOGIN_WITH_OTP: '/login-with-otp',
    LOGOUT: '/logout',
    PROFILE: '/profile',
    UPDATE_PROFILE: '/profile',
    PROFILE_STATUS: '/profile/status',
    REFRESH_TOKEN: '/refresh-token',
  },
  ITEMS: {
    GET_ALL: '/items',
    GET_USER_ITEMS: '/items/user/my-items',
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
    BASE: '/swaps',
    MESSAGES: '/swaps/:id/messages',
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
