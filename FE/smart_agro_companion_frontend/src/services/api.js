const API_BASE_URL = 'http://localhost:3000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    };
  
    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));
  
      // Correct condition
      if (!response.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
      }
  
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
  

  // Auth endpoints
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email, password, role) {
    return this.request(`/auth/login/${role}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'GET',
      credentials: 'include',
    });
  }

  async requestPasswordReset(email, role) {
    return this.request('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async resetPassword(token, newPassword, role) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword, role }),
    });
  }

  // Product endpoints
  async getProducts(farmerId = null) {
    const query = farmerId ? `?farmerId=${farmerId}` : '';
    return this.request(`/api/products${query}`);
  }

  async getProduct(id) {
    return this.request(`/api/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getFarmerOrders(farmerId) {
    return this.request(`/api/orders/farmer/${farmerId}`);
  }

  async getBuyerOrders(buyerId) {
    return this.request(`/api/orders/buyer/${buyerId}`);
  }

  async acceptOrder(id) {
    return this.request(`/api/orders/${id}/accept`, {
      method: 'POST',
    });
  }

  async declineOrder(id, declineReason) {
    return this.request(`/api/orders/${id}/decline`, {
      method: 'POST',
      body: JSON.stringify({ declineReason }),
    });
  }

  async cancelOrder(id, role, userId) {
    return this.request(`/api/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ role, userId }),
    });
  }

  async confirmTransaction(transactionId, role, userId) {
    return this.request(`/api/transactions/${transactionId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ role, userId }),
    });
  }

  // Cart endpoints
  async getCartItems(buyerId) {
    return this.request(`/api/carts/${buyerId}`);
  }

  async addToCart(productId, buyerId, quantity) {
    return this.request('/api/carts', {
      method: 'POST',
      body: JSON.stringify({ productId, buyerId, quantity }),
    });
  }

  async updateCartItemQuantity(cartId, quantity) {
    return this.request(`/api/carts/${cartId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(cartId) {
    return this.request(`/api/carts/${cartId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(buyerId) {
    return this.request(`/api/carts/clear/${buyerId}`, {
      method: 'DELETE',
    });
  }

  // Notification endpoints
  async getNotifications(userId, role) {
    return this.request(`/api/notifications?userId=${userId}&role=${role}`);
  }

  async getUnreadCount(userId, role) {
    return this.request(`/api/notifications/unread-count?userId=${userId}&role=${role}`);
  }

  async markNotificationAsRead(id) {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(userId, role) {
    return this.request('/api/notifications/read-all', {
      method: 'PUT',
      body: JSON.stringify({ userId, role }),
    });
  }

  async deleteNotification(id) {
    return this.request(`/api/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Profile endpoints
  async getProfile(userId, role) {
    return this.request(`/api/profile/${role}/${userId}`);
  }

  async updateProfile(userId, role, profileData) {
    return this.request(`/api/profile/${role}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updatePassword(userId, role, currentPassword, newPassword) {
    return this.request(`/api/profile/${role}/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async deleteProfile(userId, role, password) {
    return this.request(`/api/profile/${role}/${userId}`, {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }

  // Chat endpoints
  async getMessages(farmerId, buyerId, productId = null) {
    const query = productId 
      ? `?farmerId=${farmerId}&buyerId=${buyerId}&productId=${productId}`
      : `?farmerId=${farmerId}&buyerId=${buyerId}`;
    return this.request(`/api/chats${query}`);
  }

  async sendMessage(messageData) {
    return this.request('/api/chats', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessagesAsRead(farmerId, buyerId) {
    return this.request('/api/chats/read', {
      method: 'PUT',
      body: JSON.stringify({ farmerId, buyerId }),
    });
  }

  // AI Crop Detection endpoints
  async detectCropDisease(farmerId, imageUrl, videoUrl = null) {
    return this.request('/api/ai/detect', {
      method: 'POST',
      body: JSON.stringify({ farmerId, imageUrl, videoUrl }),
    });
  }

  async getDetectionHistory(farmerId) {
    return this.request(`/api/ai/detections/${farmerId}`);
  }

  async getDetection(id) {
    return this.request(`/api/ai/detections/single/${id}`);
  }

  // Device endpoints
  async getDevices() {
    return this.request('/api/devices');
  }

  async getDevice(id) {
    return this.request(`/api/devices/${id}`);
  }

  async installDevice(deviceData) {
    return this.request('/api/devices', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  async updateDevice(id, deviceData) {
    return this.request(`/api/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData),
    });
  }

  async uninstallDevice(id) {
    return this.request(`/api/devices/${id}`, {
      method: 'DELETE',
    });
  }

  async checkUpdates() {
    return this.request('/api/updates');
  }
}

export default new ApiService();

