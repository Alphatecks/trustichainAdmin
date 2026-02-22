import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import { fetchEscrowDetail, updateEscrowStatus } from '../../services/escrowService';
import './EscrowDetail.css';

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
};

const formatUsd = (n) => (n != null && n !== '' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Number(n)) : '—');

const formatStatusLabel = (s) => {
  if (!s) return '—';
  const lower = String(s).toLowerCase();
  if (lower === 'active') return 'Active';
  return String(s).charAt(0).toUpperCase() + String(s).slice(1).toLowerCase();
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'in progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'disputed', label: 'Disputed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const EscrowDetail = ({ escrowId, onBack, onMenuClick }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusSelect, setStatusSelect] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState(null);

  useEffect(() => {
    if (!escrowId) {
      setDetail(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchEscrowDetail(escrowId)
      .then((res) => {
        if (!cancelled && res?.success && res?.data) setDetail(res.data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load escrow');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [escrowId]);

  useEffect(() => {
    if (detail?.status != null) setStatusSelect(String(detail.status).toLowerCase());
  }, [detail?.status]);

  const handleStatusUpdate = () => {
    const newStatus = statusSelect.trim();
    if (!escrowId || !newStatus || statusUpdateLoading) return;
    setStatusUpdateError(null);
    setStatusUpdateLoading(true);
    updateEscrowStatus(escrowId, newStatus)
      .then((res) => {
        if (res?.success && res?.data?.status != null) {
          setDetail((prev) => (prev ? { ...prev, status: res.data.status } : null));
        }
      })
      .catch((e) => setStatusUpdateError(e.message || 'Failed to update status'))
      .finally(() => setStatusUpdateLoading(false));
  };

  const getStatusClass = (s) => {
    const status = (s || '').toLowerCase();
    if (status === 'completed') return 'ed-status--completed';
    if (status === 'active' || status === 'in progress') return 'ed-status--active';
    if (status === 'cancelled') return 'ed-status--cancelled';
    if (status === 'disputed') return 'ed-status--disputed';
    if (status === 'pending') return 'ed-status--pending';
    return '';
  };

  if (!escrowId) {
    return (
      <Layout activeMenu="escrow" onMenuClick={onMenuClick}>
        <div className="ed-page">
          <div className="ed-empty">
            No escrow selected. <button type="button" className="ed-back-link" onClick={onBack}>Back to Escrow Management</button>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout activeMenu="escrow" onMenuClick={onMenuClick}>
        <div className="ed-page">
          <div className="ed-loading">Loading escrow details…</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout activeMenu="escrow" onMenuClick={onMenuClick}>
        <div className="ed-page">
          <div className="ed-error">{error}. <button type="button" className="ed-back-link" onClick={onBack}>Back to Escrow Management</button></div>
        </div>
      </Layout>
    );
  }

  const d = detail;
  const party1 = d?.party1;
  const party2 = d?.party2;

  return (
    <Layout activeMenu="escrow" onMenuClick={onMenuClick}>
      <div className="ed-page">
        <header className="ed-header">
          <div className="ed-breadcrumb" onClick={onBack} onKeyDown={(e) => e.key === 'Enter' && onBack?.()} role="button" tabIndex={0}>
            Admin End &gt; Escrow Management
          </div>
          <div className="ed-search">
            <svg className="ed-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Search" />
          </div>
          <div className="ed-profile">
            <span className="ed-avatar">SC</span>
            <span className="ed-profile-role">Admin</span>
          </div>
        </header>

        <div className="ed-grid">
          <div className="ed-left">
            <section className="ed-card">
              <div className="ed-card-title-row">
                <span className="ed-card-bar" />
                <h3 className="ed-card-title">Escrow overview</h3>
              </div>
              <div className="ed-hero-row">
                <span className="ed-escrow-id">{d?.escrowId ?? '—'}</span>
                <span className={`ed-status ${getStatusClass(d?.status)}`}>{formatStatusLabel(d?.status)}</span>
              </div>
              <div className="ed-attrs">
                <div className="ed-attr">
                  <span className="ed-attr-label">Amount (USD)</span>
                  <span className="ed-attr-value">{formatUsd(d?.amountUsd)}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Amount (XRP)</span>
                  <span className="ed-attr-value">{d?.amountXrp != null ? Number(d.amountXrp).toLocaleString() : '—'}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Progress</span>
                  <span className="ed-attr-value">{d?.progress != null ? `${d.progress}%` : '—'}</span>
                </div>
                <div className="ed-attr ed-attr--full">
                  <span className="ed-attr-label">Description</span>
                  <span className="ed-attr-value">{d?.description ?? '—'}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Transaction type</span>
                  <span className="ed-attr-value">{d?.transactionType ?? '—'}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Industry</span>
                  <span className="ed-attr-value">{d?.industry ?? '—'}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Release type</span>
                  <span className="ed-attr-value">{d?.releaseType ?? '—'}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Created</span>
                  <span className="ed-attr-value">{formatDate(d?.createdAt)}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Updated</span>
                  <span className="ed-attr-value">{formatDate(d?.updatedAt)}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Completed</span>
                  <span className="ed-attr-value">{d?.completedAt ? formatDate(d.completedAt) : '—'}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Expected completion</span>
                  <span className="ed-attr-value">{d?.expectedCompletionDate ?? '—'}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Expected release</span>
                  <span className="ed-attr-value">{d?.expectedReleaseDate ?? '—'}</span>
                </div>
                <div className="ed-attr ed-attr--full">
                  <span className="ed-attr-label">XRPL Escrow ID</span>
                  <span className="ed-attr-value ed-attr-value--mono">{d?.xrplEscrowId ?? '—'}</span>
                </div>
              </div>
            </section>
          </div>
          <div className="ed-right">
            <section className="ed-card ed-card--status">
              <div className="ed-card-title-row">
                <span className="ed-card-bar" />
                <h3 className="ed-card-title">Update status</h3>
              </div>
              <div className="ed-status-update">
                <select
                  className="ed-status-select"
                  value={statusSelect}
                  onChange={(e) => setStatusSelect(e.target.value)}
                  disabled={statusUpdateLoading}
                  aria-label="Escrow status"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="ed-status-btn"
                  onClick={handleStatusUpdate}
                  disabled={statusUpdateLoading || statusSelect === (detail?.status && String(detail.status).toLowerCase())}
                >
                  {statusUpdateLoading ? 'Updating…' : 'Update status'}
                </button>
                {statusUpdateError && <span className="ed-status-error">{statusUpdateError}</span>}
              </div>
            </section>
            <section className="ed-card">
              <div className="ed-card-title-row">
                <span className="ed-card-bar" />
                <h3 className="ed-card-title">Party 1</h3>
              </div>
              <div className="ed-party">
                <div className="ed-attr">
                  <span className="ed-attr-label">Name</span>
                  <span className="ed-attr-value">{party1?.name ?? '—'}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Email</span>
                  <span className="ed-attr-value">{party1?.email ?? '—'}</span>
                </div>
                <div className="ed-attr ed-attr--full">
                  <span className="ed-attr-label">ID</span>
                  <span className="ed-attr-value ed-attr-value--mono">{party1?.id ?? '—'}</span>
                </div>
              </div>
            </section>
            <section className="ed-card">
              <div className="ed-card-title-row">
                <span className="ed-card-bar" />
                <h3 className="ed-card-title">Party 2</h3>
              </div>
              <div className="ed-party">
                <div className="ed-attr">
                  <span className="ed-attr-label">Name</span>
                  <span className="ed-attr-value">{party2?.name ?? '—'}</span>
                </div>
                <div className="ed-attr">
                  <span className="ed-attr-label">Email</span>
                  <span className="ed-attr-value">{party2?.email ?? '—'}</span>
                </div>
                <div className="ed-attr ed-attr--full">
                  <span className="ed-attr-label">ID</span>
                  <span className="ed-attr-value ed-attr-value--mono">{party2?.id ?? '—'}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EscrowDetail;
