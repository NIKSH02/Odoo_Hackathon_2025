import axiosInstance from '../axios/axiosInstance';
import { API_ENDPOINTS } from '../axios/apiConfig';

class ItemService {
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
      console.error('Item API Error:', error);
      
      // Extract error message from response
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'API request failed';
      
      throw new Error(errorMessage);
    }
  }

  // Get all items with optional filters
  static async getAllItems(filters = {}) {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.subCategory) params.subCategory = filters.subCategory;
    if (filters.size) params.size = filters.size;
    if (filters.condition) params.condition = filters.condition;
    if (filters.status) params.status = filters.status;

    return this.makeRequest(API_ENDPOINTS.ITEMS.GET_ALL, {
      method: 'GET',
      params,
    });
  }

  // Get item by ID
  static async getItemById(id) {
    return this.makeRequest(`${API_ENDPOINTS.ITEMS.GET_BY_ID}/${id}`, {
      method: 'GET',
    });
  }

  // Create new item
  static async createItem(itemData) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(itemData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, itemData[key]);
      }
    });

    // Add image files
    if (itemData.images && itemData.images.length > 0) {
      itemData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return this.makeRequest(API_ENDPOINTS.ITEMS.CREATE, {
      method: 'POST',
      data: formData,
      // Don't set Content-Type header - let browser set it with boundary
    });
  }

  // Update item
  static async updateItem(id, itemData) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(itemData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, itemData[key]);
      }
    });

    // Add image files if any new ones
    if (itemData.images && itemData.images.length > 0) {
      itemData.images.forEach(image => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }

    return this.makeRequest(`${API_ENDPOINTS.ITEMS.UPDATE}/${id}`, {
      method: 'PUT',
      data: formData,
      // Don't set Content-Type header - let browser set it with boundary
    });
  }

  // Delete item
  static async deleteItem(id) {
    return this.makeRequest(`${API_ENDPOINTS.ITEMS.DELETE}/${id}`, {
      method: 'DELETE',
    });
  }

  // Get user's items (listings)
  static async getUserItems() {
    return this.makeRequest(API_ENDPOINTS.ITEMS.GET_USER_ITEMS, {
      method: 'GET',
    });
  }
}

export default ItemService;
