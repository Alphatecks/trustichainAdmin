/**
 * User Management API service
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
 * Fetch user management overview stats
 * @returns {Promise<{ success: boolean; message: string; data?: { totalUsers, totalUsersChangePercent?, verifiedUsers, verifiedUsersChangePercent?, personalSuiteUsers, personalSuiteUsersChangePercent?, businessSuiteUsers, businessSuiteUsersChangePercent? }; error?: string }>}
 */
export async function fetchUserManagementStats() {
  const response = await fetch(`${API_BASE_URL}/admin/user-management/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load user management stats');
  }

  return json;
}

/**
 * Fetch single user detail by id
 * @param {string} userId - User UUID
 * @returns {Promise<{ success: boolean; message: string; data?: Object }; error?: string }>}
 */
export async function fetchUserDetail(userId) {
  if (!userId) throw new Error('User ID is required');
  const response = await fetch(`${API_BASE_URL}/admin/user-management/users/${encodeURIComponent(userId)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load user detail');
  }

  return json;
}

/**
 * Update one user's KYC status
 * @param {string} userId - User UUID
 * @param {string} status - e.g. 'verified' | 'declined' | 'pending'
 * @returns {Promise<{ success: boolean; message: string; data?: { kycStatus }; error?: string }>}
 */
export async function updateUserKycStatus(userId, status) {
  if (!userId) throw new Error('User ID is required');
  if (!status) throw new Error('Status is required');
  const response = await fetch(`${API_BASE_URL}/admin/user-management/users/${encodeURIComponent(userId)}/kyc-status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to update KYC status');
  }

  return json;
}

/**
 * Fetch user management users list
 * @param {Object} params
 * @param {string} [params.accountType] - 'personal' | 'business_suite'
 * @param {number} [params.page=1]
 * @param {number} [params.pageSize=10]
 * @param {string} [params.kycStatus] - 'verified' | 'unverified'
 * @param {string} [params.searchQuery]
 * @returns {Promise<{ success: boolean; message: string; data?: { totalPages, currentPage, totalUsers, pageSize, users }; error?: string }>}
 */
export async function fetchUserManagementUsers({ accountType, page = 1, pageSize = 10, kycStatus, searchQuery } = {}) {
  const searchParams = new URLSearchParams();
  if (accountType) searchParams.set('accountType', accountType);
  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));
  if (kycStatus) searchParams.set('kycStatus', kycStatus);
  if (searchQuery && searchQuery.trim()) searchParams.set('searchQuery', searchQuery.trim());

  const response = await fetch(`${API_BASE_URL}/admin/user-management/users?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load users');
  }

  return json;
}
