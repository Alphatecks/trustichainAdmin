import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import { fetchEscrowManagementStats, fetchEscrows, fetchEscrowFeesSummary, withdrawEscrowFees } from '../../services/escrowService';
import { useAdminProfile } from '../../utils/adminProfile';
import './EscrowManagement.css';

const PAGE_SIZE = 10;
const ESCROW_CREATION_FEES_STORAGE_KEY = 'adminEscrowCreationFees';

const EscrowManagement = ({ onMenuClick, onEscrowClick }) => {
  const {
    adminName,
    adminAvatarUrl,
    adminRole,
    adminProfileLoading,
    adminInitials,
  } = useAdminProfile();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [listData, setListData] = useState({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 });
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [feesSummary, setFeesSummary] = useState(null);
  const [feesLoading, setFeesLoading] = useState(true);
  const [feesError, setFeesError] = useState(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawDestination, setWithdrawDestination] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);
  const [setFeeModalOpen, setSetFeeModalOpen] = useState(false);
  const [setFeeForm, setSetFeeForm] = useState({
    personalFreelancerFee: '',
    supplierFee: '',
    payrollFee: '',
  });
  const [setFeeError, setSetFeeError] = useState(null);
  const [setFeeSuccess, setSetFeeSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatsError(null);
        const res = await fetchEscrowManagementStats();
        if (!cancelled && res?.success && res?.data) setStats(res.data);
      } catch (err) {
        if (!cancelled) setStatsError(err.message || 'Failed to load stats');
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ESCROW_CREATION_FEES_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      setSetFeeForm({
        personalFreelancerFee: parsed?.personalFreelancerFee != null ? String(parsed.personalFreelancerFee) : '',
        supplierFee: parsed?.supplierFee != null ? String(parsed.supplierFee) : '',
        payrollFee: parsed?.payrollFee != null ? String(parsed.payrollFee) : '',
      });
    } catch {
      // Ignore invalid local storage payload.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setListError(null);
        const res = await fetchEscrows({
          page: listData.page,
          pageSize: listData.pageSize,
          sortBy: 'created_at',
          sortOrder: 'desc',
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
        if (!cancelled) setListError(err.message || 'Failed to load escrows');
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [listData.page, listData.pageSize]);

  useEffect(() => {
    let cancelled = false;
    setFeesLoading(true);
    setFeesError(null);
    fetchEscrowFeesSummary()
      .then((res) => { if (!cancelled && res?.success && res?.data) setFeesSummary(res.data); })
      .catch((e) => { if (!cancelled) setFeesError(e.message || 'Failed to load fees'); })
      .finally(() => { if (!cancelled) setFeesLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const loadFeesSummary = () => {
    setFeesLoading(true);
    setFeesError(null);
    fetchEscrowFeesSummary()
      .then((res) => { if (res?.success && res?.data) setFeesSummary(res.data); })
      .catch((e) => setFeesError(e.message || 'Failed to load fees'))
      .finally(() => setFeesLoading(false));
  };

  const loadStats = () => {
    fetchEscrowManagementStats()
      .then((res) => { if (res?.success && res?.data) setStats(res.data); })
      .catch(() => {});
  };

  const setPage = (page) => {
    if (page < 1 || page > listData.totalPages) return;
    setListLoading(true);
    setListData((prev) => ({ ...prev, page }));
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const formatTrend = (percent) => {
    if (percent == null) return null;
    const isUp = Number(percent) >= 0;
    return (
      <div className="overview-card-row">
        <span className="overview-card-trend-icon">
          {isUp ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M4 18l6-6 10 6" stroke="#c53030" strokeWidth="2" fill="none"/>
            </svg>
          )}
        </span>
        <span className="overview-card-trend-label">
          {isUp ? '+' : ''}{Number(percent)}% in the past month
        </span>
      </div>
    );
  };

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return 'status-completed';
    if (s === 'active' || s === 'in progress') return 'status-in-progress';
    if (s === 'cancelled') return 'status-cancelled';
    if (s === 'disputed') return 'status-disputed';
    if (s === 'pending') return 'status-pending';
    return '';
  };

  const formatStatusLabel = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'active') return 'Active';
    return (status || '').charAt(0).toUpperCase() + (status || '').slice(1).toLowerCase();
  };

  const { items, page, totalPages } = listData;

  return (
    <Layout activeMenu="escrow" onMenuClick={onMenuClick}>
      <div className="escrow-management-container">
        {/* Header */}
        <header className="main-header">
          <div className="breadcrumb">Admin End &gt; Escrow Management</div>
          <input className="search-bar" type="text" placeholder="Search" />
          <div className="profile">
            <button type="button" className="notification-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.23858 2 5 4.23858 5 7V11C5 12.1046 4.10457 13 3 13H17C15.8954 13 15 12.1046 15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 15C7 16.1046 8.34315 17 10 17C11.6569 17 13 16.1046 13 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="notification-dot" />
            </button>
            {adminAvatarUrl ? (
              <img src={adminAvatarUrl} alt={adminName || 'Super Admin'} className="avatar" style={{ objectFit: 'cover' }} />
            ) : (
              <span className="avatar">{adminProfileLoading ? '…' : adminInitials}</span>
            )}
            <div className="profile-info">
              <span className="profile-name-row">
                <span className="name">{adminProfileLoading ? '…' : (adminName || 'Super Admin')}</span>
                <img src={require('../../assets/images/Frame.png')} alt="" className="verified-badge" />
              </span>
              <span className="role">{adminRole || 'Super Admin'}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="escrow-content">
          {/* Left Panel - Overview Statistics */}
          <div className="overview-panel">
            {statsError && (
              <div className="escrow-stats-error">{statsError}</div>
            )}
            <div className="overview-cards-grid">
              <div className="overview-card">
                <div className="overview-card-head">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#fff"/>
                    </svg>
                  </div>
                  {stats && formatTrend(stats.totalAmountUsdChangePercent)}
                </div>
                <div className="overview-card-label">Total Amount (USD)</div>
                <div className="overview-card-value">
                  {statsLoading ? '—' : stats ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(stats.totalAmountUsd) : '—'}
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-card-head">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" fill="#fff"/>
                    </svg>
                  </div>
                  {stats && formatTrend(stats.totalEscrowCountChangePercent)}
                </div>
                <div className="overview-card-label">Total Escrow transaction</div>
                <div className="overview-card-value">
                  {statsLoading ? '—' : stats ? new Intl.NumberFormat('en-US').format(stats.totalEscrowCount) : '—'}
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-card-head">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff"/>
                    </svg>
                  </div>
                  {stats && formatTrend(stats.completedCountChangePercent)}
                </div>
                <div className="overview-card-label">Completed Escrow</div>
                <div className="overview-card-value">
                  {statsLoading ? '—' : stats ? new Intl.NumberFormat('en-US').format(stats.completedCount) : '—'}
                </div>
              </div>

              <div className="overview-card">
                <div className="overview-card-head">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fff"/>
                      <path d="M12 8v4M12 16h.01" stroke="#0671FF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {stats && formatTrend(stats.disputedCountChangePercent)}
                </div>
                <div className="overview-card-label">Disputed Escrow</div>
                <div className="overview-card-value">
                  {statsLoading ? '—' : stats ? new Intl.NumberFormat('en-US').format(stats.disputedCount) : '—'}
                </div>
              </div>
            </div>

            {/* Escrow fees – withdraw collected fees */}
            <div className="escrow-fees-card">
              <h3 className="escrow-fees-title">Escrow fees</h3>
              <p className="escrow-fees-desc">Fees charged per escrow creation. Withdraw to your wallet.</p>
              {feesError && <div className="escrow-fees-error">{feesError}</div>}
              <div className="escrow-fees-summary">
                <span className="escrow-fees-label">Available to withdraw</span>
                <span className="escrow-fees-value">
                  {statsLoading ? '—' : stats != null && stats.escrowFeesBalanceXrp != null
                    ? `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(stats.escrowFeesBalanceXrp)} XRP`
                    : feesSummary != null
                      ? (feesSummary.totalFeesUsd != null
                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(feesSummary.totalFeesUsd)
                        : feesSummary.availableBalance != null
                          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(feesSummary.availableBalance)
                          : feesSummary.totalFeesXrp != null
                            ? `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(feesSummary.totalFeesXrp)} XRP`
                            : '—')
                      : '—'}
                </span>
              </div>
              <button
                type="button"
                className="escrow-fees-withdraw-btn"
                onClick={() => { setWithdrawModalOpen(true); setWithdrawError(null); setWithdrawDestination(''); setWithdrawAmount(''); }}
                disabled={feesLoading}
              >
                Withdraw fees
              </button>
              <button
                type="button"
                className="escrow-fees-set-fee-btn"
                onClick={() => {
                  setSetFeeError(null);
                  setSetFeeModalOpen(true);
                }}
                disabled={feesLoading}
              >
                Set escrow creation fee
              </button>
              {setFeeSuccess && <div className="escrow-fees-success">{setFeeSuccess}</div>}
              <div className="escrow-fees-config">
                <div className="escrow-fees-config-row">
                  <span>Personal freelancer</span>
                  <strong>{setFeeForm.personalFreelancerFee.trim() ? `$${setFeeForm.personalFreelancerFee.trim()}` : '—'}</strong>
                </div>
                <div className="escrow-fees-config-row">
                  <span>Supplier</span>
                  <strong>{setFeeForm.supplierFee.trim() ? `$${setFeeForm.supplierFee.trim()}` : '—'}</strong>
                </div>
                <div className="escrow-fees-config-row">
                  <span>Payroll</span>
                  <strong>{setFeeForm.payrollFee.trim() ? `$${setFeeForm.payrollFee.trim()}` : '—'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Escrow Overview Table */}
          <div className="escrow-overview-panel">
            <div className="escrow-overview-header">
              <div className="section-header">
                <span className="section-dot"></span>
                <span className="section-title">Escrow Overview</span>
              </div>
              <div className="escrow-controls">
                <div className="search-control">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <circle cx="9" cy="9" r="6" stroke="#666" strokeWidth="1.5"/>
                    <path d="M15 15l-3-3" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input type="text" placeholder="Search" className="escrow-search-input" />
                </div>
                <select className="filter-dropdown">
                  <option>All</option>
                </select>
                <button className="filter-icon-btn">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5h14M5 10h10M7 15h6" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="3" cy="5" r="2" fill="#666"/>
                    <circle cx="5" cy="10" r="2" fill="#666"/>
                    <circle cx="7" cy="15" r="2" fill="#666"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="escrow-table-container">
              <table className="escrow-table">
                <thead>
                  <tr>
                    <th>Escrow ID</th>
                    <th>Party 1</th>
                    <th>Party 2</th>
                    <th>Date created</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listError && (
                    <tr><td colSpan={5} className="escrow-list-error">{listError}</td></tr>
                  )}
                  {!listError && listLoading && items.length === 0 && (
                    <tr><td colSpan={5} className="escrow-list-loading">Loading…</td></tr>
                  )}
                  {!listError && !listLoading && items.length === 0 && (
                    <tr><td colSpan={5} className="escrow-list-empty">No escrows found</td></tr>
                  )}
                  {!listError && items.map((escrow) => (
                    <tr
                      key={escrow.id}
                      className="escrow-row-clickable"
                      onClick={() => onEscrowClick && onEscrowClick(escrow.escrowId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEscrowClick && onEscrowClick(escrow.escrowId)}
                    >
                      <td>
                        <div className="escrow-id-cell">
                          <span className="escrow-dot"></span>
                          {escrow.escrowId}
                        </div>
                      </td>
                      <td>{escrow.party1Name}</td>
                      <td>{escrow.party2Name}</td>
                      <td>{formatDate(escrow.createdAt)}</td>
                      <td>
                        <div className="status-cell">
                          <span className={`escrow-status ${getStatusClass(escrow.status)}`}>
                            {formatStatusLabel(escrow.status)}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="#0671FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                type="button"
                className="pagination-btn"
                disabled={listLoading || page <= 1}
                onClick={() => setPage(page - 1)}
                aria-label="Previous page"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
                    className={`pagination-number ${p === page ? 'active' : ''}`}
                    disabled={listLoading}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && <span className="pagination-ellipsis">…</span>}
              {totalPages > 5 && page < totalPages - 2 && (
                <button
                  type="button"
                  className="pagination-number"
                  disabled={listLoading}
                  onClick={() => setPage(totalPages)}
                >
                  {totalPages}
                </button>
              )}
              <button
                type="button"
                className="pagination-btn"
                disabled={listLoading || page >= totalPages}
                onClick={() => setPage(page + 1)}
                aria-label="Next page"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw fees modal */}
      {withdrawModalOpen && (
        <div className="escrow-withdraw-overlay" role="dialog" aria-modal="true" aria-labelledby="escrow-withdraw-title">
          <div className="escrow-withdraw-modal">
            <div className="escrow-withdraw-header">
              <h2 id="escrow-withdraw-title">Withdraw escrow fees</h2>
              <button type="button" className="escrow-withdraw-close" onClick={() => setWithdrawModalOpen(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="escrow-withdraw-body">
              <p className="escrow-withdraw-note">Withdraw collected escrow fees to an XRPL wallet address. Amount is in USD.</p>
              <label className="escrow-withdraw-label">XRPL destination address</label>
              <input
                type="text"
                className="escrow-withdraw-input"
                value={withdrawDestination}
                onChange={(e) => setWithdrawDestination(e.target.value)}
                placeholder="rYourXRPLAddress..."
              />
              <label className="escrow-withdraw-label">Amount (USD)</label>
              <input
                type="text"
                inputMode="decimal"
                className="escrow-withdraw-input"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="e.g. 250"
              />
              {withdrawError && <div className="escrow-withdraw-error">{withdrawError}</div>}
              <div className="escrow-withdraw-actions">
                <button type="button" className="escrow-withdraw-cancel" onClick={() => setWithdrawModalOpen(false)}>Cancel</button>
                <button
                  type="button"
                  className="escrow-withdraw-submit"
                  disabled={withdrawLoading || !withdrawDestination.trim() || !withdrawAmount.trim() || Number(withdrawAmount) <= 0}
                  onClick={() => {
                    setWithdrawError(null);
                    setWithdrawLoading(true);
                    const amountUsd = parseFloat(withdrawAmount);
                    if (Number.isNaN(amountUsd) || amountUsd <= 0) {
                      setWithdrawError('Enter a valid amount (USD) greater than 0');
                      setWithdrawLoading(false);
                      return;
                    }
                    withdrawEscrowFees({
                      amountUsd,
                      destinationXrplAddress: withdrawDestination.trim(),
                    })
                      .then(() => {
                        setWithdrawModalOpen(false);
                        loadFeesSummary();
                        loadStats();
                      })
                      .catch((e) => setWithdrawError(e.message || 'Withdrawal failed'))
                      .finally(() => setWithdrawLoading(false));
                  }}
                >
                  {withdrawLoading ? 'Withdrawing…' : 'Withdraw'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set escrow creation fee modal */}
      {setFeeModalOpen && (
        <div className="escrow-withdraw-overlay" role="dialog" aria-modal="true" aria-labelledby="escrow-set-fee-title">
          <div className="escrow-withdraw-modal">
            <div className="escrow-withdraw-header">
              <h2 id="escrow-set-fee-title">Set escrow creation fee</h2>
              <button type="button" className="escrow-withdraw-close" onClick={() => setSetFeeModalOpen(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="escrow-withdraw-body">
              <p className="escrow-withdraw-note">Set the escrow creation fee for each escrow type. Values are in USD.</p>
              <label className="escrow-withdraw-label">Personal freelancer escrow creation fee (USD)</label>
              <input
                type="text"
                inputMode="decimal"
                className="escrow-withdraw-input"
                value={setFeeForm.personalFreelancerFee}
                onChange={(e) => setSetFeeForm((prev) => ({ ...prev, personalFreelancerFee: e.target.value }))}
                placeholder="e.g. 10"
              />
              <label className="escrow-withdraw-label">Supplier escrow creation fee (USD)</label>
              <input
                type="text"
                inputMode="decimal"
                className="escrow-withdraw-input"
                value={setFeeForm.supplierFee}
                onChange={(e) => setSetFeeForm((prev) => ({ ...prev, supplierFee: e.target.value }))}
                placeholder="e.g. 12.5"
              />
              <label className="escrow-withdraw-label">Payroll escrow creation fee (USD)</label>
              <input
                type="text"
                inputMode="decimal"
                className="escrow-withdraw-input"
                value={setFeeForm.payrollFee}
                onChange={(e) => setSetFeeForm((prev) => ({ ...prev, payrollFee: e.target.value }))}
                placeholder="e.g. 8"
              />
              {setFeeError && <div className="escrow-withdraw-error">{setFeeError}</div>}
              <div className="escrow-withdraw-actions">
                <button type="button" className="escrow-withdraw-cancel" onClick={() => setSetFeeModalOpen(false)}>Cancel</button>
                <button
                  type="button"
                  className="escrow-withdraw-submit"
                  onClick={() => {
                    setSetFeeError(null);
                    const personal = Number(setFeeForm.personalFreelancerFee);
                    const supplier = Number(setFeeForm.supplierFee);
                    const payroll = Number(setFeeForm.payrollFee);
                    if (
                      !setFeeForm.personalFreelancerFee.trim() ||
                      !setFeeForm.supplierFee.trim() ||
                      !setFeeForm.payrollFee.trim() ||
                      Number.isNaN(personal) ||
                      Number.isNaN(supplier) ||
                      Number.isNaN(payroll) ||
                      personal < 0 ||
                      supplier < 0 ||
                      payroll < 0
                    ) {
                      setSetFeeError('Enter valid fee amounts (USD) for all three escrow types.');
                      return;
                    }
                    const next = {
                      personalFreelancerFee: personal.toFixed(2),
                      supplierFee: supplier.toFixed(2),
                      payrollFee: payroll.toFixed(2),
                    };
                    setSetFeeForm(next);
                    localStorage.setItem(ESCROW_CREATION_FEES_STORAGE_KEY, JSON.stringify(next));
                    setSetFeeModalOpen(false);
                    setSetFeeSuccess('Escrow creation fees updated.');
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EscrowManagement;
