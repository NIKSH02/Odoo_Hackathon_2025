import { useState, useCallback } from 'react';
import AuthService from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error) => {
    setError(error.message || 'An unexpected error occurred');
    setLoading(false);
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(userData);
      setLoading(false);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  const verifyEmail = useCallback(async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.verifyEmail(email, otp);
      setLoading(false);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  const resendEmailOTP = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.resendEmailOTP(email);
      setLoading(false);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(credentials);
      setUser(response.data.user);
      setLoading(false);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  const sendLoginOTP = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.sendLoginOTP(email);
      setLoading(false);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  const loginWithOTP = useCallback(async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.loginWithOTP(email, otp);
      setUser(response.data.user);
      setLoading(false);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.logout();
      setUser(null);
      setLoading(false);
    } catch (error) {
      handleError(error);
      // Even if logout fails on server, clear local state
      setUser(null);
    }
  }, [handleError]);

  return {
    loading,
    error,
    user,
    clearError,
    register,
    verifyEmail,
    resendEmailOTP,
    login,
    sendLoginOTP,
    loginWithOTP,
    logout,
  };
};
