import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import { fetchBusinessManagementOverview, fetchBusinesses, updateBusinessStatus } from '../../services/businessManagementService';
import { fetchKycDetail } from '../../services/userManagementService';
import { useAdminProfile } from '../../utils/adminProfile';
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

const PAGE_SIZE = 20;
const statusForApi = (filter) => {
  if (filter === 'All') return undefined;
  if (filter === 'Pending' || filter === 'Verified') return filter;
  return undefined;
};

const BusinessManagement = ({ onMenuClick }) => {
  const {
    adminName,
    adminAvatarUrl,
    adminRole,
    adminProfileLoading,
    adminInitials,
  } = useAdminProfile();
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);
  const [listData, setListData] = useState({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 });
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [kycDetail, setKycDetail] = useState(null);
  const [kycDetailLoading, setKycDetailLoading] = useState(false);
  const [kycDetailError, setKycDetailError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState(null);

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
    fetchBusinesses({
      page: listData.page,
      pageSize: listData.pageSize,
      status: statusForApi(statusFilter),
      search: searchQuery || undefined,
    })
      .then((res) => {
        if (!cancelled && res?.success && res?.data) {
          const d = res.data;
          setListData((prev) => ({
            ...prev,
            items: d.businesses ?? d.items ?? d.users ?? [],
            total: d.total ?? d.totalBusinesses ?? d.totalUsers ?? 0,
            totalPages: d.totalPages ?? 0,
            page: d.currentPage ?? d.page ?? prev.page,
          }));
        }
      })
      .catch((e) => {
        if (!cancelled) setListError(e.message || 'Failed to load businesses');
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => { cancelled = true; };
  }, [listData.page, listData.pageSize, statusFilter, searchQuery]);

  const setPage = (p) => {
    if (p < 1 || p > listData.totalPages) return;
    setListData((prev) => ({ ...prev, page: p }));
  };

  const openDetailModal = (business) => {
    setSelectedBusiness(business);
    setStatusUpdateError(null);
  };

  const closeDetailModal = () => {
    setSelectedBusiness(null);
    setKycDetail(null);
    setKycDetailError(null);
    setStatusUpdateError(null);
  };

  useEffect(() => {
    if (!selectedBusiness?.ownerUserId) {
      setKycDetail(null);
      setKycDetailError(null);
      setKycDetailLoading(false);
      return;
    }
    let cancelled = false;
    setKycDetailLoading(true);
    setKycDetailError(null);
    fetchKycDetail(selectedBusiness.ownerUserId)
      .then((res) => {
        if (!cancelled) {
          console.log('KYC details response:', res);
          if (res?.success && res?.data) setKycDetail(res.data);
        }
      })
      .catch((e) => {
        if (!cancelled) setKycDetailError(e.message || 'Failed to load KYC details');
      })
      .finally(() => {
        if (!cancelled) setKycDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedBusiness?.ownerUserId]);

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedBusiness?.id) return;
    const newStatus = e.target.elements?.statusSelect?.value;
    if (!newStatus) return;
    setStatusUpdateLoading(true);
    setStatusUpdateError(null);
    updateBusinessStatus(selectedBusiness.id, newStatus)
      .then(() => {
        setListData((prev) => ({
          ...prev,
          items: prev.items.map((b) => (b.id === selectedBusiness.id ? { ...b, status: newStatus } : b)),
        }));
        setSelectedBusiness((prev) => (prev ? { ...prev, status: newStatus } : null));
        setKycDetail((prev) => (prev ? { ...prev, businessKycStatus: newStatus } : null));
      })
      .catch((err) => setStatusUpdateError(err.message || 'Failed to update status'))
      .finally(() => setStatusUpdateLoading(false));
  };

  const items = listData.items;
  const { page, totalPages } = listData;

  const companyName = (b) => b?.companyName ?? b?.businessName ?? b?.name ?? '—';
  const ownerEmail = (b) => b?.ownerEmail ?? b?.businessEmail ?? b?.email ?? '—';
  const ownerName = (b) => b?.ownerFullName ?? b?.ownerName ?? '—';
  const statusDisplay = (s) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1).toLowerCase() : '—');

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
            {adminAvatarUrl ? (
              <img src={adminAvatarUrl} alt={adminName || 'Super Admin'} className="dr-avatar" style={{ objectFit: 'cover' }} />
            ) : (
              <span className="dr-avatar">{adminProfileLoading ? '…' : adminInitials}</span>
            )}
            <div className="dr-profile-info">
              <span className="dr-profile-name-row">
                <span className="dr-profile-name">{adminProfileLoading ? '…' : (adminName || 'Super Admin')}</span>
                <img src={require('../../assets/images/Frame.png')} alt="" className="dr-verified-badge" />
              </span>
              <span className="dr-profile-role">{adminRole || 'Super Admin'}</span>
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

          {/* Businesses list */}
          <section className="dr-table-card">
            <div className="dr-table-header">
              <div className="dr-section-title">
                <span className="dr-section-bar" />
                <span>Businesses</span>
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
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setListData((prev) => ({ ...prev, page: 1 })); }}
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
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
                    <th>Company name</th>
                    <th>Owner</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Reviewed</th>
                    <th>Last updated</th>
                  </tr>
                </thead>
                <tbody>
                  {listError && (
                    <tr><td colSpan={7} className="dr-list-error">{listError}</td></tr>
                  )}
                  {!listError && listLoading && items.length === 0 && (
                    <tr><td colSpan={7} className="dr-list-loading">Loading…</td></tr>
                  )}
                  {!listError && !listLoading && items.length === 0 && (
                    <tr><td colSpan={7} className="dr-list-empty">No businesses found</td></tr>
                  )}
                  {!listError && items.map((business) => (
                    <tr
                      key={business.id}
                      className="dr-table-row-clickable"
                      onClick={() => openDetailModal(business)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetailModal(business); } }}
                    >
                      <td>
                        <div className="dr-id-cell">
                          <span className="dr-id-dot" />
                          <span>{companyName(business)}</span>
                        </div>
                      </td>
                      <td>{ownerName(business)}</td>
                      <td>{ownerEmail(business)}</td>
                      <td>
                        <span className={`dr-status dr-status--${(business.status || business.kycStatus || '').toLowerCase()}`}>
                          {statusDisplay(business.status ?? business.kycStatus)}
                        </span>
                      </td>
                      <td className="dr-timestamp-cell">{business.submittedAt ? formatTableDate(business.submittedAt) : '—'}</td>
                      <td className="dr-timestamp-cell">{business.reviewedAt ? formatTableDate(business.reviewedAt) : '—'}</td>
                      <td className="dr-timestamp-cell">{business.updatedAt ? formatTableDate(business.updatedAt) : '—'}</td>
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

      {selectedBusiness && (
        <div className="bm-modal-overlay" onClick={closeDetailModal} role="presentation">
          <div className="bm-modal bm-modal--kyc" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="bm-modal-title">
            <div className="bm-modal-header">
              <h2 id="bm-modal-title" className="bm-modal-title">Business KYC details</h2>
              <button type="button" className="bm-modal-close" onClick={closeDetailModal} aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="bm-modal-body">
              {kycDetailLoading && <div className="bm-kyc-loading">Loading KYC details…</div>}
              {!kycDetailLoading && kycDetailError && <div className="bm-kyc-error">{kycDetailError}</div>}
              {!kycDetailLoading && !kycDetailError && (kycDetail || selectedBusiness) && (
                <>
                  {kycDetail?.companyLogoUrl && (
                    <div className="bm-kyc-logo-wrap">
                      <img src={kycDetail.companyLogoUrl} alt="" className="bm-kyc-logo" />
                    </div>
                  )}
                  <dl className="bm-detail-list bm-modal-detail-list">
                    <div className="bm-detail-row"><dt>Company name</dt><dd>{kycDetail?.companyName ?? companyName(selectedBusiness)}</dd></div>
                    <div className="bm-detail-row"><dt>Full name</dt><dd>{kycDetail?.fullName ?? ownerName(selectedBusiness)}</dd></div>
                    <div className="bm-detail-row"><dt>Email</dt><dd>{kycDetail?.email ?? ownerEmail(selectedBusiness)}</dd></div>
                    <div className="bm-detail-row"><dt>KYC status</dt><dd><span className={`dr-status dr-status--${(kycDetail?.kycStatus || '').toLowerCase().replace(/\s/g, '-')}`}>{statusDisplay(kycDetail?.kycStatus)}</span></dd></div>
                    <div className="bm-detail-row"><dt>Business KYC status</dt><dd><span className={`dr-status dr-status--${(kycDetail?.businessKycStatus || selectedBusiness?.status || '').toLowerCase().replace(/\s/g, '-')}`}>{statusDisplay(kycDetail?.businessKycStatus ?? selectedBusiness?.status)}</span></dd></div>
                    <div className="bm-detail-row"><dt>Business submitted</dt><dd>{kycDetail?.businessSubmittedAt ? formatTableDate(kycDetail.businessSubmittedAt) : (selectedBusiness?.submittedAt ? formatTableDate(selectedBusiness.submittedAt) : '—')}</dd></div>
                    <div className="bm-detail-row"><dt>Business reviewed</dt><dd>{kycDetail?.businessReviewedAt ? formatTableDate(kycDetail.businessReviewedAt) : (selectedBusiness?.reviewedAt ? formatTableDate(selectedBusiness.reviewedAt) : '—')}</dd></div>
                    {(kycDetail?.userId || selectedBusiness?.ownerUserId) && (
                      <div className="bm-detail-row"><dt>User ID</dt><dd><code className="bm-modal-id">{kycDetail?.userId ?? selectedBusiness.ownerUserId}</code></dd></div>
                    )}
                  </dl>
                  {(kycDetail?.identityVerificationDocumentUrl || kycDetail?.addressVerificationDocumentUrl || kycDetail?.enhancedDueDiligenceDocumentUrl) && (
                    <div className="bm-kyc-docs">
                      <h3 className="bm-kyc-docs-title">KYC documents</h3>
                      <div className="bm-kyc-docs-list">
                        {kycDetail?.identityVerificationDocumentUrl && (
                          <a href={kycDetail.identityVerificationDocumentUrl} target="_blank" rel="noopener noreferrer" className="bm-kyc-doc-link">Identity verification</a>
                        )}
                        {kycDetail?.addressVerificationDocumentUrl && (
                          <a href={kycDetail.addressVerificationDocumentUrl} target="_blank" rel="noopener noreferrer" className="bm-kyc-doc-link">Address verification</a>
                        )}
                        {kycDetail?.enhancedDueDiligenceDocumentUrl && (
                          <a href={kycDetail.enhancedDueDiligenceDocumentUrl} target="_blank" rel="noopener noreferrer" className="bm-kyc-doc-link">Enhanced due diligence</a>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <form className="bm-modal-actions" onSubmit={handleUpdateStatus}>
              <div className="bm-modal-status-row">
                <label htmlFor="bm-status-select">Update business status</label>
                <select key={`status-${selectedBusiness?.id}-${kycDetail?.businessKycStatus ?? selectedBusiness?.status ?? ''}`} id="bm-status-select" name="statusSelect" className="bm-modal-select" defaultValue={kycDetail?.businessKycStatus ?? selectedBusiness?.status ?? 'In review'} disabled={statusUpdateLoading}>
                  <option value="In review">In review</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              {statusUpdateError && <div className="bm-modal-error">{statusUpdateError}</div>}
              <div className="bm-modal-buttons">
                <button type="button" className="bm-modal-btn bm-modal-btn--secondary" onClick={closeDetailModal} disabled={statusUpdateLoading}>Close</button>
                <button type="submit" className="bm-modal-btn bm-modal-btn--primary" disabled={statusUpdateLoading}>{statusUpdateLoading ? 'Updating…' : 'Update status'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BusinessManagement;
