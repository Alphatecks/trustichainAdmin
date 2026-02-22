/**
 * Admin push notification API service
 * POST /api/admin/notifications/push
 */

import { authService } from './authService';

const API_BASE_URL = 'https://trustichain-backend.onrender.com/api';

const getAuthHeaders = () => {
  let token = authService.getToken();
  if (!token) token = localStorage.getItem('adminToken');
  if (token && token.startsWith('Bearer ')) token = token.slice(7);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Send push notification
 * POST /api/admin/notifications/push
 * @param {Object} params
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message (or body, mapped to message)
 * @param {string} [params.sendTo='all'] - 'all' = all devices, or 'user' for single user
 * @param {string} [params.userId] - Required when sendTo is 'user'
 * @returns {Promise<{ success: boolean; message: string; data?: { sentCount, failureCount } }>}
 */
export async function sendPushNotification({ title, message, body, sendTo = 'all', userId }) {
  const text = (message != null && String(message).trim()) ? String(message).trim() : (body != null && String(body).trim()) ? String(body).trim() : '';
  if (!title || !title.trim()) throw new Error('Title is required');
  if (!text) throw new Error('Message is required');
  if (sendTo === 'user' && (!userId || !String(userId).trim())) {
    throw new Error('User ID is required when sending to a specific user');
  }

  const payload = {
    title: title.trim(),
    message: text,
    sendTo,
  };
  if (sendTo === 'user' && userId) payload.userId = String(userId).trim();

  const response = await fetch(`${API_BASE_URL}/admin/notifications/push`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to send push notification');
  }

  return json;
}
