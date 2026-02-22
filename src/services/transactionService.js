/**
 * Transaction Management API service
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
 * Fetch transaction management overview stats
 * @returns {Promise<{ success: boolean; message: string; data?: { totalTransactionCount, totalTransactionCountChangePercent, totalAmountUsd, totalAmountUsdChangePercent, escrowedAmountUsd, escrowedAmountUsdChangePercent, payrollAmountUsd, payrollAmountUsdChangePercent } }>}
 */
export async function fetchTransactionOverview() {
  const response = await fetch(`${API_BASE_URL}/admin/transaction-management/overview`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load transaction overview');
  }

  return json;
}

/**
 * Fetch transaction list with pagination, sort and optional filters
 * @param {Object} params - { page, pageSize, sortBy, sortOrder, accountType?, status? }
 * @returns {Promise<{ success: boolean; message: string; data?: { items, total, page, pageSize, totalPages } }>}
 */
export async function fetchTransactions(params = {}) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = 'created_at',
    sortOrder = 'desc',
    accountType,
    status,
  } = params;
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortBy,
    sortOrder,
  });
  if (accountType) searchParams.set('accountType', accountType);
  if (status) searchParams.set('status', status);

  const response = await fetch(
    `${API_BASE_URL}/admin/transaction-management/transactions?${searchParams}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load transactions');
  }

  return json;
}

/**
 * Fetch single transaction detail by id (UUID)
 * @param {string} id - Transaction UUID
 * @returns {Promise<{ success: boolean; message: string; data?: Object }>}
 */
export async function fetchTransactionDetail(id) {
  if (!id) throw new Error('Transaction ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/transaction-management/transactions/${encodeURIComponent(id)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load transaction detail');
  }

  return json;
}
