import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import { fetchDashboardOverview, fetchEscrowInsight, fetchDisputeResolution, fetchLiveFeed, fetchDashboardUsers, fetchKycList, fetchKycDetail, kycApproveOrDecline, fetchAlerts } from '../../services/dashboardService';
import './Dashboard.css';

const formatNumber = (n) => {
  if (n == null || n === undefined) return '—';
  return Number(n).toLocaleString();
};

const formatVolume = (n) => {
  if (n == null || n === undefined) return '—';
  return `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const Dashboard = ({ onLogout, onMenuClick }) => {
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);

  const [escrowInsight, setEscrowInsight] = useState(null);
  const [escrowInsightLoading, setEscrowInsightLoading] = useState(true);
  const [escrowInsightError, setEscrowInsightError] = useState(null);
  const [escrowPeriod, setEscrowPeriod] = useState('last_month');

  const [disputeResolution, setDisputeResolution] = useState(null);
  const [disputeResolutionLoading, setDisputeResolutionLoading] = useState(true);
  const [disputeResolutionError, setDisputeResolutionError] = useState(null);
  const [disputePeriod, setDisputePeriod] = useState('last_6_months');

  const [liveFeed, setLiveFeed] = useState(null);
  const [liveFeedLoading, setLiveFeedLoading] = useState(true);
  const [liveFeedError, setLiveFeedError] = useState(null);

  const [usersOverview, setUsersOverview] = useState(null);
  const [usersOverviewLoading, setUsersOverviewLoading] = useState(true);
  const [usersOverviewError, setUsersOverviewError] = useState(null);

  const [kycList, setKycList] = useState(null);
  const [kycListLoading, setKycListLoading] = useState(true);
  const [kycListError, setKycListError] = useState(null);

  const [selectedKycUserId, setSelectedKycUserId] = useState(null);
  const [kycDetail, setKycDetail] = useState(null);
  const [kycDetailLoading, setKycDetailLoading] = useState(false);
  const [kycDetailError, setKycDetailError] = useState(null);
  const [kycActionLoading, setKycActionLoading] = useState(false);

  const [alerts, setAlerts] = useState(null);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState(null);

  const [selectedFeedItem, setSelectedFeedItem] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setOverviewLoading(true);
    setOverviewError(null);
    fetchDashboardOverview()
      .then((res) => {
        if (!cancelled && res.success && res.data) setOverview(res.data);
      })
      .catch((err) => {
        if (!cancelled) setOverviewError(err.message || 'Failed to load overview');
      })
      .finally(() => {
        if (!cancelled) setOverviewLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setEscrowInsightLoading(true);
    setEscrowInsightError(null);
    fetchEscrowInsight(escrowPeriod)
      .then((res) => {
        if (!cancelled && res.success && res.data) setEscrowInsight(res.data);
      })
      .catch((err) => {
        if (!cancelled) setEscrowInsightError(err.message || 'Failed to load escrow insight');
      })
      .finally(() => {
        if (!cancelled) setEscrowInsightLoading(false);
      });
    return () => { cancelled = true; };
  }, [escrowPeriod]);

  useEffect(() => {
    let cancelled = false;
    setDisputeResolutionLoading(true);
    setDisputeResolutionError(null);
    fetchDisputeResolution(disputePeriod)
      .then((res) => {
        if (!cancelled && res.success && res.data) setDisputeResolution(res.data);
      })
      .catch((err) => {
        if (!cancelled) setDisputeResolutionError(err.message || 'Failed to load dispute resolution');
      })
      .finally(() => {
        if (!cancelled) setDisputeResolutionLoading(false);
      });
    return () => { cancelled = true; };
  }, [disputePeriod]);

  useEffect(() => {
    let cancelled = false;
    setLiveFeedLoading(true);
    setLiveFeedError(null);
    fetchLiveFeed(10)
      .then((res) => {
        if (!cancelled && res.success && res.data) setLiveFeed(res.data);
      })
      .catch((err) => {
        if (!cancelled) setLiveFeedError(err.message || 'Failed to load live feed');
      })
      .finally(() => {
        if (!cancelled) setLiveFeedLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setUsersOverviewLoading(true);
    setUsersOverviewError(null);
    fetchDashboardUsers(20, 0)
      .then((res) => {
        if (!cancelled && res.success && res.data) setUsersOverview(res.data);
      })
      .catch((err) => {
        if (!cancelled) setUsersOverviewError(err.message || 'Failed to load users');
      })
      .finally(() => {
        if (!cancelled) setUsersOverviewLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setKycListLoading(true);
    setKycListError(null);
    fetchKycList()
      .then((res) => {
        if (!cancelled && res.success && res.data) setKycList(res.data);
      })
      .catch((err) => {
        if (!cancelled) setKycListError(err.message || 'Failed to load KYC list');
      })
      .finally(() => {
        if (!cancelled) setKycListLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setAlertsLoading(true);
    setAlertsError(null);
    fetchAlerts()
      .then((res) => {
        if (!cancelled && res.success && res.data) setAlerts(res.data);
      })
      .catch((err) => {
        if (!cancelled) setAlertsError(err.message || 'Failed to load alerts');
      })
      .finally(() => {
        if (!cancelled) setAlertsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedKycUserId) {
      setKycDetail(null);
      setKycDetailError(null);
      return;
    }
    let cancelled = false;
    setKycDetailLoading(true);
    setKycDetailError(null);
    fetchKycDetail(selectedKycUserId)
      .then((res) => {
        if (!cancelled && res.success && res.data) setKycDetail(res.data);
      })
      .catch((err) => {
        if (!cancelled) setKycDetailError(err.message || 'Failed to load KYC detail');
      })
      .finally(() => {
        if (!cancelled) setKycDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedKycUserId]);

  const handleKycApprove = () => {
    if (!selectedKycUserId || kycActionLoading) return;
    setKycActionLoading(true);
    kycApproveOrDecline(selectedKycUserId, 'verified')
      .then(() => {
        setSelectedKycUserId(null);
        setKycDetail(null);
        return fetchKycList();
      })
      .then((res) => {
        if (res.success && res.data) setKycList(res.data);
      })
      .catch(() => {})
      .finally(() => setKycActionLoading(false));
  };

  const handleKycDecline = () => {
    if (!selectedKycUserId || kycActionLoading) return;
    setKycActionLoading(true);
    kycApproveOrDecline(selectedKycUserId, 'declined')
      .then(() => {
        setSelectedKycUserId(null);
        setKycDetail(null);
        return fetchKycList();
      })
      .then((res) => {
        if (res.success && res.data) setKycList(res.data);
      })
      .catch(() => {})
      .finally(() => setKycActionLoading(false));
  };

  const d = overview || {};
  const trend = (pct) => (pct != null && pct !== undefined ? `${pct}% in the past month` : null);

  const ei = escrowInsight || {};
  const approvedPercent = ei.approvedPercent != null ? Number(ei.approvedPercent) : 70;
  const pendingPercent = ei.pendingPercent != null ? Number(ei.pendingPercent) : 30;
  const circumference = 2 * Math.PI * 15.9155;
  const approvedStroke = (approvedPercent / 100) * circumference;
  const pendingStroke = (pendingPercent / 100) * circumference;

  const dr = disputeResolution || {};
  const byMonth = Array.isArray(dr.byMonth) ? dr.byMonth : [];
  const maxResolved = byMonth.length ? Math.max(...byMonth.map((m) => Number(m.resolvedCount) || 0), 1) : 1;

  const feedItems = liveFeed?.items ?? [];

  const overviewUsers = usersOverview?.users ?? [];
  const kycBadgeClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'verified') return 'dash-kyc-badge--verified';
    if (s === 'pending') return 'dash-kyc-badge--pending';
    if (s === 'declined') return 'dash-kyc-badge--declined';
    if (s === 'suspended') return 'dash-kyc-badge--suspended';
    return '';
  };
  const kycLabel = (status) => (status ? String(status).charAt(0).toUpperCase() + String(status).slice(1).toLowerCase() : '—');

  const kycItems = kycList?.items ?? [];

  const alertItems = alerts?.alerts ?? [];

  return (
    <Layout activeMenu="dashboard" onMenuClick={onMenuClick}>
      <main className="dash-page">
        <header className="dash-header">
          <div className="dash-breadcrumb">Admin End &gt; Dashboard</div>
          <div className="dash-search">
            <svg className="dash-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
          <div className="dash-profile">
            <button type="button" className="dash-notification-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.23858 2 5 4.23858 5 7V11C5 12.1046 4.10457 13 3 13H17C15.8954 13 15 12.1046 15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 15C7 16.1046 8.34315 17 10 17C11.6569 17 13 16.1046 13 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="dash-notification-dot" />
            </button>
            <span className="dash-avatar">SC</span>
            <div className="dash-profile-info">
              <span className="dash-profile-name-row">
                <span className="dash-profile-name">Sarah Chen</span>
                <img src={require('../../assets/images/Frame.png')} alt="" className="dash-verified-badge" />
              </span>
              <span className="dash-profile-role">Freelancer</span>
            </div>
          </div>
        </header>

        {/* Top row: Overview | Escrow Insight | Dispute Resolution */}
        <div className="dash-top-row">
          <section className="dash-overview-card">
            <div className="dash-section-title">
              <span className="dash-section-bar" />
              <span>Overview</span>
            </div>
            <div className="dash-overview-grid">
              <div className="dash-metric">
                <div className="dash-metric-head">
                  <div className="dash-metric-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="#fff"/></svg>
                  </div>
                  {trend(d.totalUsersChangePercent) && (
                    <div className="dash-metric-trend">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                      <span>{trend(d.totalUsersChangePercent)}</span>
                    </div>
                  )}
                </div>
                <div className="dash-metric-label">Total Users</div>
                <div className="dash-metric-value">{overviewLoading ? '...' : overviewError ? '—' : formatNumber(d.totalUsers)}</div>
              </div>
              <div className="dash-metric">
                <div className="dash-metric-head">
                  <div className="dash-metric-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 7.5l-9 6-9-6" stroke="#fff" strokeWidth="2"/><rect x="2" y="7" width="20" height="10" rx="2" fill="rgba(255,255,255,0.2)"/></svg>
                  </div>
                  {trend(d.totalEscrowsChangePercent) && (
                    <div className="dash-metric-trend">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                      <span>{trend(d.totalEscrowsChangePercent)}</span>
                    </div>
                  )}
                </div>
                <div className="dash-metric-label">Total Escrows</div>
                <div className="dash-metric-value">{overviewLoading ? '...' : overviewError ? '—' : formatNumber(d.totalEscrows)}</div>
              </div>
              <div className="dash-metric">
                <div className="dash-metric-head">
                  <div className="dash-metric-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="10" rx="2" fill="#fff"/></svg>
                  </div>
                  {trend(d.totalTransactionsChangePercent) && (
                    <div className="dash-metric-trend">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                      <span>{trend(d.totalTransactionsChangePercent)}</span>
                    </div>
                  )}
                </div>
                <div className="dash-metric-label">Total Transaction</div>
                <div className="dash-metric-value">{overviewLoading ? '...' : overviewError ? '—' : formatNumber(d.totalTransactions)}</div>
              </div>
              <div className="dash-metric">
                <div className="dash-metric-head">
                  <div className="dash-metric-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  {trend(d.pendingActionsChangePercent) && (
                    <div className="dash-metric-trend">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                      <span>{trend(d.pendingActionsChangePercent)}</span>
                    </div>
                  )}
                </div>
                <div className="dash-metric-label">Pending Actions</div>
                <div className="dash-metric-value">{overviewLoading ? '...' : overviewError ? '—' : formatNumber(d.pendingActions)}</div>
              </div>
            </div>
            {overviewError && <p className="dash-overview-error">{overviewError}</p>}
          </section>

          <section className="dash-insight-card dash-escrow-insight">
            <div className="dash-insight-header">
              <div className="dash-section-title">
                <span className="dash-section-bar" />
                <span>Escrow Insight</span>
              </div>
              <select
                className="dash-insight-select"
                value={escrowPeriod}
                onChange={(e) => setEscrowPeriod(e.target.value)}
              >
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
                <option value="last_3_months">Last 3 months</option>
              </select>
            </div>
            {escrowInsightError && <p className="dash-insight-error">{escrowInsightError}</p>}
            <div className="dash-donut-wrap">
              <div className="dash-donut">
                <svg width="120" height="120" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#e0e7ff" strokeWidth="6" />
                  <circle
                    cx="21" cy="21" r="15.9155"
                    fill="none"
                    stroke="#0671FF"
                    strokeWidth="6"
                    strokeDasharray={`${approvedStroke} ${pendingStroke}`}
                    strokeDashoffset={circumference * 0.25}
                  />
                  <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="10" fontWeight="700" fill="#0671FF">
                    {escrowInsightLoading ? '...' : `${Math.round(approvedPercent)}%`}
                  </text>
                </svg>
              </div>
              <div className="dash-legend">
                <div className="dash-legend-item">
                  <span className="dash-legend-dot dash-legend-dot--blue" />
                  <span>Approved Escrow {!escrowInsightLoading && ei.approvedCount != null && `(${formatNumber(ei.approvedCount)})`}</span>
                </div>
                <div className="dash-legend-item">
                  <span className="dash-legend-dot dash-legend-dot--grey" />
                  <span>Pending Escrow {!escrowInsightLoading && ei.pendingCount != null && `(${formatNumber(ei.pendingCount)})`}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="dash-insight-card dash-dispute-insight">
            <div className="dash-insight-header">
              <div className="dash-section-title">
                <span className="dash-section-bar" />
                <span>Dispute Resolution</span>
              </div>
              <select
                className="dash-insight-select"
                value={disputePeriod}
                onChange={(e) => setDisputePeriod(e.target.value)}
              >
                <option value="last_month">Last month</option>
                <option value="last_3_months">Last 3 months</option>
                <option value="last_6_months">Last 6 months</option>
              </select>
            </div>
            {disputeResolutionError && <p className="dash-insight-error">{disputeResolutionError}</p>}
            <div className="dash-dispute-metric">
              <div className="dash-dispute-label">Total Dispute Resolved</div>
              <div className="dash-dispute-value">
                {disputeResolutionLoading ? '...' : disputeResolutionError ? '—' : formatNumber(dr.totalDisputesResolved)}
              </div>
            </div>
            <div className="dash-bar-wrap">
              <div className="dash-bars">
                {byMonth.length > 0
                  ? byMonth.map((item, i) => {
                      const count = Number(item.resolvedCount) || 0;
                      const pct = maxResolved > 0 ? Math.min(100, (count / maxResolved) * 100) : 0;
                      return <div key={i} className="dash-bar" style={{ height: `${pct}%` }} />;
                    })
                  : [1, 2, 3, 4, 5, 6].map((_, i) => (
                      <div key={i} className="dash-bar" style={{ height: disputeResolutionLoading ? '50%' : '0%' }} />
                    ))}
              </div>
              <div className="dash-bar-labels">
                {byMonth.length > 0
                  ? byMonth.map((item, i) => <span key={i}>{item.label || item.month || ''}</span>)
                  : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((l, i) => <span key={i}>{l}</span>)}
              </div>
            </div>
          </section>
        </div>

        {/* Bottom row: Live Transactions Feed | User & Business Overview | KYC + Alert */}
        <section className="dash-bottom-row">
          <div className="dash-feed-card">
            <div className="dash-section-title">
              <span className="dash-section-bar" />
              <span>Live Transactions Feed</span>
            </div>
            {liveFeedError && <p className="dash-insight-error">{liveFeedError}</p>}
            <ul className="dash-feed-list">
              {liveFeedLoading && feedItems.length === 0 ? (
                <li className="dash-feed-item"><span className="dash-feed-loading">Loading...</span></li>
              ) : feedItems.length === 0 ? (
                <li className="dash-feed-item"><span className="dash-feed-empty">No recent activity</span></li>
              ) : (
                feedItems.map((item) => (
                  <li key={item.id} className="dash-feed-item">
                    <div className="dash-feed-content">
                      <div className="dash-feed-action">{item.eventType || 'Event'}</div>
                      <div className="dash-feed-desc">{item.description || ''}</div>
                    </div>
                    <div className="dash-feed-right">
                      <span className="dash-feed-time">{item.createdAtAgo || item.createdAt || ''}</span>
                      <button type="button" className="dash-feed-btn" onClick={() => setSelectedFeedItem(item)}>View</button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="dash-table-card">
            <div className="dash-section-title">
              <span className="dash-section-bar" />
              <span>User & Business Overview</span>
            </div>
            {usersOverviewError && <p className="dash-insight-error">{usersOverviewError}</p>}
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Account type</th>
                    <th>KYC Status</th>
                    <th>Total Volume</th>
                    <th>Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {usersOverviewLoading && overviewUsers.length === 0 ? (
                    <tr><td colSpan={5} className="dash-table-loading">Loading...</td></tr>
                  ) : overviewUsers.length === 0 ? (
                    <tr><td colSpan={5} className="dash-table-empty">No users</td></tr>
                  ) : (
                    overviewUsers.map((user) => (
                      <tr key={user.userId}>
                        <td>
                          <div className="dash-table-user">
                            <span className="dash-table-avatar" />
                            <span>{user.fullName || user.email || '—'}</span>
                          </div>
                        </td>
                        <td>{user.accountType || '—'}</td>
                        <td>
                          <span className={`dash-kyc-badge ${kycBadgeClass(user.kycStatus)}`}>
                            {kycLabel(user.kycStatus)}
                          </span>
                        </td>
                        <td>{formatVolume(user.totalVolumeUsd)}</td>
                        <td>{user.lastActivityAgo ?? user.lastActivityAt ?? '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dash-side-column">
            <div className="dash-kyc-card">
              <div className="dash-section-title">
                <span className="dash-section-bar" />
                <span>KYC Verification</span>
              </div>
              {kycListError && <p className="dash-insight-error">{kycListError}</p>}
              <ul className="dash-kyc-list">
                {kycListLoading && kycItems.length === 0 ? (
                  <li className="dash-kyc-item"><span className="dash-kyc-loading">Loading...</span></li>
                ) : kycItems.length === 0 ? (
                  <li className="dash-kyc-item"><span className="dash-kyc-empty">No KYC submissions</span></li>
                ) : (
                  kycItems.map((item) => (
                    <li key={item.userId} className="dash-kyc-item">
                      <span className="dash-kyc-avatar" />
                      <div className="dash-kyc-info">
                        <span className="dash-kyc-name">{item.fullName || item.email || '—'}</span>
                        <span className={`dash-kyc-badge ${kycBadgeClass(item.kycStatus)}`}>
                          {kycLabel(item.kycStatus)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={item.kycStatus === 'pending' ? 'dash-kyc-btn dash-kyc-btn--primary' : 'dash-kyc-btn'}
                        onClick={() => setSelectedKycUserId(item.userId)}
                      >
                        {item.kycStatus === 'pending' ? 'Approve' : 'View'}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="dash-alert-card">
              <div className="dash-section-title">
                <span className="dash-section-bar" />
                <span>Alert</span>
              </div>
              {alertsError && <p className="dash-insight-error">{alertsError}</p>}
              {alertsLoading && alertItems.length === 0 ? (
                <p className="dash-alert-loading">Loading...</p>
              ) : alertItems.length === 0 ? (
                <p className="dash-alert-empty">No alerts</p>
              ) : (
                <ul className="dash-alert-list">
                  {alertItems.map((alert) => (
                    <li key={alert.id} className="dash-alert-item">
                      <div className="dash-alert-content">
                        <div className="dash-alert-heading">{alert.heading || '—'}</div>
                        {alert.subHeading && <div className="dash-alert-subheading">{alert.subHeading}</div>}
                        {alert.actionUrl ? (
                          <a href={alert.actionUrl} className="dash-alert-btn">Action</a>
                        ) : (
                          <span className="dash-alert-btn dash-alert-btn--disabled">Action</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>

      {selectedFeedItem && (
        <div className="dash-feed-modal-backdrop" onClick={() => setSelectedFeedItem(null)}>
          <div className="dash-feed-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-feed-modal-header">
              <h3 className="dash-feed-modal-title">Transaction detail</h3>
              <button type="button" className="dash-feed-modal-close" onClick={() => setSelectedFeedItem(null)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5L5 15M5 5l10 10"/></svg>
              </button>
            </div>
            <div className="dash-feed-modal-body">
              <div className="dash-feed-modal-row">
                <span className="dash-feed-modal-label">Event type</span>
                <span className="dash-feed-modal-value">{selectedFeedItem.eventType || '—'}</span>
              </div>
              <div className="dash-feed-modal-row dash-feed-modal-row--block">
                <span className="dash-feed-modal-label">Description</span>
                <span className="dash-feed-modal-value">{selectedFeedItem.description || '—'}</span>
              </div>
              <div className="dash-feed-modal-row">
                <span className="dash-feed-modal-label">Date & time</span>
                <span className="dash-feed-modal-value">{selectedFeedItem.createdAt || '—'}</span>
              </div>
              {selectedFeedItem.createdAtAgo && (
                <div className="dash-feed-modal-row">
                  <span className="dash-feed-modal-label">When</span>
                  <span className="dash-feed-modal-value">{selectedFeedItem.createdAtAgo}</span>
                </div>
              )}
              {selectedFeedItem.userId && (
                <div className="dash-feed-modal-row">
                  <span className="dash-feed-modal-label">User ID</span>
                  <span className="dash-feed-modal-value dash-feed-modal-value--mono">{selectedFeedItem.userId}</span>
                </div>
              )}
              {selectedFeedItem.relatedId && (
                <div className="dash-feed-modal-row">
                  <span className="dash-feed-modal-label">Related ID</span>
                  <span className="dash-feed-modal-value dash-feed-modal-value--mono">{selectedFeedItem.relatedId}</span>
                </div>
              )}
            </div>
            <div className="dash-feed-modal-actions">
              <button type="button" className="dash-feed-modal-btn" onClick={() => setSelectedFeedItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {selectedKycUserId && (
        <div className="dash-kyc-modal-backdrop" onClick={() => !kycActionLoading && setSelectedKycUserId(null)}>
          <div className="dash-kyc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-kyc-modal-header">
              <h3 className="dash-kyc-modal-title">KYC Details</h3>
              <button type="button" className="dash-kyc-modal-close" onClick={() => !kycActionLoading && setSelectedKycUserId(null)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5L5 15M5 5l10 10"/></svg>
              </button>
            </div>
            {kycDetailLoading ? (
              <p className="dash-kyc-modal-loading">Loading...</p>
            ) : kycDetailError ? (
              <p className="dash-kyc-modal-error">{kycDetailError}</p>
            ) : kycDetail ? (
              <>
                <div className="dash-kyc-modal-body">
                  {kycDetail.kycStatus !== 'pending' && (
                    <p className="dash-kyc-modal-view-note">
                      {kycDetail.kycStatus === 'verified' ? 'This KYC has been approved.' : kycDetail.kycStatus === 'declined' ? 'This KYC was declined.' : 'Viewing KYC details.'}
                    </p>
                  )}
                  <div className="dash-kyc-modal-row">
                    <span className="dash-kyc-modal-label">Name</span>
                    <span className="dash-kyc-modal-value">{kycDetail.fullName || '—'}</span>
                  </div>
                  <div className="dash-kyc-modal-row">
                    <span className="dash-kyc-modal-label">Email</span>
                    <span className="dash-kyc-modal-value">{kycDetail.email || '—'}</span>
                  </div>
                  <div className="dash-kyc-modal-row">
                    <span className="dash-kyc-modal-label">Status</span>
                    <span className={`dash-kyc-badge ${kycBadgeClass(kycDetail.kycStatus)}`}>
                      {kycLabel(kycDetail.kycStatus)}
                    </span>
                  </div>
                  {kycDetail.submittedAt && (
                    <div className="dash-kyc-modal-row">
                      <span className="dash-kyc-modal-label">Submitted</span>
                      <span className="dash-kyc-modal-value">{kycDetail.submittedAt}</span>
                    </div>
                  )}
                  {kycDetail.reviewedAt && (
                    <div className="dash-kyc-modal-row">
                      <span className="dash-kyc-modal-label">Reviewed</span>
                      <span className="dash-kyc-modal-value">{kycDetail.reviewedAt}</span>
                    </div>
                  )}
                  {Array.isArray(kycDetail.documents) && kycDetail.documents.length > 0 && (
                    <div className="dash-kyc-modal-row dash-kyc-modal-docs">
                      <span className="dash-kyc-modal-label">Documents</span>
                      <span className="dash-kyc-modal-value">{kycDetail.documents.length} file(s)</span>
                    </div>
                  )}
                </div>
                <div className="dash-kyc-modal-actions">
                  {kycDetail.kycStatus === 'pending' && (
                    <>
                      <button type="button" className="dash-kyc-modal-btn dash-kyc-modal-btn--approve" onClick={handleKycApprove} disabled={kycActionLoading}>
                        {kycActionLoading ? 'Updating...' : 'Approve'}
                      </button>
                      <button type="button" className="dash-kyc-modal-btn dash-kyc-modal-btn--decline" onClick={handleKycDecline} disabled={kycActionLoading}>
                        Decline
                      </button>
                    </>
                  )}
                  {kycDetail.kycStatus !== 'pending' && (
                    <button type="button" className="dash-kyc-modal-btn dash-kyc-modal-btn--secondary" onClick={() => setSelectedKycUserId(null)}>
                      Close
                    </button>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
