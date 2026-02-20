import React, { useState } from 'react';
import Layout from '../shared/Layout';
import './Transactions.css';

const Transactions = ({ onMenuClick }) => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [filterAll, setFilterAll] = useState('All');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const transactions = [
    { id: '4F9A2C7B8D1E5F3A6B', type: 'Funds Transfer', userId: 'John Doe', sender: 'John Doe', recipient: 'Sarah Lane', amount: '$453', status: 'Successful', currency: 'USDT', date: '3h ago', dateFull: '15:40 14 Dec 2025' },
    { id: '2B8E5D1A9C4F7E3B6D', type: 'Deposit', userId: 'Jane Smith', sender: 'Jane Smith', recipient: '—', amount: '$1,200.00', status: 'Successful', currency: 'USD', date: '5h ago', dateFull: '12:20 14 Dec 2025' },
    { id: '5E8A4D9C2B7F1F6E8C', type: 'Withdrawal Request', userId: 'Jane Smith', sender: 'Jane Smith', recipient: '—', amount: '$250.00', status: 'Pending', currency: 'BTC', date: '2h ago', dateFull: '14:05 14 Dec 2025' },
    { id: '7C3F9A1E6B8D2F4A5C', type: 'Escrow Release', userId: 'Michael Brown', sender: 'Michael Brown', recipient: 'Alice Green', amount: '$890.00', status: 'Successful', currency: 'USDT', date: '1h ago', dateFull: '15:10 14 Dec 2025' },
    { id: '9A6E2C8B4F1D7E3A5B', type: 'Payment Sent', userId: 'Emily Davis', sender: 'Emily Davis', recipient: 'Bob Wilson', amount: '$150.00', status: 'Pending', currency: 'ETH', date: '45m ago', dateFull: '15:35 14 Dec 2025' },
    { id: '8D5E8C9B2A4F1C7B9E', type: 'Payment Received', userId: 'Charlie White', sender: 'David Lee', recipient: 'Charlie White', amount: '$200.00', status: 'Failed', currency: 'USDT', date: '15m ago', dateFull: '15:45 14 Dec 2025' },
  ];

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
              </div>
              <div className="tx-card-label">Total Transaction</div>
              <div className="tx-card-value">5,454</div>
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
                <div className="tx-card-trend">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                  <span>10% in the past month</span>
                </div>
              </div>
              <div className="tx-card-label">Total Amount</div>
              <div className="tx-card-value">$5,454</div>
            </div>
            <div className="tx-card">
              <div className="tx-card-head">
                <div className="tx-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="tx-card-trend">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                  <span>10% in the past month</span>
                </div>
              </div>
              <div className="tx-card-label">Escrowed Amount</div>
              <div className="tx-card-value">$5,454</div>
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
              </div>
              <div className="tx-card-label">Payroll Amount</div>
              <div className="tx-card-value">$5,454</div>
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
                <button type="button" className={activeTab === 'Personal' ? 'active' : ''} onClick={() => setActiveTab('Personal')}>Personal</button>
                <button type="button" className={activeTab === 'Business suite' ? 'active' : ''} onClick={() => setActiveTab('Business suite')}>Business suite</button>
              </div>
              <select className="tx-filter-select" value={filterAll} onChange={(e) => setFilterAll(e.target.value)}>
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
                {transactions.map((row, index) => (
                  <tr key={index} onClick={() => setSelectedTransaction(row)}>
                    <td>
                      <div className="tx-id-cell">
                        <span className="tx-radio" />
                        <span>{row.id}</span>
                      </div>
                    </td>
                    <td>{row.type}</td>
                    <td>{row.userId}</td>
                    <td>{row.amount}</td>
                    <td><span className={`tx-status tx-status--${row.status.toLowerCase()}`}>{row.status}</span></td>
                    <td>{row.currency}</td>
                    <td>{row.date}</td>
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
            <button type="button" className="tx-page-btn" disabled aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button type="button" className="tx-page-num active">1</button>
            <button type="button" className="tx-page-num">2</button>
            <span className="tx-page-ellipsis">...</span>
            <button type="button" className="tx-page-num">9</button>
            <button type="button" className="tx-page-num">10</button>
            <button type="button" className="tx-page-btn" aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </section>

        {/* Transaction Summary Modal */}
        {selectedTransaction && (
          <div className="tx-modal-overlay" onClick={() => setSelectedTransaction(null)}>
            <div className="tx-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tx-modal-header">
                <h2 className="tx-modal-title">Transaction Summary</h2>
                <button type="button" className="tx-modal-close" onClick={() => setSelectedTransaction(null)} aria-label="Close">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="tx-modal-body">
                <div className="tx-modal-row"><span className="tx-modal-label">Transaction ID</span><span className="tx-modal-value">{selectedTransaction.id}</span></div>
                <div className="tx-modal-row"><span className="tx-modal-label">Type</span><span className="tx-modal-value">{selectedTransaction.type}</span></div>
                <div className="tx-modal-row"><span className="tx-modal-label">Sender</span><span className="tx-modal-value">{selectedTransaction.sender}</span></div>
                <div className="tx-modal-row"><span className="tx-modal-label">Recipient</span><span className="tx-modal-value">{selectedTransaction.recipient}</span></div>
                <div className="tx-modal-row"><span className="tx-modal-label">Amount</span><span className="tx-modal-value">{selectedTransaction.amount}</span></div>
                <div className="tx-modal-row"><span className="tx-modal-label">Currency</span><span className="tx-modal-value">{selectedTransaction.currency}</span></div>
                <div className="tx-modal-row"><span className="tx-modal-label">Status</span><span className="tx-modal-value">{selectedTransaction.status}</span></div>
                <div className="tx-modal-row"><span className="tx-modal-label">Date</span><span className="tx-modal-value">{selectedTransaction.dateFull || selectedTransaction.date}</span></div>
              </div>
              <button type="button" className="tx-modal-transfer-btn">Transfer</button>
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
