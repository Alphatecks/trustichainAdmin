import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import { fetchBusinessManagementOverview, fetchBusinessManagementActivities, fetchBusinessManagementActivity } from '../../services/businessManagementService';
import '../dispute/DisputeResolution.css';
import './BusinessManagement.css';

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

const formatTableDate = (dateStr) => {
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

const PAGE_SIZE = 10;
const statusForApi = (filter) => {
  if (filter === 'All') return undefined;
  return filter;
};

const BusinessManagement = ({ onMenuClick }) => {
  const [filterAll, setFilterAll] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [activityDetail, setActivityDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);
  const [listData, setListData] = useState({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 });
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    setOverviewLoading(true);
    setOverviewError(null);
    fetchBusinessManagementOverview()
      .then((res) => {
        if (!cancelled && res?.success && res?.data) setOverview(res.data);
      })
      .catch((e) => {
        if (!cancelled) setOverviewError(e.message || 'Failed to load overview');
      })
      .finally(() => {
        if (!cancelled) setOverviewLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    setListError(null);
    fetchBusinessManagementActivities({
      page: listData.page,
      pageSize: listData.pageSize,
      status: statusForApi(filterAll),
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
      .catch((e) => {
        if (!cancelled) setListError(e.message || 'Failed to load activities');
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => { cancelled = true; };
  }, [listData.page, listData.pageSize, filterAll, searchQuery]);

  const setPage = (p) => {
    if (p < 1 || p > listData.totalPages) return;
    setListData((prev) => ({ ...prev, page: p }));
  };

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'in progress' || s === 'active') return 'in-progress';
    if (s === 'completed' || s === 'resolved') return 'completed';
    if (s === 'pending') return 'pending';
    return '';
  };

  const items = listData.items;
  const { page, totalPages } = listData;

  const activityName = (item) => item?.description?.name ?? item?.name ?? '—';
  const activityAddress = (item) => item?.description?.address ?? item?.location ?? '—';
  const activityDate = (item) => item?.date ?? (item?.createdAt ? formatTableDate(item.createdAt) : '—');

  useEffect(() => {
    if (!selectedActivityId) {
      setActivityDetail(null);
      setDetailError(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    setDetailError(null);
    fetchBusinessManagementActivity(selectedActivityId)
      .then((res) => {
        if (!cancelled && res?.success && res?.data) setActivityDetail(res.data);
      })
      .catch((e) => {
        if (!cancelled) setDetailError(e.message || 'Failed to load activity detail');
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedActivityId]);

  const handleBackFromDetail = () => {
    setSelectedActivityId(null);
    setActivityDetail(null);
    setDetailError(null);
  };

  if (selectedActivityId) {
    const d = activityDetail;
    return (
      <Layout activeMenu="businessManagement" onMenuClick={onMenuClick}>
        <div className="bm-page">
          <header className="dr-header">
            <div className="bm-breadcrumb-wrap">
              <button type="button" className="bm-back-link" onClick={handleBackFromDetail} aria-label="Back to list">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Back</span>
              </button>
              <span className="bm-breadcrumb-sep">Admin End &gt; Business Management</span>
            </div>
          </header>
          {detailLoading && <div className="bm-detail-loading">Loading activity detail…</div>}
          {!detailLoading && detailError && <div className="bm-detail-error">{detailError}</div>}
          {!detailLoading && !detailError && d && (
            <section className="bm-detail-card">
              <h2 className="bm-detail-title">Activity detail</h2>
              <dl className="bm-detail-list">
                <div className="bm-detail-row">
                  <dt>Activity</dt>
                  <dd><span className="dr-id-dot" style={{ marginRight: 8 }} /><span>{d.activityId}</span></dd>
                </div>
                <div className="bm-detail-row">
                  <dt>Activity ID</dt>
                  <dd>{d.activityId}</dd>
                </div>
                <div className="bm-detail-row">
                  <dt>Description (name)</dt>
                  <dd>{d.description?.name ?? '—'}</dd>
                </div>
                <div className="bm-detail-row">
                  <dt>Description (address)</dt>
                  <dd>{d.description?.address ?? '—'}</dd>
                </div>
                <div className="bm-detail-row">
                  <dt>Status</dt>
                  <dd><span className={`dr-status dr-status--${getStatusClass(d.status)}`}>{d.status}</span></dd>
                </div>
                <div className="bm-detail-row">
                  <dt>Date</dt>
                  <dd>{d.date ?? (d.createdAt ? formatTableDate(d.createdAt) : '—')}</dd>
                </div>
                {d.party1 && (
                  <>
                    <div className="bm-detail-row">
                      <dt>Party 1</dt>
                      <dd>{d.party1.name ?? '—'}{d.party1.email ? ` (${d.party1.email})` : ''}</dd>
                    </div>
                  </>
                )}
                {d.party2 && (
                  <>
                    <div className="bm-detail-row">
                      <dt>Party 2</dt>
                      <dd>{d.party2.name ?? '—'}{d.party2.email ? ` (${d.party2.email})` : ''}</dd>
                    </div>
                  </>
                )}
                {d.amountUsd != null && (
                  <div className="bm-detail-row">
                    <dt>Amount (USD)</dt>
                    <dd>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(d.amountUsd)}</dd>
                  </div>
                )}
                {d.amountXrp != null && (
                  <div className="bm-detail-row">
                    <dt>Amount (XRP)</dt>
                    <dd>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(d.amountXrp)} XRP</dd>
                  </div>
                )}
                {d.transactionType && (
                  <div className="bm-detail-row">
                    <dt>Transaction type</dt>
                    <dd>{d.transactionType}</dd>
                  </div>
                )}
                {d.industry && (
                  <div className="bm-detail-row">
                    <dt>Industry</dt>
                    <dd>{d.industry}</dd>
                  </div>
                )}
                {d.createdAt && (
                  <div className="bm-detail-row">
                    <dt>Created</dt>
                    <dd>{formatTableDate(d.createdAt)}</dd>
                  </div>
                )}
                {d.updatedAt && (
                  <div className="bm-detail-row">
                    <dt>Updated</dt>
                    <dd>{formatTableDate(d.updatedAt)}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeMenu="businessManagement" onMenuClick={onMenuClick}>
      <div className="bm-page">
        <header className="dr-header">
          <div className="dr-breadcrumb">Admin End &gt; Business Management</div>
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
          {/* Overview: 4 cards (from API) */}
          <section className="dr-overview-section">
            <div className="dr-section-title">
              <span className="dr-section-bar" />
              <span>Overview</span>
            </div>
            {overviewError && <div className="dr-metrics-error">{overviewError}</div>}
            <div className="dr-overview-grid">
              <div className="dr-overview-card">
                <div className="dr-overview-card-head">
                  <div className="dr-overview-icon dr-overview-icon--people">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  {overview && formatTrend(overview.payrollsCreatedChangePercent)}
                </div>
                <div className="dr-overview-label">Payrolls Created</div>
                <div className="dr-overview-value">{overviewLoading ? '—' : overview ? new Intl.NumberFormat('en-US').format(overview.payrollsCreated) : '—'}</div>
              </div>
              <div className="dr-overview-card">
                <div className="dr-overview-card-head">
                  <div className="dr-overview-icon bm-icon-suppliers">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  {overview && formatTrend(overview.suppliersChangePercent)}
                </div>
                <div className="dr-overview-label">Suppliers</div>
                <div className="dr-overview-value">{overviewLoading ? '—' : overview ? new Intl.NumberFormat('en-US').format(overview.suppliers) : '—'}</div>
              </div>
              <div className="dr-overview-card">
                <div className="dr-overview-card-head">
                  <div className="dr-overview-icon bm-icon-api">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M12 11v6M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <div className="dr-overview-label">API Integrated</div>
                <div className="dr-overview-value">{overviewLoading ? '—' : overview ? new Intl.NumberFormat('en-US').format(overview.apiIntegrated) : '—'}</div>
              </div>
              <div className="dr-overview-card">
                <div className="dr-overview-card-head">
                  <div className="dr-overview-icon dr-overview-icon--time">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                </div>
                <div className="dr-overview-label">Average Res Time</div>
                <div className="dr-overview-value">{overviewLoading ? '—' : (overview?.averageResTimeLabel ?? (overview?.averageResTimeHours != null ? `${overview.averageResTimeHours}hr` : '—'))}</div>
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
                    onKeyDown={(e) => { if (e.key === 'Enter') { setSearchQuery(searchInput); setListData((prev) => ({ ...prev, page: 1 })); } }}
                  />
                </div>
                <select
                  className="dr-filter-select"
                  value={filterAll}
                  onChange={(e) => { setFilterAll(e.target.value); setListData((prev) => ({ ...prev, page: 1 })); }}
                >
                  <option value="All">All</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
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
                    <th>Activity ID</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listError && (
                    <tr><td colSpan={6} className="dr-list-error">{listError}</td></tr>
                  )}
                  {!listError && listLoading && items.length === 0 && (
                    <tr><td colSpan={6} className="dr-list-loading">Loading…</td></tr>
                  )}
                  {!listError && !listLoading && items.length === 0 && (
                    <tr><td colSpan={6} className="dr-list-empty">No activities found</td></tr>
                  )}
                  {!listError && items.map((row) => (
                    <tr
                      key={row.id}
                      className="dr-table-row-clickable"
                      onClick={() => setSelectedActivityId(row.id ?? row.activityId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedActivityId(row.id ?? row.activityId); } }}
                    >
                      <td>
                        <div className="dr-id-cell">
                          <span className="dr-id-dot" />
                          <span>{row.activityId}</span>
                        </div>
                      </td>
                      <td>
                        <div className="dr-description-cell">
                          <span className="dr-desc-name">{activityName(row)}</span>
                          <span className="dr-desc-address">{activityAddress(row)}</span>
                        </div>
                      </td>
                      <td className="bm-activity-id">{row.activityId}</td>
                      <td><span className={`dr-status dr-status--${getStatusClass(row.status)}`}>{row.status}</span></td>
                      <td className="dr-timestamp-cell">{activityDate(row)}</td>
                      <td>
                        <button
                          type="button"
                          className="dr-view-btn"
                          aria-label="View details"
                          onClick={(e) => { e.stopPropagation(); setSelectedActivityId(row.id ?? row.activityId); }}
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
        </div>
      </div>
    </Layout>
  );
};

export default BusinessManagement;
