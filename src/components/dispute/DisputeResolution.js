import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import DisputeDetail from './DisputeDetail';
import { fetchDisputeMetrics, fetchDisputeAlerts, fetchDisputes } from '../../services/disputeService';
import './DisputeResolution.css';

const PAGE_SIZE = 10;
const statusFromFilter = (filter) => {
  if (filter === 'In progress') return 'active';
  if (filter === 'Completed') return 'resolved';
  if (filter === 'Pending') return 'pending';
  return undefined;
};

const formatTableTimestamp = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    const day = d.getDate();
    const ord = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    const month = d.toLocaleString('en-GB', { month: 'short' });
    const year = String(d.getFullYear()).slice(-2);
    return `${time} ${day}${ord} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

const DisputeResolution = ({ onMenuClick }) => {
  const [filterAll, setFilterAll] = useState('All');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState(null);

  const [alertsList, setAlertsList] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState(null);

  const [listData, setListData] = useState({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 });
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setMetricsError(null);
        const res = await fetchDisputeMetrics();
        if (!cancelled && res?.success && res?.data) setMetrics(res.data);
      } catch (err) {
        if (!cancelled) setMetricsError(err.message || 'Failed to load metrics');
      } finally {
        if (!cancelled) setMetricsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setAlertsError(null);
        const res = await fetchDisputeAlerts(10);
        if (!cancelled && res?.success && res?.data?.alerts) setAlertsList(res.data.alerts);
      } catch (err) {
        if (!cancelled) setAlertsError(err.message || 'Failed to load alerts');
      } finally {
        if (!cancelled) setAlertsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setListError(null);
        const res = await fetchDisputes({
          page: listData.page,
          pageSize: listData.pageSize,
          sortBy: 'opened_at',
          sortOrder: 'desc',
          status: statusFromFilter(filterAll),
          search: searchQuery || undefined,
        });
        if (!cancelled && res?.success && res?.data) {
          setListData((prev) => ({
            ...prev,
            items: res.data.items || [],
            total: res.data.total ?? 0,
            totalPages: res.data.totalPages ?? 0,
          }));
        }
      } catch (err) {
        if (!cancelled) setListError(err.message || 'Failed to load disputes');
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [listData.page, listData.pageSize, filterAll, searchQuery]);

  const setPage = (p) => {
    if (p < 1 || p > listData.totalPages) return;
    setListLoading(true);
    setListData((prev) => ({ ...prev, page: p }));
  };

  const formatTrend = (percent) => {
    if (percent == null) return null;
    const isUp = Number(percent) >= 0;
    return (
      <div className="dr-metric-trend">
        {isUp ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 18l6-6 10 6" stroke="#c53030" strokeWidth="2" fill="none"/></svg>
        )}
        <span>{isUp ? '+' : ''}{Number(percent)}% in the past month</span>
      </div>
    );
  };

  const { items, page, totalPages } = listData;

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'active' || s === 'in progress') return 'in-progress';
    if (s === 'resolved' || s === 'completed') return 'completed';
    if (s === 'pending') return 'pending';
    return '';
  };

  if (selectedDispute) {
    return (
      <Layout activeMenu="dispute" onMenuClick={onMenuClick}>
        <div className="dr-page">
          <DisputeDetail dispute={selectedDispute} onBack={() => setSelectedDispute(null)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeMenu="dispute" onMenuClick={onMenuClick}>
      <div className="dr-page">
        <header className="dr-header">
          <div className="dr-breadcrumb">Admin End &gt; Dispute Resolution</div>
          <div className="dr-search">
            <svg className="dr-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
          <div className="dr-profile">
            <button type="button" className="dr-notification-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.23858 2 5 4.23858 5 7V11C5 12.1046 4.10457 13 3 13H17C15.8954 13 15 12.1046 15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 15C7 16.1046 8.34315 17 10 17C11.6569 17 13 16.1046 13 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="dr-notification-dot" />
            </button>
            <span className="dr-avatar">SC</span>
            <div className="dr-profile-info">
              <span className="dr-profile-name-row">
                <span className="dr-profile-name">Sarah Chen</span>
                <img src={require('../../assets/images/Frame.png')} alt="" className="dr-verified-badge" />
              </span>
              <span className="dr-profile-role">Freelancer</span>
            </div>
          </div>
        </header>

        <div className="dr-content">
          {/* Overview: 4 cards in a row */}
          <section className="dr-overview-section">
            {metricsError && <div className="dr-metrics-error">{metricsError}</div>}
            <div className="dr-section-title">
              <span className="dr-section-bar" />
              <span>Overview</span>
            </div>
            <div className="dr-overview-grid">
              <div className="dr-overview-card">
                <div className="dr-overview-card-head">
                  <div className="dr-overview-icon dr-overview-icon--people">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  {metrics && formatTrend(metrics.totalDisputesChangePercent)}
                </div>
                <div className="dr-overview-label">Total Dispute</div>
                <div className="dr-overview-value">{metricsLoading ? '—' : metrics ? new Intl.NumberFormat('en-US').format(metrics.totalDisputes) : '—'}</div>
              </div>
              <div className="dr-overview-card">
                <div className="dr-overview-card-head">
                  <div className="dr-overview-icon dr-overview-icon--active">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M23 7l-7 5 7 5V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
                  </div>
                  {metrics && formatTrend(metrics.activeDisputesChangePercent)}
                </div>
                <div className="dr-overview-label">Active Dispute</div>
                <div className="dr-overview-value">{metricsLoading ? '—' : metrics ? new Intl.NumberFormat('en-US').format(metrics.activeDisputes) : '—'}</div>
              </div>
              <div className="dr-overview-card">
                <div className="dr-overview-card-head">
                  <div className="dr-overview-icon dr-overview-icon--resolved">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  {metrics && formatTrend(metrics.resolvedDisputesChangePercent)}
                </div>
                <div className="dr-overview-label">Resolved Dispute</div>
                <div className="dr-overview-value">{metricsLoading ? '—' : metrics ? new Intl.NumberFormat('en-US').format(metrics.resolvedDisputes) : '—'}</div>
              </div>
              <div className="dr-overview-card">
                <div className="dr-overview-card-head">
                  <div className="dr-overview-icon dr-overview-icon--time">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                </div>
                <div className="dr-overview-label">Average Res Time</div>
                <div className="dr-overview-value">{metricsLoading ? '—' : (metrics?.averageResolutionTimeLabel ?? (metrics?.averageResolutionTimeHours != null ? `${metrics.averageResolutionTimeHours}hr` : '—'))}</div>
              </div>
            </div>
          </section>

          {/* Business Tools: table */}
          <section className="dr-table-card">
            <div className="dr-table-header">
              <div className="dr-section-title">
                <span className="dr-section-bar" />
                <span>Business Tools</span>
              </div>
              <div className="dr-toolbar">
                <div className="dr-table-search">
                  <svg className="dr-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { setSearchQuery(searchInput); setListData((p) => ({ ...p, page: 1 })); setListLoading(true); } }}
                  />
                </div>
                <select
                  className="dr-filter-select"
                  value={filterAll}
                  onChange={(e) => { setFilterAll(e.target.value); setListData((p) => ({ ...p, page: 1 })); setListLoading(true); }}
                >
                  <option>All</option>
                  <option>In progress</option>
                  <option>Completed</option>
                  <option>Pending</option>
                </select>
                <button type="button" className="dr-filter-btn" aria-label="Filter">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5h14M5 10h10M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="3" cy="5" r="2" fill="currentColor"/>
                    <circle cx="10" cy="10" r="2" fill="currentColor"/>
                    <circle cx="7" cy="15" r="2" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="dr-table-wrap">
              <table className="dr-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Description</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listError && (
                    <tr><td colSpan={5} className="dr-list-error">{listError}</td></tr>
                  )}
                  {!listError && listLoading && items.length === 0 && (
                    <tr><td colSpan={5} className="dr-list-loading">Loading…</td></tr>
                  )}
                  {!listError && !listLoading && items.length === 0 && (
                    <tr><td colSpan={5} className="dr-list-empty">No disputes found</td></tr>
                  )}
                  {!listError && items.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedDispute({ ...row, party1: row.party1Name, party2: row.party2Name })}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDispute({ ...row, party1: row.party1Name, party2: row.party2Name }); } }}
                      className="dr-table-row-clickable"
                    >
                      <td>
                        <div className="dr-id-cell">
                          <span className="dr-id-dot" />
                          <span>{row.caseId}</span>
                        </div>
                      </td>
                      <td>
                        <div className="dr-description-cell">
                          <span className="dr-desc-name">{row.party1Name ?? '—'}</span>
                          <span className="dr-desc-address">{row.party2Name ?? '—'}</span>
                        </div>
                      </td>
                      <td className="dr-timestamp-cell">{formatTableTimestamp(row.openedAt)}</td>
                      <td><span className={`dr-status dr-status--${getStatusClass(row.status)}`}>{row.statusLabel ?? row.status ?? '—'}</span></td>
                      <td>
                        <button
                          type="button"
                          className="dr-view-btn"
                          aria-label="View"
                          onClick={(e) => { e.stopPropagation(); setSelectedDispute({ ...row, party1: row.party1Name, party2: row.party2Name }); }}
                        >
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="dr-pagination">
              <button
                type="button"
                className="dr-page-btn"
                disabled={listLoading || page <= 1}
                onClick={() => setPage(page - 1)}
                aria-label="Previous"
              >
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
                    className={`dr-page-num ${p === page ? 'active' : ''}`}
                    disabled={listLoading}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && <span className="dr-page-ellipsis">…</span>}
              {totalPages > 5 && page < totalPages - 2 && (
                <button type="button" className="dr-page-num" disabled={listLoading} onClick={() => setPage(totalPages)}>
                  {totalPages}
                </button>
              )}
              <button
                type="button"
                className="dr-page-btn"
                disabled={listLoading || page >= totalPages}
                onClick={() => setPage(page + 1)}
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </section>

          {/* Dispute Alerts (compact, below table) */}
          <section className="dr-alert-card dr-alert-card--compact">
            {alertsError && <div className="dr-alerts-error">{alertsError}</div>}
            <div className="dr-section-title">
              <span className="dr-section-bar" />
              <span>Dispute Alert Level</span>
            </div>
            <ul className="dr-alert-list">
              {alertsLoading && alertsList.length === 0 && (
                <li className="dr-alert-item dr-alert-item--loading">Loading alerts…</li>
              )}
              {!alertsLoading && alertsList.length === 0 && !alertsError && (
                <li className="dr-alert-item dr-alert-item--empty">No alerts</li>
              )}
              {alertsList.slice(0, 5).map((alert) => (
                <li key={alert.id} className="dr-alert-item">
                  <div className="dr-alert-content">
                    <div className="dr-alert-title">{alert.title}</div>
                    <div className="dr-alert-desc">{alert.description}</div>
                  </div>
                  <div className="dr-alert-right">
                    <span className="dr-alert-time">{alert.createdAtAgo ?? (alert.createdAt ? new Date(alert.createdAt).toLocaleString() : '—')}</span>
                    <button
                      type="button"
                      className="dr-alert-btn"
                      onClick={() => setSelectedDispute({ caseId: alert.caseId, id: alert.disputeId })}
                    >
                      View
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default DisputeResolution;
