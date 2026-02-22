/**
 * Business Management API service
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
 * Fetch business management overview
 * @returns {Promise<{ success: boolean; message: string; data?: { payrollsCreated, payrollsCreatedChangePercent, suppliers, suppliersChangePercent, apiIntegrated, averageResTimeHours, averageResTimeLabel } }>}
 */
export async function fetchBusinessManagementOverview() {
  const response = await fetch(`${API_BASE_URL}/admin/business-management/overview`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load business management overview');
  }

  return json;
}

/**
 * Fetch business management activities (business-suite escrows only).
 * GET /api/admin/business-management/activities?page=1&pageSize=10
 * Optional: status (In progress | Completed | Pending), search (e.g. "Acme").
 * @param {Object} params - { page, pageSize, status?, search? }
 * @returns {Promise<{ success: boolean; message: string; data?: { items: Array<{ id, activityId, description: { name, address }, status, date, createdAt }>, total, page, pageSize, totalPages } }>}
 */
export async function fetchBusinessManagementActivities(params = {}) {
  const { page = 1, pageSize = 10, status, search } = params;
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (status && status !== 'All') searchParams.set('status', status);
  if (search && search.trim()) searchParams.set('search', search.trim());

  const response = await fetch(
    `${API_BASE_URL}/admin/business-management/activities?${searchParams}`,
    { method: 'GET', headers: getAuthHeaders() }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load activities');
  }

  return json;
}

/**
 * Fetch single activity detail by ID (UUID) or activity ID (e.g. ESC-2025-001)
 * @param {string} idOrActivityId - Activity UUID (e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890) or activityId (e.g. ESC-2025-001)
 * @returns {Promise<{ success: boolean; message: string; data?: object }>}
 */
export async function fetchBusinessManagementActivity(idOrActivityId) {
  if (!idOrActivityId) throw new Error('Activity ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/business-management/activities/${encodeURIComponent(String(idOrActivityId))}`,
    { method: 'GET', headers: getAuthHeaders() }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load activity detail');
  }

  return json;
}
