/**
 * Admin settings API service
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
 * Get admin profile
 * GET /api/admin/settings/profile
 * @returns {Promise<{ success: boolean; message: string; data?: { fullName, email, avatarUrl, emailNotificationsEnabled, pushNotificationsEnabled } }>}
 */
export async function fetchProfile() {
  const response = await fetch(`${API_BASE_URL}/admin/settings/profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load profile');
  }

  return json;
}

/**
 * Update admin profile
 * PUT /api/admin/settings/profile
 * @param {Object} body - { fullName: string, email: string }
 * @returns {Promise<{ success: boolean; message: string; data?: { fullName, email, avatarUrl, emailNotificationsEnabled, pushNotificationsEnabled } }>}
 */
export async function updateProfile(body) {
  const { fullName, email } = body || {};
  const response = await fetch(`${API_BASE_URL}/admin/settings/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      fullName: fullName != null ? String(fullName).trim() : undefined,
      email: email != null ? String(email).trim() : undefined,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to update profile');
  }

  return json;
}

/**
 * Set profile photo (avatar URL)
 * PUT /api/admin/settings/profile/photo
 * @param {Object} body - { avatarUrl: string | null }
 * @returns {Promise<{ success: boolean; message: string; data?: { fullName, email, avatarUrl, emailNotificationsEnabled, pushNotificationsEnabled } }>}
 */
export async function updateProfilePhoto(body) {
  const { avatarUrl } = body || {};
  const response = await fetch(`${API_BASE_URL}/admin/settings/profile/photo`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      avatarUrl: avatarUrl != null && String(avatarUrl).trim() !== '' ? String(avatarUrl).trim() : null,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to update profile photo');
  }

  return json;
}

/**
 * Get notification settings
 * GET /api/admin/settings/notifications
 * @returns {Promise<{ success: boolean; message: string; data?: { emailNotificationsEnabled, pushNotificationsEnabled } }>}
 */
export async function fetchNotificationSettings() {
  const response = await fetch(`${API_BASE_URL}/admin/settings/notifications`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load notification settings');
  }

  return json;
}

/**
 * Update notification settings
 * PUT /api/admin/settings/notifications
 * @param {Object} body - { emailNotifications: boolean, pushNotifications: boolean }
 * @returns {Promise<{ success: boolean; message: string; data?: { emailNotificationsEnabled, pushNotificationsEnabled } }>}
 */
export async function updateNotificationSettings(body) {
  const { emailNotifications, pushNotifications } = body || {};
  const response = await fetch(`${API_BASE_URL}/admin/settings/notifications`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      emailNotifications: emailNotifications === true,
      pushNotifications: pushNotifications === true,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to update notification settings');
  }

  return json;
}

/**
 * Remove profile photo
 * DELETE /api/admin/settings/profile/photo
 * @returns {Promise<{ success: boolean; message: string; data?: { fullName, email, avatarUrl, emailNotificationsEnabled, pushNotificationsEnabled } }>}
 */
export async function deleteProfilePhoto() {
  const response = await fetch(`${API_BASE_URL}/admin/settings/profile/photo`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to remove profile photo');
  }

  return json;
}
