/**
 * Card Management API service
 * Replace mock implementations with real API calls when backend endpoints exist.
 */

import { authService } from './authService';

const API_BASE_URL = 'https://trustichain-backend.onrender.com/api'; // eslint-disable-line no-unused-vars -- for real API

const getAuthHeaders = () => { // eslint-disable-line no-unused-vars -- for real API
  let token = authService.getToken();
  if (!token) token = localStorage.getItem('adminToken');
  if (token && token.startsWith('Bearer ')) token = token.slice(7);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Mock data until backend provides GET /api/admin/card-management/overview and /cards
const MOCK_OVERVIEW = {
  totalCards: 1247,
  activeCards: 1189,
  blockedCards: 42,
  expiringSoon: 16,
};

const MOCK_CARDS = [
  { id: '1', brand: 'Visa', last4: '4242', holder: 'Sarah Chen', userEmail: 'sarah.chen@example.com', status: 'active', expiryMonth: 12, expiryYear: 2026, createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', brand: 'Mastercard', last4: '5555', holder: 'James Wilson', userEmail: 'j.wilson@example.com', status: 'active', expiryMonth: 8, expiryYear: 2025, createdAt: '2024-03-22T14:30:00Z' },
  { id: '3', brand: 'Visa', last4: '8888', holder: 'Emma Davis', userEmail: 'emma.d@example.com', status: 'blocked', expiryMonth: 3, expiryYear: 2027, createdAt: '2024-06-10T09:15:00Z' },
  { id: '4', brand: 'Visa', last4: '1234', holder: 'Alex Rivera', userEmail: 'alex.r@example.com', status: 'active', expiryMonth: 1, expiryYear: 2025, createdAt: '2024-09-01T11:00:00Z' },
  { id: '5', brand: 'Mastercard', last4: '9999', holder: 'Jordan Lee', userEmail: 'j.lee@example.com', status: 'pending', expiryMonth: 11, expiryYear: 2026, createdAt: '2025-01-08T16:45:00Z' },
  { id: '6', brand: 'Visa', last4: '5678', holder: 'Taylor Brown', userEmail: 'taylor.b@example.com', status: 'active', expiryMonth: 5, expiryYear: 2027, createdAt: '2024-11-20T08:00:00Z' },
];

function mockDelay(ms = 400) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Fetch card management overview (totals, active, blocked, expiring soon)
 * Backend: GET /api/admin/card-management/overview
 */
export async function fetchCardManagementOverview() {
  await mockDelay();
  return { success: true, message: 'OK', data: MOCK_OVERVIEW };
  // Real implementation:
  // const response = await fetch(`${API_BASE_URL}/admin/card-management/overview`, { method: 'GET', headers: getAuthHeaders() });
  // const json = await response.json();
  // if (!response.ok) throw new Error(json.message || json.error || 'Failed to load overview');
  // return json;
}

/**
 * Fetch cards list with optional filters and pagination
 * @param {Object} params - { page, pageSize, status?, search? }
 * Backend: GET /api/admin/card-management/cards?page=&pageSize=&status=&search=
 */
export async function fetchCards(params = {}) {
  const { page = 1, pageSize = 10, status, search } = params;
  await mockDelay();
  let items = [...MOCK_CARDS];
  if (status && status !== 'All') {
    items = items.filter((c) => (c.status || '').toLowerCase() === (status || '').toLowerCase());
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    items = items.filter(
      (c) =>
        (c.last4 && c.last4.toLowerCase().includes(q)) ||
        (c.holder && c.holder.toLowerCase().includes(q)) ||
        (c.userEmail && c.userEmail.toLowerCase().includes(q)) ||
        (c.brand && c.brand.toLowerCase().includes(q))
    );
  }
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  items = items.slice(start, start + pageSize);
  return {
    success: true,
    message: 'OK',
    data: { items, total, page, pageSize, totalPages },
  };
  // Real implementation: build URLSearchParams and fetch, then return json.
}
