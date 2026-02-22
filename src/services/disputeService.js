/**
 * Dispute Resolution API service
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
 * Fetch dispute resolution metrics (overview statistics)
 * @returns {Promise<{ success: boolean; message: string; data?: { totalDisputes, totalDisputesChangePercent, activeDisputes, activeDisputesChangePercent, resolvedDisputes, resolvedDisputesChangePercent, averageResolutionTimeHours, averageResolutionTimeLabel } }>}
 */
export async function fetchDisputeMetrics() {
  const response = await fetch(`${API_BASE_URL}/admin/dispute-resolution/metrics`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load dispute metrics');
  }

  return json;
}

/**
 * Fetch dispute alerts (alert level list)
 * @param {number} [limit=10] - Max number of alerts to return
 * @returns {Promise<{ success: boolean; message: string; data?: { alerts: Array<{ id, type, title, description, disputeId, caseId, createdAt, createdAtAgo }> } }>}
 */
export async function fetchDisputeAlerts(limit = 10) {
  const params = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/alerts?${params}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load dispute alerts');
  }

  return json;
}

/**
 * Fetch dispute list with pagination, sort and optional filters
 * @param {Object} params - { page, pageSize, sortBy, sortOrder, status?, search? }
 * @returns {Promise<{ success: boolean; message: string; data?: { items, total, page, pageSize, totalPages } }>}
 */
export async function fetchDisputes(params = {}) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = 'opened_at',
    sortOrder = 'desc',
    status,
    search,
  } = params;
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortBy,
    sortOrder,
  });
  if (status) searchParams.set('status', status);
  if (search && search.trim()) searchParams.set('search', search.trim());

  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes?${searchParams}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load dispute list');
  }

  return json;
}

/**
 * Fetch full dispute detail screen by caseId (e.g. DSP-2026-001 or ESC-2354-2425)
 * @param {string} caseId - Dispute case ID
 * @returns {Promise<{ success: boolean; message: string; data?: { dispute, party1, party2, mediator, evidence, timeline, verdict, preliminaryAssessment, messages } }>}
 */
export async function fetchDisputeDetailScreen(caseId) {
  if (!caseId) throw new Error('Case ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/detail-screen`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load dispute detail');
  }

  return json;
}

/**
 * Fetch evidence list for a dispute
 * @param {string} caseId - Dispute case ID
 * @returns {Promise<{ success: boolean; message: string; data?: { evidence: Array<{ id, title, description, evidenceType, fileUrl, fileName, fileType, fileSize, verified, uploadedAt }> } }>}
 */
export async function fetchDisputeEvidence(caseId) {
  if (!caseId) throw new Error('Case ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/evidence`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load evidence');
  }

  return json;
}

/**
 * Fetch timeline events for a dispute
 * @param {string} caseId - Dispute case ID
 * @returns {Promise<{ success: boolean; message: string; data?: { events: Array<{ id, eventType, title, description, eventTimestamp, createdAt, createdByName }> } }>}
 */
export async function fetchDisputeTimeline(caseId) {
  if (!caseId) throw new Error('Case ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/timeline`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to load timeline');
  }

  return json;
}

/**
 * Create timeline event for a dispute
 * @param {string} caseId - Dispute case ID
 * @param {Object} body - { eventType, title, description? }
 * @returns {Promise<{ success: boolean; message: string; data?: object }>}
 */
export async function addDisputeTimelineEvent(caseId, body) {
  if (!caseId) throw new Error('Case ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/timeline`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to create timeline event');
  }

  return json;
}

/**
 * Add evidence to a dispute
 * @param {string} caseId - Dispute case ID
 * @param {Object} body - { title, description, evidenceType, fileUrl, fileName, fileType, fileSize }
 * @returns {Promise<{ success: boolean; message: string; data?: object }>}
 */
export async function addDisputeEvidence(caseId, body) {
  if (!caseId) throw new Error('Case ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/evidence`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to add evidence');
  }

  return json;
}

/**
 * Update evidence (e.g. set verified)
 * @param {string} caseId - Dispute case ID
 * @param {string} evidenceId - Evidence item ID (e.g. ev-1)
 * @param {Object} body - e.g. { verified: true }
 * @returns {Promise<{ success: boolean; message: string; data?: object }>}
 */
export async function updateDisputeEvidence(caseId, evidenceId, body) {
  if (!caseId) throw new Error('Case ID is required');
  if (!evidenceId) throw new Error('Evidence ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/evidence/${encodeURIComponent(evidenceId)}`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to update evidence');
  }

  return json;
}

/**
 * Assign mediator to a dispute
 * @param {string} caseId - Dispute case ID
 * @param {string} mediatorUserId - Mediator user UUID
 * @returns {Promise<{ success: boolean; message: string; data?: { mediatorUserId } }>}
 */
export async function assignDisputeMediator(caseId, mediatorUserId) {
  if (!caseId) throw new Error('Case ID is required');
  if (!mediatorUserId || !mediatorUserId.trim()) throw new Error('Mediator user ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/mediator`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mediatorUserId: mediatorUserId.trim() }),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Failed to assign mediator');
  }

  return json;
}

/**
 * Fetch verdict for a dispute
 * @param {string} caseId - Dispute case ID
 * @returns {Promise<{ success: boolean; message: string; data?: { status, finalVerdict, decisionSummary, decisionOutcome, decisionDate } }>}
 */
export async function fetchDisputeVerdict(caseId) {
  if (!caseId) throw new Error('Case ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/verdict`,
    { method: 'GET', headers: getAuthHeaders() }
  );
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || json.error || 'Failed to load verdict');
  return json;
}

/**
 * Submit verdict for a dispute
 * @param {string} caseId - Dispute case ID
 * @param {Object} body - { finalVerdict, decisionSummary, decisionOutcome }
 * @returns {Promise<{ success: boolean; message: string; data?: object }>}
 */
export async function submitDisputeVerdict(caseId, body) {
  if (!caseId) throw new Error('Case ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/verdict`,
    { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }
  );
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || json.error || 'Failed to submit verdict');
  return json;
}

/**
 * Fetch preliminary assessment for a dispute
 * @param {string} caseId - Dispute case ID
 * @returns {Promise<{ success: boolean; message: string; data?: { id, title, summary, status, findings, createdAt, updatedAt } }>}
 */
export async function fetchPreliminaryAssessment(caseId) {
  if (!caseId) throw new Error('Case ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/assessments/preliminary`,
    { method: 'GET', headers: getAuthHeaders() }
  );
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || json.error || 'Failed to load assessment');
  return json;
}

/**
 * Upsert preliminary assessment for a dispute
 * @param {string} caseId - Dispute case ID
 * @param {Object} body - { title?, summary?, findings: Array<{ findingText, findingType?, orderIndex? }> }
 * @returns {Promise<{ success: boolean; message: string; data?: object }>}
 */
export async function upsertPreliminaryAssessment(caseId, body) {
  if (!caseId) throw new Error('Case ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/assessments/preliminary`,
    { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(body) }
  );
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || json.error || 'Failed to save assessment');
  return json;
}

/**
 * List messages for a dispute
 * @param {string} caseId - Dispute case ID
 * @param {number} [limit=50]
 * @returns {Promise<{ success: boolean; message: string; data?: { messages: Array, total } }>}
 */
export async function fetchDisputeMessages(caseId, limit = 50) {
  if (!caseId) throw new Error('Case ID is required');
  const params = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/messages?${params}`,
    { method: 'GET', headers: getAuthHeaders() }
  );
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || json.error || 'Failed to load messages');
  return json;
}

/**
 * Send a message in a dispute
 * @param {string} caseId - Dispute case ID
 * @param {Object} body - { messageText, senderRole }
 * @returns {Promise<{ success: boolean; message: string; data?: object }>}
 */
export async function sendDisputeMessage(caseId, body) {
  if (!caseId) throw new Error('Case ID is required');
  const response = await fetch(
    `${API_BASE_URL}/admin/dispute-resolution/disputes/${encodeURIComponent(caseId)}/messages`,
    { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }
  );
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || json.error || 'Failed to send message');
  return json;
}
