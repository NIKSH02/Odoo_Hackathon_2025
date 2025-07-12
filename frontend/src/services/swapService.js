import axiosInstance from '../axios/axiosInstance';
import { API_ENDPOINTS } from '../axios/apiConfig';

class SwapService {
  static async makeRequest(endpoint, options = {}) {
    try {
      const { method = 'GET', data, params, ...config } = options;
      
      const response = await axiosInstance({
        url: endpoint,
        method,
        data,
        params,
        ...config,
      });

      return response.data;
    } catch (error) {
      console.error('Swap API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'API request failed';
      
      throw new Error(errorMessage);
    }
  }

  // Request a swap
  static async requestSwap(swapData) {
    return this.makeRequest('/swaps/request', {
      method: 'POST',
      data: swapData,
    });
  }

  // Get user's swaps
  static async getUserSwaps() {
    return this.makeRequest('/swaps', {
      method: 'GET',
    });
  }

  // Accept a swap
  static async acceptSwap(swapId) {
    return this.makeRequest(`/swaps/${swapId}/accept`, {
      method: 'PUT',
    });
  }

  // Reject a swap
  static async rejectSwap(swapId) {
    return this.makeRequest(`/swaps/${swapId}/reject`, {
      method: 'PUT',
    });
  }

  // Complete a swap
  static async completeSwap(swapId) {
    return this.makeRequest(`/swaps/${swapId}/complete`, {
      method: 'PUT',
    });
  }
}

export default SwapService;
