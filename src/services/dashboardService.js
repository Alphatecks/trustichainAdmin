/**
 * Dashboard API service
 * Uses the logged-in user's token from authService for Bearer auth.
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
 * Fetch dashboard overview
 * @returns {Promise<{ success: boolean; message: string; data?: { totalUsers, totalUsersChangePercent?, totalEscrows, totalEscrowsChangePercent?, totalTransactions, totalTransactionsChangePercent?, pendingActions, pendingActionsChangePercent? }; error?: string }>}
 */
export async function fetchDashboardOverview() {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/overview`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load dashboard overview');
  }

  return json;
}

/**
 * Fetch escrow insight
 * @param {string} [period='last_month'] - e.g. 'last_month', 'this_month', 'last_3_months'
 * @returns {Promise<{ success: boolean; message: string; data?: { period, approvedCount, pendingCount, approvedPercent, pendingPercent, items }; error?: string }>}
 */
export async function fetchEscrowInsight(period = 'last_month') {
  const params = new URLSearchParams({ period });
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/escrow-insight?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load escrow insight');
  }

  return json;
}

/**
 * Fetch dispute resolution
 * @param {string} [period='last_6_months'] - e.g. 'last_6_months'
 * @returns {Promise<{ success: boolean; message: string; data?: { period, totalDisputesResolved, byMonth: Array<{ month, label, resolvedCount }> }; error?: string }>}
 */
export async function fetchDisputeResolution(period = 'last_6_months') {
  const params = new URLSearchParams({ period });
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/dispute-resolution?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load dispute resolution');
  }

  return json;
}

/**
 * Fetch live feed
 * @param {number} [limit=10]
 * @returns {Promise<{ success: boolean; message: string; data?: { items: Array<{ id, eventType, description, createdAt, createdAtAgo, userId?, relatedId? }>, total? }; error?: string }>}
 */
export async function fetchLiveFeed(limit = 10) {
  const params = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/live-feed?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load live feed');
  }

  return json;
}

/**
 * Fetch dashboard users (user overview)
 * @param {number} [limit=20]
 * @param {number} [offset=0]
 * @returns {Promise<{ success: boolean; message: string; data?: { users: Array<{ userId, fullName, email, accountType, kycStatus, totalVolumeUsd, lastActivityAt, lastActivityAgo? }>, total? }; error?: string }>}
 */
export async function fetchDashboardUsers(limit = 20, offset = 0) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/users?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load users');
  }

  return json;
}

/**
 * Fetch KYC list
 * @returns {Promise<{ success: boolean; message: string; data?: { items: Array<{ userId, fullName, email, kycStatus, submittedAt?, reviewedAt? }> }; error?: string }>}
 */
export async function fetchKycList() {
  const response = await fetch(`${API_BASE_URL}/admin/kyc`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load KYC list');
  }

  return json;
}

/**
 * Fetch KYC detail for a user
 * @param {string} userId - User UUID
 * @returns {Promise<{ success: boolean; message: string; data?: { userId, fullName, email, kycStatus, submittedAt?, reviewedAt?, documents? }; error?: string }>}
 */
export async function fetchKycDetail(userId) {
  const response = await fetch(`${API_BASE_URL}/admin/kyc/${encodeURIComponent(userId)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load KYC detail');
  }

  return json;
}

/**
 * Approve or decline KYC
 * @param {string} userId - User UUID
 * @param {'verified' | 'declined'} status - 'verified' to approve, 'declined' to decline
 * @returns {Promise<{ success: boolean; message: string; data?: { kycStatus }; error?: string }>}
 */
export async function kycApproveOrDecline(userId, status) {
  const response = await fetch(`${API_BASE_URL}/admin/kyc/approve`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, status }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to update KYC status');
  }

  return json;
}

/**
 * Fetch alerts
 * @returns {Promise<{ success: boolean; message: string; data?: { alerts: Array<{ id, heading, subHeading?, actionUrl?, createdAt }> }; error?: string }>}
 */
export async function fetchAlerts() {
  const response = await fetch(`${API_BASE_URL}/admin/alerts`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load alerts');
  }

  return json;
}
