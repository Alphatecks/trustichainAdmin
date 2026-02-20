import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../shared/Layout';
import { fetchUserManagementStats, fetchUserManagementUsers } from '../../services/userManagementService';
import './UserManagement.css';

const PAGE_SIZE = 10;

const accountTypeFromTab = (tab) => (tab === 'Business suite' ? 'business_suite' : 'personal');
const kycStatusFromFilter = (filter) => {
  if (filter === 'Verified') return 'verified';
  if (filter === 'Unverified') return 'unverified';
  return undefined;
};

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

const UserManagement = ({ onMenuClick, onUserClick }) => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [selectedFilter, setSelectedFilter] = useState('Verified Unverified');
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const res = await fetchUserManagementStats();
        if (!cancelled && res?.success && res?.data) setStats(res.data);
      } catch (e) {
        if (!cancelled) setStatsError(e.message || 'Failed to load stats');
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const loadUsers = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const res = await fetchUserManagementUsers({
        accountType: accountTypeFromTab(activeTab),
        page: currentPage,
        pageSize: PAGE_SIZE,
        kycStatus: kycStatusFromFilter(selectedFilter),
        searchQuery: searchQuery || undefined,
      });
      if (res?.success && res?.data) {
        setUsers(res.data.users || []);
        setTotalPages(res.data.totalPages ?? 0);
      }
    } catch (e) {
      setListError(e.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setListLoading(false);
    }
  }, [activeTab, selectedFilter, currentPage, searchQuery]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedFilter, searchQuery]);

  const formatChange = (percent) =>
    percent != null ? `${percent > 0 ? '+' : ''}${percent}% in the past month` : null;

  const onSearchSubmit = (e) => {
    e?.preventDefault?.();
    setSearchQuery(searchInput);
  };

  const kycDisplay = (status) => (status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : '—');
  const formatVolume = (n) => (n != null ? `$${Number(n).toLocaleString()}` : '—');

  return (
    <Layout activeMenu="users" onMenuClick={onMenuClick}>
      <div className="um-page">
        {/* Header */}
        <header className="um-header">
          <div className="um-breadcrumb">Admin End &gt; User Management</div>
          <div className="um-global-search">
            <svg className="um-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
          <div className="um-profile">
            <button type="button" className="um-notification-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.23858 2 5 4.23858 5 7V11C5 12.1046 4.10457 13 3 13H17C15.8954 13 15 12.1046 15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 15C7 16.1046 8.34315 17 10 17C11.6569 17 13 16.1046 13 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="um-notification-dot" />
            </button>
            <span className="um-avatar">SC</span>
            <div className="um-profile-info">
              <span className="um-profile-name-row">
                <span className="um-profile-name">Sarah Chen</span>
                <img src={require('../../assets/images/Frame.png')} alt="" className="um-verified-badge" />
              </span>
              <span className="um-profile-role">Freelancer</span>
            </div>
          </div>
        </header>

        {/* Overview */}
        <section className="um-overview">
          <div className="um-overview-title">
            <span className="um-overview-bar" />
            <span>Overview</span>
          </div>
          <div className="um-overview-cards">
            {statsError && (
              <div className="um-stats-error">{statsError}</div>
            )}
            <div className="um-card">
              <div className="um-card-head">
                <div className="um-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="#fff"/>
                  </svg>
                </div>
                {stats && formatChange(stats.totalUsersChangePercent) && (
                  <div className="um-card-trend">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                    <span>{formatChange(stats.totalUsersChangePercent)}</span>
                  </div>
                )}
              </div>
              <div className="um-card-label">Total Users</div>
              <div className="um-card-value">{statsLoading ? '—' : stats ? Number(stats.totalUsers).toLocaleString() : '—'}</div>
            </div>
            <div className="um-card">
              <div className="um-card-head">
                <div className="um-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="#fff"/>
                    <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {stats && formatChange(stats.verifiedUsersChangePercent) && (
                  <div className="um-card-trend">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                    <span>{formatChange(stats.verifiedUsersChangePercent)}</span>
                  </div>
                )}
              </div>
              <div className="um-card-label">Verified Users</div>
              <div className="um-card-value">{statsLoading ? '—' : stats ? Number(stats.verifiedUsers).toLocaleString() : '—'}</div>
            </div>
            <div className="um-card">
              <div className="um-card-head">
                <div className="um-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="7" width="18" height="10" rx="2" fill="#fff"/>
                  </svg>
                </div>
                {stats && formatChange(stats.personalSuiteUsersChangePercent) && (
                  <div className="um-card-trend">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                    <span>{formatChange(stats.personalSuiteUsersChangePercent)}</span>
                  </div>
                )}
              </div>
              <div className="um-card-label">Personal Suite</div>
              <div className="um-card-value">{statsLoading ? '—' : stats ? Number(stats.personalSuiteUsers).toLocaleString() : '—'}</div>
            </div>
            <div className="um-card">
              <div className="um-card-head">
                <div className="um-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {stats && formatChange(stats.businessSuiteUsersChangePercent) && (
                  <div className="um-card-trend">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                    <span>{formatChange(stats.businessSuiteUsersChangePercent)}</span>
                  </div>
                )}
              </div>
              <div className="um-card-label">Business Suite</div>
              <div className="um-card-value">{statsLoading ? '—' : stats ? Number(stats.businessSuiteUsers).toLocaleString() : '—'}</div>
            </div>
          </div>
        </section>

        {/* User Overview */}
        <section className="um-user-overview">
          <div className="um-user-overview-header">
            <div className="um-overview-title">
              <span className="um-overview-bar" />
              <span>User Overview</span>
            </div>
            <div className="um-toolbar">
            <form className="um-table-search" onSubmit={onSearchSubmit}>
              <svg className="um-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
            <div className="um-tabs">
              <button type="button" className={activeTab === 'Personal' ? 'active' : ''} onClick={() => setActiveTab('Personal')}>Personal</button>
              <button type="button" className={activeTab === 'Business suite' ? 'active' : ''} onClick={() => setActiveTab('Business suite')}>Business suite</button>
            </div>
            <select className="um-filter-select" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
              <option>Verified Unverified</option>
              <option>Verified</option>
              <option>Unverified</option>
            </select>
            <button type="button" className="um-filter-btn" aria-label="Filter">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M5 10h10M7 15h6" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="3" cy="5" r="2" fill="#666"/>
                <circle cx="10" cy="10" r="2" fill="#666"/>
                <circle cx="7" cy="15" r="2" fill="#666"/>
              </svg>
            </button>
          </div>
          </div>
          {listError && <div className="um-stats-error">{listError}</div>}
          <div className="um-table-wrap">
            <table className="um-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>KYC Status</th>
                  <th>Total Volume</th>
                  <th>Escrow created</th>
                  <th>Savings Account</th>
                  <th>Account Created</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {listLoading ? (
                  <tr><td colSpan={7} className="um-table-loading">Loading…</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={7} className="um-table-empty">No users found</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} onClick={() => { console.log('User tapped:', user); onUserClick?.(user); }}>
                      <td>
                        <div className="um-user-cell">
                          <span className="um-user-radio" />
                          <span>{user.name ?? '—'}</span>
                        </div>
                      </td>
                      <td><span className={`um-kyc um-kyc--${(user.kycStatus || '').toLowerCase()}`}>{kycDisplay(user.kycStatus)}</span></td>
                      <td>{formatVolume(user.totalVolume)}</td>
                      <td>{user.escrowCreatedCount != null ? user.escrowCreatedCount : '—'}</td>
                      <td>{user.savingsAccountCount != null ? user.savingsAccountCount : '—'}</td>
                      <td>{formatDate(user.accountCreatedDate)}</td>
                      <td>
                        <div className="um-activity-cell">
                          <span>{user.lastActivityAgo ?? '—'}</span>
                          <button type="button" className="um-view-btn" aria-label="View" onClick={(e) => { e.stopPropagation(); console.log('User tapped:', user); onUserClick?.(user); }}>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="um-pagination">
            <button
              type="button"
              className="um-page-btn"
              disabled={currentPage <= 1 || listLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {totalPages > 0 && (() => {
              const delta = 2;
              const start = Math.max(1, currentPage - delta);
              const end = Math.min(totalPages, currentPage + delta);
              const pages = [];
              for (let p = start; p <= end; p++) pages.push(p);
              return pages.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`um-page-num ${p === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ));
            })()}
            <button
              type="button"
              className="um-page-btn"
              disabled={currentPage >= totalPages || listLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default UserManagement;
