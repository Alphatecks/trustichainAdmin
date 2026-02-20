import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '../shared/Layout';
import { fetchUserDetail, updateUserKycStatus } from '../../services/userManagementService';
import './UserDetail.css';

const formatDoB = (iso) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!d || !m || !y) return iso;
  return `${d} ${m} ${y}`;
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

const formatAmount = (n) => (n != null && n !== '' ? `$${Number(n).toLocaleString()}` : '—');

const walletTypeLabel = (type) => {
  if (!type) return '—';
  const t = String(type).toLowerCase();
  if (t === 'savings') return 'Savings Wallet';
  if (t === 'xrp') return 'XRP Wallet';
  return type;
};

const UserDetail = ({ user, onBack, onMenuClick }) => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycActionLoading, setKycActionLoading] = useState(false);
  const [kycActionError, setKycActionError] = useState(null);

  const userId = user?.id;

  const loadUserDetail = useCallback(() => {
    if (!userId) return Promise.resolve();
    return fetchUserDetail(userId).then((res) => {
      console.log('User detail API response:', res);
      if (res?.success && res?.data) setDetail(res.data);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setDetail(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchUserDetail(userId)
      .then((res) => {
        console.log('User detail API response:', res);
        if (!cancelled && res?.success && res?.data) setDetail(res.data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load user');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  const handleKycUpdate = (status) => {
    if (!userId || kycActionLoading) return;
    setKycActionError(null);
    setKycActionLoading(true);
    updateUserKycStatus(userId, status)
      .then(() => loadUserDetail())
      .then(() => setShowKycModal(false))
      .catch((e) => setKycActionError(e.message || 'Failed to update KYC status'))
      .finally(() => setKycActionLoading(false));
  };

  const data = useMemo(() => {
    const d = detail;
    const kyc = d?.userKyc;
    const wallets = (d?.walletDetails?.items || []).map((w) => ({
      name: w.walletName ?? '—',
      type: walletTypeLabel(w.walletType),
      amount: formatAmount(w.amountUsd),
      date: (w.date != null ? formatDate(w.date) : formatDate(w.createdAt)) ?? '—',
    }));
    const escrows = (d?.escrowDetails?.items || []).map((e) => ({
      id: e.escrowIdNo ?? '—',
      parties: e.partiesInvolved ?? '—',
      amount: formatAmount(e.amountUsd),
      status: e.status ?? '—',
    }));
    const transactions = (d?.transactionHistory?.items || []).map((t) => ({
      type: t.typeLabel ?? t.type ?? '—',
      description: t.description ?? '—',
      amount: formatAmount(t.amountUsd),
      time: t.createdAtAgo ?? '—',
    }));
    const disputes = (d?.disputes?.items || []).map((x) => ({
      name: (x.name || x.caseId) ?? '—',
      parties: x.partiesInvolved ?? '—',
      status: x.status ?? '—',
      date: x.date ? formatDate(x.date) : '—',
    }));

    const rawAccountType = d?.accountType ?? user?.accountType ?? 'Personal';
    const accountTypeDisplay = rawAccountType === 'business_suite' ? 'Business suite' : (rawAccountType ? String(rawAccountType).charAt(0).toUpperCase() + String(rawAccountType).slice(1).toLowerCase() : 'Personal');

    return {
      name: d?.name ?? user?.name ?? '—',
      email: d?.email ?? user?.email ?? '—',
      accountType: accountTypeDisplay,
      kycStatus: d?.kycStatus ?? kyc?.status ?? user?.kycStatus ?? '—',
      nationality: d?.nationality ?? user?.nationality ?? '—',
      dateOfBirth: d?.dateOfBirth ? formatDoB(d.dateOfBirth) : '—',
      linkedIdType: kyc?.linkedIdType ?? d?.linkedIdType ?? '—',
      cardNumber: kyc?.cardNumber ?? d?.cardNumber ?? '—',
      walletAddress: d?.walletAddress ?? kyc?.walletAddress ?? '—',
      profilePictureUrl: d?.profilePictureUrl ?? null,
      businessName: d?.businessName ?? '—',
      businessEmail: d?.businessEmail ?? '—',
      businessDescription: d?.businessDescription ?? null,
      accountCreatedDate: d?.accountCreatedDate ? formatDate(d.accountCreatedDate) : '—',
      lastActivityAgo: d?.lastActivityAgo ?? '—',
      totalVolume: d?.totalVolume != null ? formatAmount(d.totalVolume) : '—',
      savingsAccountCount: d?.savingsAccountCount ?? '—',
      wallets,
      escrows,
      transactions,
      disputes,
      walletTotal: d?.walletDetails?.total ?? d?.walletDetails?.items?.length ?? wallets.length,
      escrowTotal: d?.escrowDetails?.total ?? d?.escrowCreatedCount ?? escrows.length,
      disputeTotal: d?.disputes?.total ?? d?.disputes?.items?.length ?? disputes.length,
      kycDocuments: kyc?.documents ?? d?.userKyc?.documents ?? { liveSelfie: null, front: null, back: null },
    };
  }, [detail, user]);

  const statusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (['verified', 'completed', 'resolved', 'active'].some((x) => s.includes(x))) return 'ud-status--success';
    if (['in progress', 'pending'].some((x) => s.includes(x))) return 'ud-status--progress';
    if (['disputed', 'inactive'].some((x) => s.includes(x))) return 'ud-status--disputed';
    if (s.includes('closed')) return 'ud-status--closed';
    return '';
  };

  const kycDisplay = (s) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : '—');

  if (!user) {
    return (
      <Layout activeMenu="users" onMenuClick={onMenuClick}>
        <div className="ud-page">
          <div className="ud-empty">No user selected. <button type="button" className="ud-back-link" onClick={onBack}>Back to User Management</button></div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout activeMenu="users" onMenuClick={onMenuClick}>
        <div className="ud-page">
          <div className="ud-loading">Loading user details…</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout activeMenu="users" onMenuClick={onMenuClick}>
        <div className="ud-page">
          <div className="ud-error">{error}. <button type="button" className="ud-back-link" onClick={onBack}>Back to User Management</button></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeMenu="users" onMenuClick={onMenuClick}>
      <div className="ud-page">
        <header className="ud-header">
          <div className="ud-breadcrumb" onClick={onBack} onKeyDown={(e) => e.key === 'Enter' && onBack?.()} role="button" tabIndex={0}>
            Admin End &gt; User Management
          </div>
          <div className="ud-search">
            <svg className="ud-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Search" />
          </div>
          <div className="ud-profile">
            <button type="button" className="ud-notification-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.23858 2 5 4.23858 5 7V11C5 12.1046 4.10457 13 3 13H17C15.8954 13 15 12.1046 15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="currentColor" strokeWidth="2" />
                <path d="M7 15C7 16.1046 8.34315 17 10 17C11.6569 17 13 16.1046 13 15" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="ud-notification-dot" />
            </button>
            <span className="ud-avatar">SC</span>
            <div className="ud-profile-info">
              <span className="ud-profile-name-row">
                <span className="ud-profile-name">Sarah Chen</span>
                <img src={require('../../assets/images/Frame.png')} alt="" className="ud-verified-badge" />
              </span>
              <span className="ud-profile-role">Freelancer</span>
            </div>
          </div>
        </header>

        <div className="ud-grid">
          <div className="ud-left">
            {/* User Details */}
            <section className="ud-card ud-user-details">
              <div className="ud-card-title-row">
                <span className="ud-card-bar" />
                <h3 className="ud-card-title">User Details</h3>
              </div>
              <div className="ud-user-hero">
                {data.profilePictureUrl ? (
                  <img src={data.profilePictureUrl} alt="" className="ud-avatar-large ud-avatar-img" />
                ) : (
                  <div className="ud-avatar-large" />
                )}
                <div className="ud-user-hero-text">
                  <h2 className="ud-user-name">{activeTab === 'Business suite' ? data.businessName : data.name}</h2>
                  <p className="ud-user-email">{activeTab === 'Business suite' ? data.businessEmail : data.email}</p>
                </div>
              </div>
              <div className="ud-tabs">
                <button type="button" className={`ud-tab ${activeTab === 'Personal' ? 'ud-tab--active' : ''}`} onClick={() => setActiveTab('Personal')}>
                  Personal
                </button>
                <button type="button" className={`ud-tab ${activeTab === 'Business suite' ? 'ud-tab--active' : ''}`} onClick={() => setActiveTab('Business suite')}>
                  Business suite
                </button>
              </div>
              {activeTab === 'Personal' && (
                <div className="ud-attrs">
                  <div className="ud-attr">
                    <span className="ud-attr-label">Account Type:</span>
                    <span className="ud-attr-value">{data.accountType}</span>
                  </div>
                  <div className="ud-attr">
                    <span className="ud-attr-label">KYC:</span>
                    <span className={`ud-kyc-badge ud-kyc-badge--${(data.kycStatus || '').toLowerCase()}`}>{kycDisplay(data.kycStatus)}</span>
                  </div>
                  <div className="ud-attr">
                    <span className="ud-attr-label">Nationality:</span>
                    <span className="ud-attr-value">{data.nationality}</span>
                  </div>
                  <div className="ud-attr">
                    <span className="ud-attr-label">Date of Birth:</span>
                    <span className="ud-attr-value">{data.dateOfBirth}</span>
                  </div>
                  {data.accountCreatedDate !== '—' && (
                    <div className="ud-attr">
                      <span className="ud-attr-label">Account created:</span>
                      <span className="ud-attr-value">{data.accountCreatedDate}</span>
                    </div>
                  )}
                  {data.lastActivityAgo !== '—' && (
                    <div className="ud-attr">
                      <span className="ud-attr-label">Last activity:</span>
                      <span className="ud-attr-value">{data.lastActivityAgo}</span>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'Business suite' && data.businessDescription && (
                <p className="ud-business-desc">{data.businessDescription}</p>
              )}
            </section>

            {/* User KYC */}
            {activeTab === 'Personal' && (
              <section className="ud-card ud-kyc">
                <div className="ud-kyc-head">
                  <div className="ud-card-title-row">
                    <span className="ud-card-bar" />
                    <h3 className="ud-card-title">User KYC</h3>
                  </div>
                  <div className="ud-kyc-head-actions">
                    <span className={`ud-kyc-badge ud-kyc-badge--${(data.kycStatus || '').toLowerCase()}`}>{kycDisplay(data.kycStatus)}</span>
                    <button type="button" className="ud-kyc-update-btn" onClick={() => setShowKycModal(true)}>
                      Update KYC status
                    </button>
                  </div>
                </div>
                <div className="ud-kyc-fields">
                  <div className="ud-kyc-field">
                    <span className="ud-kyc-label">Linked ID:</span>
                    <span className="ud-kyc-value">{data.linkedIdType}</span>
                  </div>
                  <div className="ud-kyc-field">
                    <span className="ud-kyc-label">Card number:</span>
                    <span className="ud-kyc-value">{data.cardNumber}</span>
                  </div>
                  <div className="ud-kyc-field">
                    <span className="ud-kyc-label">Wallet Address:</span>
                    <span className="ud-kyc-value">{data.walletAddress}</span>
                  </div>
                </div>
                <div className="ud-kyc-docs">
                  <div className="ud-kyc-doc">
                    {data.kycDocuments?.liveSelfie ? (
                      <img src={data.kycDocuments.liveSelfie} alt="Live Selfie" className="ud-kyc-doc-img" />
                    ) : (
                      <div className="ud-kyc-doc-placeholder" />
                    )}
                    <span className="ud-kyc-doc-label">Live Selfie</span>
                  </div>
                  <div className="ud-kyc-doc">
                    {data.kycDocuments?.front ? (
                      <img src={data.kycDocuments.front} alt="ID Front" className="ud-kyc-doc-img" />
                    ) : (
                      <div className="ud-kyc-doc-placeholder" />
                    )}
                    <span className="ud-kyc-doc-label">Front</span>
                  </div>
                  <div className="ud-kyc-doc">
                    {data.kycDocuments?.back ? (
                      <img src={data.kycDocuments.back} alt="ID Back" className="ud-kyc-doc-img" />
                    ) : (
                      <div className="ud-kyc-doc-placeholder" />
                    )}
                    <span className="ud-kyc-doc-label">Back</span>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="ud-right">
            {/* Wallet Details */}
            <section className="ud-card ud-wallets">
              <div className="ud-wallet-head">
                <div className="ud-card-title-row">
                  <span className="ud-card-bar" />
                  <h3 className="ud-card-title">Wallet Details</h3>
                </div>
                <div className="ud-pill">
                  <span className="ud-pill-label">Active Wallet</span>
                  <span className="ud-pill-value">{data.walletTotal}</span>
                </div>
              </div>
              <div className="ud-table-wrap">
                <table className="ud-table">
                  <thead>
                    <tr>
                      <th>Wallet name</th>
                      <th>Wallet Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.wallets || []).map((w, i) => (
                      <tr key={i}>
                        <td><span className="ud-row-dot" /><span>{w.name}</span></td>
                        <td>{w.type}</td>
                        <td>{w.amount}</td>
                        <td>{w.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="ud-pagination">
                <button type="button" className="ud-page-btn" disabled aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" className="ud-page-num ud-page-num--active">1</button>
                <button type="button" className="ud-page-num">2</button>
                <span className="ud-page-ellipsis">...</span>
                <button type="button" className="ud-page-num">9</button>
                <button type="button" className="ud-page-num">10</button>
                <button type="button" className="ud-page-btn" aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom row: Escrow, Transactions, Disputes */}
        <div className="ud-bottom-row">
          <section className="ud-card ud-escrow">
            <div className="ud-escrow-head">
              <div className="ud-card-title-row">
                <span className="ud-card-bar" />
                <h3 className="ud-card-title">Escrow Details</h3>
              </div>
              <div className="ud-pill">
                <span className="ud-pill-label">Active Escrow</span>
                <span className="ud-pill-value">{data.escrowTotal}</span>
              </div>
            </div>
            <div className="ud-list">
              {(data.escrows || []).map((e, i) => (
                <div key={i} className="ud-list-row ud-escrow-row">
                  <span className="ud-escrow-id">{e.id}</span>
                  <span className="ud-escrow-parties">{e.parties}</span>
                  <span className="ud-escrow-amount">{e.amount}</span>
                  <span className={`ud-status ${statusClass(e.status)}`}>{e.status}</span>
                </div>
              ))}
            </div>
            <div className="ud-pagination">
              <button type="button" className="ud-page-btn" disabled aria-label="Previous"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              <button type="button" className="ud-page-num ud-page-num--active">1</button>
              <button type="button" className="ud-page-num">2</button>
              <span className="ud-page-ellipsis">...</span>
              <button type="button" className="ud-page-num">9</button>
              <button type="button" className="ud-page-num">10</button>
              <button type="button" className="ud-page-btn" aria-label="Next"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
          </section>

          <section className="ud-card ud-transactions">
            <div className="ud-card-title-row">
              <span className="ud-card-bar" />
              <h3 className="ud-card-title">Transaction type</h3>
            </div>
            <div className="ud-list">
              {(data.transactions || []).map((t, i) => (
                <div key={i} className="ud-list-row ud-tx-row">
                  <div className="ud-tx-main">
                    <span className="ud-tx-type">{t.type}</span>
                    <span className="ud-tx-amount">{t.amount}</span>
                    <span className="ud-tx-time">{t.time}</span>
                  </div>
                  <div className="ud-tx-desc">{t.description}</div>
                </div>
              ))}
            </div>
            <div className="ud-pagination">
              <button type="button" className="ud-page-btn" disabled aria-label="Previous"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              <button type="button" className="ud-page-num ud-page-num--active">1</button>
              <button type="button" className="ud-page-num">2</button>
              <span className="ud-page-ellipsis">...</span>
              <button type="button" className="ud-page-num">9</button>
              <button type="button" className="ud-page-num">10</button>
              <button type="button" className="ud-page-btn" aria-label="Next"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
          </section>

          <section className="ud-card ud-disputes">
            <div className="ud-escrow-head">
              <div className="ud-card-title-row">
                <span className="ud-card-bar" />
                <h3 className="ud-card-title">API Integrations</h3>
              </div>
              <div className="ud-pill">
                <span className="ud-pill-label">Active Dispute</span>
                <span className="ud-pill-value">{data.disputeTotal}</span>
              </div>
            </div>
            <div className="ud-list">
              {(data.disputes || []).map((d, i) => (
                <div key={i} className="ud-list-row ud-dispute-row">
                  <span className="ud-dispute-name">{d.name}</span>
                  <span className="ud-dispute-parties">{d.parties}</span>
                  <span className={`ud-status ${statusClass(d.status)}`}>{d.status}</span>
                  <span className="ud-dispute-date">{d.date}</span>
                </div>
              ))}
            </div>
            <div className="ud-pagination">
              <button type="button" className="ud-page-btn" disabled aria-label="Previous"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              <button type="button" className="ud-page-num ud-page-num--active">1</button>
              <button type="button" className="ud-page-num">2</button>
              <span className="ud-page-ellipsis">...</span>
              <button type="button" className="ud-page-num">9</button>
              <button type="button" className="ud-page-num">10</button>
              <button type="button" className="ud-page-btn" aria-label="Next"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
          </section>
        </div>

        {/* KYC status update modal */}
        {showKycModal && (
          <div className="ud-kyc-modal-backdrop" onClick={() => !kycActionLoading && setShowKycModal(false)}>
            <div className="ud-kyc-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ud-kyc-modal-header">
                <h3 className="ud-kyc-modal-title">Update KYC status</h3>
                <button type="button" className="ud-kyc-modal-close" onClick={() => !kycActionLoading && setShowKycModal(false)} aria-label="Close">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <div className="ud-kyc-modal-body">
                <p className="ud-kyc-modal-text">Current status: <span className={`ud-kyc-badge ud-kyc-badge--${(data.kycStatus || '').toLowerCase()}`}>{kycDisplay(data.kycStatus)}</span></p>
                {kycActionError && <p className="ud-kyc-modal-error">{kycActionError}</p>}
                <div className="ud-kyc-modal-actions">
                  <button type="button" className="ud-kyc-modal-btn ud-kyc-modal-btn--approve" onClick={() => handleKycUpdate('verified')} disabled={kycActionLoading}>
                    {kycActionLoading ? 'Updating...' : 'Approve'}
                  </button>
                  <button type="button" className="ud-kyc-modal-btn ud-kyc-modal-btn--decline" onClick={() => handleKycUpdate('declined')} disabled={kycActionLoading}>
                    Decline
                  </button>
                  <button type="button" className="ud-kyc-modal-btn ud-kyc-modal-btn--secondary" onClick={() => !kycActionLoading && setShowKycModal(false)} disabled={kycActionLoading}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDetail;
