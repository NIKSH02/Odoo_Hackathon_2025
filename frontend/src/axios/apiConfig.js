// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/user/api',
  TIMEOUT: 10000,
  
  // Environment-specific configurations
  DEVELOPMENT: {
    BASE_URL: 'http://localhost:5000/user/api',
  },
  PRODUCTION: {
    BASE_URL: 'https://your-production-api.com/user/api',
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
    REFRESH_TOKEN: '/refresh-token',
  },
  // Add other endpoint categories here as needed
  // USER: {
  //   GET_PROFILE: '/profile',
  //   UPDATE_PROFILE: '/profile/update',
  // },
};

// Get current environment configuration
export const getCurrentConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return env === 'production' ? API_CONFIG.PRODUCTION : API_CONFIG.DEVELOPMENT;
};
