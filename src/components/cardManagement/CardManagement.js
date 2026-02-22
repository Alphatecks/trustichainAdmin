import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import { fetchCardManagementOverview, fetchCards } from '../../services/cardManagementService';
import './CardManagement.css';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ['All', 'Active', 'Blocked', 'Pending', 'Expired'];

const formatTableDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    const day = d.getDate();
    const ord = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    const month = d.toLocaleString('en-GB', { month: 'short' });
    const year = d.getFullYear();
    return `${day}${ord} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

const formatExpiry = (month, year) => {
  if (month == null || year == null) return '—';
  const m = String(month).padStart(2, '0');
  const y = String(year).length === 4 ? String(year).slice(-2) : String(year);
  return `${m}/${y}`;
};

const getStatusClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'active') return 'active';
  if (s === 'blocked') return 'blocked';
  if (s === 'pending') return 'pending';
  if (s === 'expired') return 'expired';
  return '';
};

const getCardGradient = (brand) => {
  const b = (brand || '').toLowerCase();
  if (b === 'visa') return 'linear-gradient(135deg, #1a1f71 0%, #2d3a9f 50%, #0671FF 100%)';
  if (b === 'mastercard') return 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)';
  return 'linear-gradient(135deg, #333 0%, #0671FF 100%)';
};

const CardManagement = ({ onMenuClick }) => {
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);
  const [listData, setListData] = useState({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 });
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  useEffect(() => {
    let cancelled = false;
    setOverviewLoading(true);
    setOverviewError(null);
    fetchCardManagementOverview()
      .then((res) => { if (!cancelled && res?.success && res?.data) setOverview(res.data); })
      .catch((e) => { if (!cancelled) setOverviewError(e.message || 'Failed to load overview'); })
      .finally(() => { if (!cancelled) setOverviewLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    setListError(null);
    fetchCards({
      page: listData.page,
      pageSize: listData.pageSize,
      status: statusFilter === 'All' ? undefined : statusFilter,
      search: searchQuery || undefined,
    })
      .then((res) => {
        if (!cancelled && res?.success && res?.data) {
          setListData((prev) => ({
            ...prev,
            items: res.data.items || [],
            total: res.data.total ?? 0,
            totalPages: res.data.totalPages ?? 0,
            page: res.data.page ?? prev.page,
          }));
        }
      })
      .catch((e) => { if (!cancelled) setListError(e.message || 'Failed to load cards'); })
      .finally(() => { if (!cancelled) setListLoading(false); });
    return () => { cancelled = true; };
  }, [listData.page, listData.pageSize, statusFilter, searchQuery]);

  const setPage = (p) => {
    if (p < 1 || p > listData.totalPages) return;
    setListData((prev) => ({ ...prev, page: p }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setListData((prev) => ({ ...prev, page: 1 }));
  };

  const { items, page, totalPages, total } = listData;

  return (
    <Layout activeMenu="cardManagement" onMenuClick={onMenuClick}>
      <div className="cm-page">
        <header className="cm-header">
          <div className="cm-breadcrumb">Admin End &gt; Card Management</div>
          <form className="cm-search-wrap" onSubmit={handleSearchSubmit}>
            <svg className="cm-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="cm-search-input"
              placeholder="Search by last 4, holder, or email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          <div className="cm-profile">
            <span className="cm-avatar">SC</span>
            <div className="cm-profile-info">
              <span className="cm-profile-name">Sarah Chen</span>
              <span className="cm-profile-role">Admin</span>
            </div>
          </div>
        </header>

        <section className="cm-overview">
          {overviewError && <div className="cm-overview-error">{overviewError}</div>}
          <div className="cm-overview-grid">
            <div className="cm-metric-card">
              <div className="cm-metric-icon cm-metric-icon--cards">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <div className="cm-metric-content">
                <span className="cm-metric-label">Total cards</span>
                <span className="cm-metric-value">{overviewLoading ? '—' : overview ? overview.totalCards?.toLocaleString() ?? '—' : '—'}</span>
              </div>
            </div>
            <div className="cm-metric-card">
              <div className="cm-metric-icon cm-metric-icon--active">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <div className="cm-metric-content">
                <span className="cm-metric-label">Active</span>
                <span className="cm-metric-value">{overviewLoading ? '—' : overview ? overview.activeCards?.toLocaleString() ?? '—' : '—'}</span>
              </div>
            </div>
            <div className="cm-metric-card">
              <div className="cm-metric-icon cm-metric-icon--blocked">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div className="cm-metric-content">
                <span className="cm-metric-label">Blocked</span>
                <span className="cm-metric-value">{overviewLoading ? '—' : overview ? overview.blockedCards?.toLocaleString() ?? '—' : '—'}</span>
              </div>
            </div>
            <div className="cm-metric-card">
              <div className="cm-metric-icon cm-metric-icon--expiring">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div className="cm-metric-content">
                <span className="cm-metric-label">Expiring soon</span>
                <span className="cm-metric-value">{overviewLoading ? '—' : overview ? overview.expiringSoon?.toLocaleString() ?? '—' : '—'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cm-main">
          <div className="cm-toolbar">
            <div className="cm-toolbar-left">
              <select
                className="cm-filter-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setListData((prev) => ({ ...prev, page: 1 })); }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="cm-view-toggle">
                <button
                  type="button"
                  className={`cm-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Table view"
                  aria-pressed={viewMode === 'table'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/></svg>
                </button>
                <button
                  type="button"
                  className={`cm-view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setViewMode('cards')}
                  title="Card view"
                  aria-pressed={viewMode === 'cards'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/></svg>
                </button>
              </div>
            </div>
            <div className="cm-toolbar-right">
              <span className="cm-result-count">{total} card{total !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {listError && <div className="cm-list-error">{listError}</div>}

          {viewMode === 'table' && (
            <div className="cm-table-wrap">
              <table className="cm-table">
                <thead>
                  <tr>
                    <th>Brand</th>
                    <th>Last 4</th>
                    <th>Cardholder</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Expiry</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!listError && listLoading && items.length === 0 && (
                    <tr><td colSpan={8} className="cm-table-loading">Loading…</td></tr>
                  )}
                  {!listError && !listLoading && items.length === 0 && (
                    <tr><td colSpan={8} className="cm-table-empty">No cards found</td></tr>
                  )}
                  {items.map((card) => (
                    <tr key={card.id}>
                      <td><span className="cm-brand-badge">{card.brand}</span></td>
                      <td className="cm-cell-mono">•••• {card.last4}</td>
                      <td>{card.holder || '—'}</td>
                      <td className="cm-cell-email">{card.userEmail || '—'}</td>
                      <td>
                        <span className={`cm-status cm-status--${getStatusClass(card.status)}`}>
                          {(card.status || '—').charAt(0).toUpperCase() + (card.status || '').slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>{formatExpiry(card.expiryMonth, card.expiryYear)}</td>
                      <td>{formatTableDate(card.createdAt)}</td>
                      <td>
                        <div className="cm-actions">
                          <button type="button" className="cm-action-btn" title="View">View</button>
                          <button type="button" className="cm-action-btn cm-action-btn--secondary" title={card.status === 'blocked' ? 'Unblock' : 'Block'}>
                            {card.status === 'blocked' ? 'Unblock' : 'Block'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === 'cards' && (
            <div className="cm-cards-grid">
              {listLoading && items.length === 0 && <div className="cm-cards-loading">Loading…</div>}
              {!listLoading && items.length === 0 && <div className="cm-cards-empty">No cards found</div>}
              {items.map((card) => (
                <div key={card.id} className="cm-card-tile" style={{ '--card-gradient': getCardGradient(card.brand) }}>
                  <div className="cm-card-tile-chip">•••• •••• •••• {card.last4}</div>
                  <div className="cm-card-tile-brand">{card.brand}</div>
                  <div className="cm-card-tile-holder">{card.holder || '—'}</div>
                  <div className="cm-card-tile-meta">
                    <span>Expires {formatExpiry(card.expiryMonth, card.expiryYear)}</span>
                    <span className={`cm-card-tile-status cm-status--${getStatusClass(card.status)}`}>
                      {(card.status || '').toLowerCase()}
                    </span>
                  </div>
                  <div className="cm-card-tile-actions">
                    <button type="button" className="cm-card-action">View</button>
                    <button type="button" className="cm-card-action">{card.status === 'blocked' ? 'Unblock' : 'Block'}</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 0 && (
            <div className="cm-pagination">
              <button type="button" className="cm-pagination-btn" disabled={listLoading || page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {Array.from({ length: Math.min(5, Math.max(1, totalPages)) }, (_, i) => {
                let p;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                return (
                  <button
                    key={p}
                    type="button"
                    className={`cm-pagination-num ${p === page ? 'active' : ''}`}
                    disabled={listLoading}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
              <button type="button" className="cm-pagination-btn" disabled={listLoading || page >= totalPages} onClick={() => setPage(page + 1)} aria-label="Next">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default CardManagement;
