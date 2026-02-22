/**
 * Escrow Management API service
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
 * Fetch escrow management stats
 * @returns {Promise<{ success: boolean; message: string; data?: { totalAmountUsd, totalAmountUsdChangePercent, totalEscrowCount, totalEscrowCountChangePercent, completedCount, completedCountChangePercent, disputedCount, disputedCountChangePercent } }>}
 */
export async function fetchEscrowManagementStats() {
  const response = await fetch(`${API_BASE_URL}/admin/escrow-management/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load escrow management stats');
  }

  return json;
}

/**
 * Fetch escrow list with pagination and sort
 * @param {Object} params - { page, pageSize, sortBy, sortOrder }
 * @returns {Promise<{ success: boolean; message: string; data?: { items, total, page, pageSize, totalPages } }>}
 */
export async function fetchEscrows(params = {}) {
  const { page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc' } = params;
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortBy,
    sortOrder,
  });
  const response = await fetch(
    `${API_BASE_URL}/admin/escrow-management/escrows?${searchParams}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load escrow list');
  }

  return json;
}

/**
 * Fetch single escrow detail by escrowId (e.g. ESC-2025-001)
 * @param {string} escrowId - Escrow ID
 * @returns {Promise<{ success: boolean; message: string; data?: Object }>}
 */
export async function fetchEscrowDetail(escrowId) {
  if (!escrowId) throw new Error('Escrow ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/escrow-management/escrows/${encodeURIComponent(escrowId)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load escrow detail');
  }

  return json;
}

/**
 * Update escrow status
 * @param {string} escrowId - Escrow ID (e.g. ESC-2025-001)
 * @param {string} status - New status (e.g. completed, active, cancelled, disputed, pending)
 * @returns {Promise<{ success: boolean; message: string; data?: { status: string } }>}
 */
export async function updateEscrowStatus(escrowId, status) {
  if (!escrowId) throw new Error('Escrow ID is required');
  if (!status) throw new Error('Status is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/escrow-management/escrows/${encodeURIComponent(escrowId)}/status`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to update escrow status');
  }

  return json;
}

/**
 * Fetch escrow fees summary (total collected fees available for withdrawal)
 * Backend: GET /api/admin/escrow-management/fees
 * @returns {Promise<{ success: boolean; message: string; data?: { totalFeesUsd?, totalFeesXrp?, currency?, availableBalance? } }>}
 */
export async function fetchEscrowFeesSummary() {
  const response = await fetch(`${API_BASE_URL}/admin/escrow-management/fees`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || json.error || 'Failed to load escrow fees');
  return json;
}

/**
 * Withdraw escrow fees (admin withdraws collected fees to a destination)
 * Backend: POST /api/admin/escrow-management/fees/withdraw
 * @param {Object} body - { destinationAddress?, amountUsd?, amountXrp? } (optional = withdraw all to default)
 * @returns {Promise<{ success: boolean; message: string; data?: object }>}
 */
export async function withdrawEscrowFees(body = {}) {
  const response = await fetch(`${API_BASE_URL}/admin/escrow-management/fees/withdraw`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || json.error || 'Failed to withdraw fees');
  return json;
}
