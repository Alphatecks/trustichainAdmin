/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const API_BASE_URL = 'https://trustichain-backend.onrender.com/api';

export const authService = {
  /**
   * Admin login
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Response data with token and admin info
   */
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    return data;
  },

  /**
   * Store authentication data
   * @param {string} token - Authentication token
   * @param {Object} adminData - Admin user data
   */
  storeAuthData(token, adminData) {
    if (token) {
      localStorage.setItem('adminToken', token);
    }
    if (adminData) {
      localStorage.setItem('adminData', JSON.stringify(adminData));
    }
  },

  /**
   * Get stored authentication token
   * @returns {string|null} Authentication token
   */
  getToken() {
    return localStorage.getItem('adminToken');
  },

  /**
   * Get stored admin data
   * @returns {Object|null} Admin user data
   */
  getAdminData() {
    const data = localStorage.getItem('adminData');
    return data ? JSON.parse(data) : null;
  },

  /**
   * Admin logout – invalidate session on server then clear local auth data
   */
  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/admin/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        // Proceed to clear local state even if request fails (e.g. network)
      }
    }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  },
};
