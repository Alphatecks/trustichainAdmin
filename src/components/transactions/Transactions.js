import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import { fetchTransactionOverview, fetchTransactions, fetchTransactionDetail } from '../../services/transactionService';
import './Transactions.css';

const PAGE_SIZE = 10;

const accountTypeFromTab = (tab) => (tab === 'Business suite' ? 'business_suite' : 'personal');
const statusFromFilter = (filter) => {
  if (filter === 'Successful') return 'completed';
  if (filter === 'Pending') return 'pending';
  if (filter === 'Failed') return 'failed';
  return undefined;
};

const Transactions = ({ onMenuClick }) => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [filterAll, setFilterAll] = useState('All');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);

  const [listData, setListData] = useState({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 });
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [transactionDetail, setTransactionDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setOverviewError(null);
        const res = await fetchTransactionOverview();
        if (!cancelled && res?.success && res?.data) setOverview(res.data);
      } catch (err) {
        if (!cancelled) setOverviewError(err.message || 'Failed to load overview');
      } finally {
        if (!cancelled) setOverviewLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setListError(null);
        const res = await fetchTransactions({
          page: listData.page,
          pageSize: listData.pageSize,
          sortBy: 'created_at',
          sortOrder: 'desc',
          accountType: accountTypeFromTab(activeTab),
          status: statusFromFilter(filterAll),
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
        if (!cancelled) setListError(err.message || 'Failed to load transactions');
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [listData.page, listData.pageSize, activeTab, filterAll]);

  useEffect(() => {
    if (!selectedTransaction?.id) {
      setTransactionDetail(null);
      setDetailError(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    setDetailError(null);
    fetchTransactionDetail(selectedTransaction.id)
      .then((res) => {
        if (!cancelled && res?.success && res?.data) setTransactionDetail(res.data);
      })
      .catch((e) => {
        if (!cancelled) setDetailError(e.message || 'Failed to load transaction detail');
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedTransaction?.id]);

  const setPage = (p) => {
    if (p < 1 || p > listData.totalPages) return;
    setListLoading(true);
    setListData((prev) => ({ ...prev, page: p }));
  };

  const formatTrend = (percent) => {
    if (percent == null) return null;
    const isUp = Number(percent) >= 0;
    return (
      <div className="tx-card-trend">
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
    if (s === 'completed' || s === 'successful') return 'successful';
    if (s === 'pending') return 'pending';
    if (s === 'failed') return 'failed';
    return '';
  };

  const formatAmount = (amountUsd) =>
    amountUsd != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amountUsd) : '—';

  return (
    <Layout activeMenu="transactions" onMenuClick={onMenuClick}>
      <div className="tx-page">
        <header className="tx-header">
          <div className="tx-breadcrumb">Admin End &gt; Transaction</div>
          <div className="tx-search">
            <svg className="tx-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
          <div className="tx-profile">
            <button type="button" className="tx-notification-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.23858 2 5 4.23858 5 7V11C5 12.1046 4.10457 13 3 13H17C15.8954 13 15 12.1046 15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 15C7 16.1046 8.34315 17 10 17C11.6569 17 13 16.1046 13 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="tx-notification-dot" />
            </button>
            <span className="tx-avatar">SC</span>
            <div className="tx-profile-info">
              <span className="tx-profile-name-row">
                <span className="tx-profile-name">Sarah Chen</span>
                <img src={require('../../assets/images/Frame.png')} alt="" className="tx-verified-badge" />
              </span>
              <span className="tx-profile-role">Freelancer</span>
            </div>
          </div>
        </header>

        <section className="tx-overview">
          {overviewError && <div className="tx-overview-error">{overviewError}</div>}
          <div className="tx-section-title">
            <span className="tx-section-bar" />
            <span>Overview</span>
          </div>
          <div className="tx-cards">
            <div className="tx-card">
              <div className="tx-card-head">
                <div className="tx-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" fill="#fff"/>
                    <path d="M3 10h18M7 14h4" stroke="#0671FF" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                {overview && formatTrend(overview.totalTransactionCountChangePercent)}
              </div>
              <div className="tx-card-label">Total Transaction</div>
              <div className="tx-card-value">
                {overviewLoading ? '—' : overview ? new Intl.NumberFormat('en-US').format(overview.totalTransactionCount) : '—'}
              </div>
            </div>
            <div className="tx-card">
              <div className="tx-card-head">
                <div className="tx-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                {overview && formatTrend(overview.totalAmountUsdChangePercent)}
              </div>
              <div className="tx-card-label">Total Amount</div>
              <div className="tx-card-value">
                {overviewLoading ? '—' : overview ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(overview.totalAmountUsd) : '—'}
              </div>
            </div>
            <div className="tx-card">
              <div className="tx-card-head">
                <div className="tx-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
                  </svg>
                </div>
                {overview && formatTrend(overview.escrowedAmountUsdChangePercent)}
              </div>
              <div className="tx-card-label">Escrowed Amount</div>
              <div className="tx-card-value">
                {overviewLoading ? '—' : overview ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(overview.escrowedAmountUsd) : '—'}
              </div>
            </div>
            <div className="tx-card">
              <div className="tx-card-head">
                <div className="tx-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {overview && formatTrend(overview.payrollAmountUsdChangePercent)}
              </div>
              <div className="tx-card-label">Payroll Amount</div>
              <div className="tx-card-value">
                {overviewLoading ? '—' : overview ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(overview.payrollAmountUsd) : '—'}
              </div>
            </div>
          </div>
        </section>

        <section className="tx-user-overview">
          <div className="tx-user-overview-header">
            <div className="tx-section-title">
              <span className="tx-section-bar" />
              <span>User Overview</span>
            </div>
            <div className="tx-toolbar">
              <div className="tx-table-search">
                <svg className="tx-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input type="text" placeholder="Search" />
              </div>
              <div className="tx-tabs">
                <button type="button" className={activeTab === 'Personal' ? 'active' : ''} onClick={() => { setActiveTab('Personal'); setListData((p) => ({ ...p, page: 1 })); setListLoading(true); }}>Personal</button>
                <button type="button" className={activeTab === 'Business suite' ? 'active' : ''} onClick={() => { setActiveTab('Business suite'); setListData((p) => ({ ...p, page: 1 })); setListLoading(true); }}>Business suite</button>
              </div>
              <select className="tx-filter-select" value={filterAll} onChange={(e) => { setFilterAll(e.target.value); setListData((p) => ({ ...p, page: 1 })); setListLoading(true); }}>
                <option>All</option>
                <option>Successful</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
              <button type="button" className="tx-filter-btn" aria-label="Filter">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h14M5 10h10M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="3" cy="5" r="2" fill="currentColor"/>
                  <circle cx="10" cy="10" r="2" fill="currentColor"/>
                  <circle cx="7" cy="15" r="2" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Type</th>
                  <th>User ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Currency</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listError && (
                  <tr><td colSpan={8} className="tx-list-error">{listError}</td></tr>
                )}
                {!listError && listLoading && items.length === 0 && (
                  <tr><td colSpan={8} className="tx-list-loading">Loading…</td></tr>
                )}
                {!listError && !listLoading && items.length === 0 && (
                  <tr><td colSpan={8} className="tx-list-empty">No transactions found</td></tr>
                )}
                {!listError && items.map((row) => (
                  <tr key={row.id} onClick={() => setSelectedTransaction(row)}>
                    <td>
                      <div className="tx-id-cell">
                        <span className="tx-radio" />
                        <span>{row.transactionId}</span>
                      </div>
                    </td>
                    <td>{row.typeLabel ?? row.type ?? '—'}</td>
                    <td>{row.userName ?? row.userId ?? '—'}</td>
                    <td>{formatAmount(row.amountUsd)}</td>
                    <td><span className={`tx-status tx-status--${getStatusClass(row.status)}`}>{row.statusLabel ?? row.status ?? '—'}</span></td>
                    <td>{row.currency ?? '—'}</td>
                    <td>{row.createdAtAgo ?? (row.createdAt ? new Date(row.createdAt).toLocaleString() : '—')}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="tx-view-btn" aria-label="View" onClick={() => setSelectedTransaction(row)}>
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
          <div className="tx-pagination">
            <button
              type="button"
              className="tx-page-btn"
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
                  className={`tx-page-num ${p === page ? 'active' : ''}`}
                  disabled={listLoading}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}
            {totalPages > 5 && page < totalPages - 2 && <span className="tx-page-ellipsis">…</span>}
            {totalPages > 5 && page < totalPages - 2 && (
              <button type="button" className="tx-page-num" disabled={listLoading} onClick={() => setPage(totalPages)}>
                {totalPages}
              </button>
            )}
            <button
              type="button"
              className="tx-page-btn"
              disabled={listLoading || page >= totalPages}
              onClick={() => setPage(page + 1)}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </section>

        {/* Transaction Summary Modal */}
        {selectedTransaction && (
          <div className="tx-modal-overlay" onClick={() => { setSelectedTransaction(null); setTransactionDetail(null); setDetailError(null); }}>
            <div className="tx-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tx-modal-header">
                <h2 className="tx-modal-title">Transaction Summary</h2>
                <button type="button" className="tx-modal-close" onClick={() => { setSelectedTransaction(null); setTransactionDetail(null); setDetailError(null); }} aria-label="Close">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="tx-modal-body">
                {detailLoading && <div className="tx-modal-loading">Loading transaction details…</div>}
                {detailError && <div className="tx-modal-error">{detailError}</div>}
                {!detailLoading && !detailError && transactionDetail && (
                  <>
                    <div className="tx-modal-row"><span className="tx-modal-label">Transaction ID</span><span className="tx-modal-value">{transactionDetail.transactionId}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Type</span><span className="tx-modal-value">{transactionDetail.typeLabel ?? transactionDetail.type}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">User</span><span className="tx-modal-value">{transactionDetail.userName ?? transactionDetail.userId}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Email</span><span className="tx-modal-value">{transactionDetail.userEmail ?? '—'}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Amount (USD)</span><span className="tx-modal-value">{formatAmount(transactionDetail.amountUsd)}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Amount (XRP)</span><span className="tx-modal-value">{transactionDetail.amountXrp != null ? Number(transactionDetail.amountXrp).toLocaleString() : '—'}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Currency</span><span className="tx-modal-value">{transactionDetail.currency ?? '—'}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Status</span><span className="tx-modal-value">{transactionDetail.statusLabel ?? transactionDetail.status}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Description</span><span className="tx-modal-value">{transactionDetail.description ?? '—'}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Date</span><span className="tx-modal-value">{transactionDetail.createdAtAgo ?? (transactionDetail.createdAt ? new Date(transactionDetail.createdAt).toLocaleString() : '—')}</span></div>
                    {transactionDetail.xrplTxHash != null && (
                      <div className="tx-modal-row"><span className="tx-modal-label">XRPL Tx Hash</span><span className="tx-modal-value tx-modal-value--mono">{transactionDetail.xrplTxHash}</span></div>
                    )}
                    {transactionDetail.escrowId != null && (
                      <div className="tx-modal-row"><span className="tx-modal-label">Escrow ID</span><span className="tx-modal-value">{transactionDetail.escrowId}</span></div>
                    )}
                  </>
                )}
                {!detailLoading && !detailError && !transactionDetail && (
                  <>
                    <div className="tx-modal-row"><span className="tx-modal-label">Transaction ID</span><span className="tx-modal-value">{selectedTransaction.transactionId ?? selectedTransaction.id}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Type</span><span className="tx-modal-value">{selectedTransaction.typeLabel ?? selectedTransaction.type}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">User</span><span className="tx-modal-value">{selectedTransaction.userName ?? selectedTransaction.userId ?? '—'}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Amount</span><span className="tx-modal-value">{selectedTransaction.amountUsd != null ? formatAmount(selectedTransaction.amountUsd) : '—'}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Currency</span><span className="tx-modal-value">{selectedTransaction.currency ?? '—'}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Status</span><span className="tx-modal-value">{selectedTransaction.statusLabel ?? selectedTransaction.status}</span></div>
                    <div className="tx-modal-row"><span className="tx-modal-label">Date</span><span className="tx-modal-value">{selectedTransaction.createdAtAgo ?? (selectedTransaction.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString() : '—')}</span></div>
                  </>
                )}
              </div>
              <div className="tx-modal-note">
                <span className="tx-modal-note-icon">i</span>
                <span>Recipient will receive at least 24,567 USDT ($24,567) or the transaction will be refunded</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
