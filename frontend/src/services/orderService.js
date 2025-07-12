import axiosInstance from '../axios/axiosInstance';

class OrderService {
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
      console.error('Order API Error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'API request failed';
      
      throw new Error(errorMessage);
    }
  }

  // Get user's orders
  static async getUserOrders() {
    return this.makeRequest('/orders', {
      method: 'GET',
    });
  }

  // Get order by ID
  static async getOrderById(orderId) {
    return this.makeRequest(`/orders/${orderId}`, {
      method: 'GET',
    });
  }

  // Complete an order
  static async completeOrder(orderId, completionData) {
    return this.makeRequest(`/orders/${orderId}/complete`, {
      method: 'PUT',
      data: completionData,
    });
  }

  // Cancel an order
  static async cancelOrder(orderId) {
    return this.makeRequest(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    });
  }

  // Get verification codes for an order
  static async getVerificationCodes(orderId) {
    return this.makeRequest(`/orders/${orderId}/codes`, {
      method: 'GET',
    });
  }
}

export default OrderService;
