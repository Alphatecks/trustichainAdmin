import React, { useState } from 'react';
import Layout from '../shared/Layout';
import './UserDetail.css';

const UserDetail = ({ user, onBack, onMenuClick }) => {
  const [activeTab, setActiveTab] = useState('Personal');

  // Default user data with fallbacks for all properties
  const defaultData = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    accountType: 'Personal',
    kycStatus: 'Verified',
    nationality: 'Nigerian',
    dateOfBirth: '13 07 2003',
    linkedIdType: 'National ID card',
    cardNumber: '32415473628',
    walletAddress: 'HTWR524TRy3',
    businessName: 'Make BELIEVE Corp',
    businessEmail: 'johndoe@gmail.com',
    businessDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    wallets: [
      { name: 'John Doe', type: 'Savings Wallet', amount: '$14,800', date: '13 Jul 20205' },
      { name: 'John Doe', type: 'XPR Wallet', amount: '$14,800', date: '13 Jul 20205' },
      { name: 'John Doe', type: 'Savings Wallet', amount: '$14,800', date: '13 Jul 20205' },
      { name: 'John Doe', type: 'Savings Wallet', amount: '$14,800', date: '13 Jul 20205' },
      { name: 'John Doe', type: 'Savings Wallet', amount: '$14,800', date: '13 Jul 20205' },
      { name: 'John Doe', type: 'Savings Wallet', amount: '$14,800', date: '13 Jul 20205' }
    ],
    escrows: [
      { id: '$324', parties: 'Parties involved', status: 'In progress' },
      { id: '$324', parties: 'Parties involved', status: 'Completed' },
      { id: '$324', parties: 'Parties involved', status: 'Disputed' },
      { id: '$324', parties: 'Parties involved', status: 'Resolved' },
      { id: '$324', parties: 'Parties involved', status: 'Resolved' }
    ],
    payrolls: [
      { teamName: 'Angelo group', teamMembers: '18', amount: '$14,800', duration: '28days', status: 'Active' },
      { teamName: 'Beta team', teamMembers: '25', amount: '$22,500', duration: '15days', status: 'Inactive' },
      { teamName: 'Charlie squad', teamMembers: '12', amount: '$9,600', duration: '40days', status: 'Active' },
      { teamName: 'Delta crew', teamMembers: '30', amount: '$31,200', duration: '22days', status: 'Pending' }
    ],
    transactions: [
      { type: 'Funds Transferred', amount: '$324', time: '3m ago', description: 'You transferred $324 to Jane foster' },
      { type: 'Payment Received', amount: '$450', time: '10m ago', description: 'You received $450 from Mark Thompson' },
      { type: 'Invoice Sent', amount: '$150', time: '15m ago', description: 'You sent an invoice of $150 to Sarah Lee' },
      { type: 'Refund Processed', amount: '$75', time: '20m ago', description: 'You refunded $75 to Alex Smith' },
      { type: 'Transaction Declined', amount: '$600', time: '25m ago', description: 'Your payment of $600 to Laura Chen was declined' }
    ],
    disputes: [
      { name: 'Parties involved', parties: 'Parties involved', status: 'In progress', date: '3rd Dec 2025' },
      { name: 'Contract Breach', parties: 'Company A, Company B', status: 'Resolved', date: '15th Nov 2023' },
      { name: 'Payment Dispute', parties: 'Client X, Provider Y', status: 'Pending', date: '22nd Jan 2024' },
      { name: 'Intellectual Property', parties: 'Inventor Z, Corporation Q', status: 'In progress', date: '30th Apr 2025' },
      { name: 'Service Agreement', parties: 'User M, Service N', status: 'Closed', date: '10th Jul 2023' }
    ]
  };

  // Merge user data with defaults, ensuring all arrays exist
  const userData = {
    ...defaultData,
    ...user,
    wallets: user?.wallets || defaultData.wallets,
    escrows: user?.escrows || defaultData.escrows,
    payrolls: user?.payrolls || defaultData.payrolls,
    transactions: user?.transactions || defaultData.transactions,
    disputes: user?.disputes || defaultData.disputes
  };

  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'verified' || statusLower === 'completed' || statusLower === 'resolved' || statusLower === 'active') {
      return 'status-verified';
    } else if (statusLower === 'in progress' || statusLower === 'pending') {
      return 'status-in-progress';
    } else if (statusLower === 'disputed' || statusLower === 'inactive') {
      return 'status-disputed';
    } else if (statusLower === 'closed') {
      return 'status-closed';
    }
    return '';
  };

  const getTransactionTypeClass = (type) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('received')) {
      return 'transaction-received';
    } else if (typeLower.includes('transferred') || typeLower.includes('sent')) {
      return 'transaction-sent';
    } else if (typeLower.includes('refund')) {
      return 'transaction-refund';
    } else if (typeLower.includes('declined')) {
      return 'transaction-declined';
    }
    return 'transaction-default';
  };

  return (
    <Layout activeMenu="users" onMenuClick={onMenuClick}>
      <div className="user-detail-container">
        {/* Header */}
        <header className="main-header">
          <div className="breadcrumb">
            <span onClick={onBack} style={{ cursor: 'pointer' }}>Admin End &gt; User Management</span>
          </div>
          <input className="search-bar" type="text" placeholder="Search" />
          <div className="profile">
            <span className="notification">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.23858 2 5 4.23858 5 7V11C5 12.1046 4.10457 13 3 13H17C15.8954 13 15 12.1046 15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="#2563eb" strokeWidth="2"/>
                <path d="M7 15C7 16.1046 8.34315 17 10 17C11.6569 17 13 16.1046 13 15" stroke="#2563eb" strokeWidth="2"/>
              </svg>
            </span>
            <span className="avatar">SC</span>
            <span className="profile-info">
              <span className="name">Sarah Chen</span>
              <span className="role">Freelancer</span>
            </span>
            <span className="checkmark">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z" fill="#2563eb"/>
              </svg>
            </span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="user-detail-grid">
          {/* Left Column - User Details and KYC */}
          <div className="left-column-section">
            {/* User Details Section */}
            <div className="user-detail-card user-details-section">
              <div className="user-details-header">
                <div className="user-details-title-section">
                  <span className="section-dot"></span>
                  <h3 className="user-details-title">User Details</h3>
                </div>
                <div className="user-tabs">
                  <button 
                    className={`user-tab ${activeTab === 'Personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Personal')}
                  >
                    Personal
                  </button>
                  <button 
                    className={`user-tab ${activeTab === 'Business suite' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Business suite')}
                  >
                    Business suite
                  </button>
                </div>
              </div>
              <div className="user-profile-section">
                <div className="profile-picture-placeholder"></div>
                <div className="user-info">
                  <h2 className="user-name">
                    {activeTab === 'Business suite' ? userData.businessName : userData.name}
                  </h2>
                  <p className="user-email">
                    {activeTab === 'Business suite' ? userData.businessEmail : userData.email}
                  </p>
                  {activeTab === 'Business suite' && (
                    <p className="business-description">{userData.businessDescription}</p>
                  )}
                </div>
              </div>
              {activeTab === 'Personal' && (
                <div className="user-attributes">
                  <div className="attribute-item">
                    <span className="attribute-label">Account Type:</span>
                    <span className="attribute-value">{userData.accountType}</span>
                  </div>
                  <div className="attribute-separator"></div>
                  <div className="attribute-item">
                    <span className="attribute-label">KYC:</span>
                    <span className={`kyc-badge ${userData.kycStatus.toLowerCase()}`}>
                      {userData.kycStatus}
                    </span>
                  </div>
                  <div className="attribute-separator"></div>
                  <div className="attribute-item">
                    <span className="attribute-label">Nationality:</span>
                    <span className="attribute-value">{userData.nationality}</span>
                  </div>
                  <div className="attribute-separator"></div>
                  <div className="attribute-item">
                    <span className="attribute-label">Date of Birth:</span>
                    <span className="attribute-value">{userData.dateOfBirth}</span>
                  </div>
                </div>
              )}
            </div>

            {/* User KYC Section - Personal Tab */}
            {activeTab === 'Personal' && (
              <div className="user-detail-card kyc-section">
                <div className="kyc-header">
                  <div className="kyc-title-section">
                    <span className="section-dot"></span>
                    <h3 className="kyc-title">User KYC</h3>
                  </div>
                  <button className={`verified-badge ${userData.kycStatus.toLowerCase()}`}>
                    {userData.kycStatus}
                  </button>
                </div>
                <div className="kyc-info-horizontal">
                  <div className="kyc-info-item-horizontal">
                    <span className="kyc-label">Linked ID:</span>
                    <span className="kyc-value">{userData.linkedIdType}</span>
                  </div>
                  <div className="kyc-separator"></div>
                  <div className="kyc-info-item-horizontal">
                    <span className="kyc-label">Card number:</span>
                    <span className="kyc-value">{userData.cardNumber}</span>
                  </div>
                  <div className="kyc-separator"></div>
                  <div className="kyc-info-item-horizontal">
                    <span className="kyc-label">Wallet Address:</span>
                    <span className="kyc-value">{userData.walletAddress}</span>
                  </div>
                </div>
                <div className="kyc-images">
                  <div className="kyc-image-wrapper">
                    <div className="kyc-image-placeholder"></div>
                    <span className="kyc-image-label">Live Selfie</span>
                  </div>
                  <div className="kyc-image-wrapper">
                    <div className="kyc-image-placeholder"></div>
                    <span className="kyc-image-label">Front</span>
                  </div>
                  <div className="kyc-image-wrapper">
                    <div className="kyc-image-placeholder"></div>
                    <span className="kyc-image-label">Back</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payroll Details Section - Business Suite Tab */}
            {activeTab === 'Business suite' && (
              <div className="user-detail-card payroll-section">
                <div className="payroll-header">
                  <div className="payroll-title-section">
                    <span className="section-dot"></span>
                    <h3 className="payroll-title">Payroll Details</h3>
                  </div>
                  <div className="payroll-count">
                    <span className="payroll-count-label">Active Payroll</span>
                    <span className="payroll-count-number">20</span>
                  </div>
                </div>
                <div className="payroll-table-container">
                  <table className="payroll-table">
                    <thead>
                      <tr>
                        <th>Team Name</th>
                        <th>Team members</th>
                        <th>Amount</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.payrolls.map((payroll, index) => (
                        <tr key={index}>
                          <td>{payroll.teamName}</td>
                          <td>{payroll.teamMembers}</td>
                          <td>{payroll.amount}</td>
                          <td>{payroll.duration}</td>
                          <td>
                            <span className={`payroll-status ${getStatusClass(payroll.status)}`}>
                              {payroll.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <button className="pagination-btn" disabled>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="pagination-number active">1</button>
                  <button className="pagination-number">2</button>
                  <span className="pagination-ellipsis">...</span>
                  <button className="pagination-number">9</button>
                  <button className="pagination-number">10</button>
                  <button className="pagination-btn">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Wallet Details */}
          <div className="right-column-section">
            {/* Wallet Details Section */}
            <div className="user-detail-card wallet-details-section">
              <div className="wallet-header">
                <div className="wallet-title-section">
                  <span className="section-dot"></span>
                  <h3 className="wallet-title">Wallet Details</h3>
                </div>
                <div className="wallet-count">
                  <span className="wallet-count-label">Active Wallet</span>
                  <span className="wallet-count-number">12</span>
                </div>
              </div>
              <div className="wallet-table-container">
                <table className="wallet-table">
                  <thead>
                    <tr>
                      <th>Wallet name</th>
                      <th>Wallet Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.wallets.map((wallet, index) => (
                      <tr key={index}>
                        <td>{wallet.name}</td>
                        <td>{wallet.type}</td>
                        <td>{wallet.amount}</td>
                        <td>{wallet.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <button className="pagination-btn" disabled>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="pagination-number active">1</button>
                <button className="pagination-number">2</button>
                <span className="pagination-ellipsis">...</span>
                <button className="pagination-number">9</button>
                <button className="pagination-number">10</button>
                <button className="pagination-btn">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Three Cards Row - Full Width */}
        <div className="three-cards-row">
          {/* Escrow/Supplier Details Card */}
          {activeTab === 'Personal' ? (
            <div className="user-detail-card escrow-card">
              <div className="card-header">
                <div className="card-title-section">
                  <span className="section-dot"></span>
                  <h3 className="card-title">Active Escrow 20</h3>
                </div>
              </div>
              <div className="escrow-list">
                {userData.escrows.map((escrow, index) => (
                  <div key={index} className="escrow-item">
                    <div className="escrow-id">Escrow ID No</div>
                    <div className="escrow-parties">Parties involved</div>
                    <div className="escrow-amount">{escrow.id}</div>
                    <div className={`escrow-status ${getStatusClass(escrow.status)}`}>
                      {escrow.status}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pagination">
                <button className="pagination-btn" disabled>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="pagination-number active">1</button>
                <button className="pagination-number">2</button>
                <span className="pagination-ellipsis">...</span>
                <button className="pagination-number">9</button>
                <button className="pagination-number">10</button>
                <button className="pagination-btn">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="user-detail-card supplier-card">
              <div className="card-header">
                <div className="card-title-section">
                  <span className="section-dot"></span>
                  <h3 className="card-title">Supplier Details</h3>
                </div>
                <div className="supplier-count">
                  <span className="supplier-count-label">Active Escrow</span>
                  <span className="supplier-count-number">20</span>
                </div>
              </div>
              <div className="escrow-list">
                {userData.escrows.map((escrow, index) => (
                  <div key={index} className="escrow-item">
                    <div className="escrow-id">Escrow ID No</div>
                    <div className="escrow-parties">Parties involved</div>
                    <div className="escrow-amount">{escrow.id}</div>
                    <div className={`escrow-status ${getStatusClass(escrow.status)}`}>
                      {escrow.status}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pagination">
                <button className="pagination-btn" disabled>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="pagination-number active">1</button>
                <button className="pagination-number">2</button>
                <span className="pagination-ellipsis">...</span>
                <button className="pagination-number">9</button>
                <button className="pagination-number">10</button>
                <button className="pagination-btn">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Transaction Type Card */}
          <div className="user-detail-card transactions-card">
            <div className="card-header">
              <div className="card-title-section">
                <span className="section-dot"></span>
                <h3 className="card-title">Transaction type</h3>
              </div>
            </div>
            <div className="transactions-list">
              {userData.transactions.map((transaction, index) => (
                <div key={index} className="transaction-item">
                  <div className="transaction-header">
                    <span className={`transaction-type ${getTransactionTypeClass(transaction.type)}`}>
                      {transaction.type}
                    </span>
                    <span className="transaction-amount">{transaction.amount}</span>
                    <span className="transaction-time">{transaction.time}</span>
                  </div>
                  <div className="transaction-description">{transaction.description}</div>
                </div>
              ))}
            </div>
            <div className="pagination">
              <button className="pagination-btn" disabled>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="pagination-number active">1</button>
              <button className="pagination-number">2</button>
              <span className="pagination-ellipsis">...</span>
              <button className="pagination-number">9</button>
              <button className="pagination-number">10</button>
              <button className="pagination-btn">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* API Integrations / Disputes Card */}
          {activeTab === 'Personal' ? (
            <div className="user-detail-card disputes-card">
              <div className="card-header">
                <div className="card-title-section">
                  <span className="section-dot"></span>
                  <h3 className="card-title">Active Dispute 3</h3>
                </div>
              </div>
              <div className="disputes-list">
                {userData.disputes.map((dispute, index) => (
                  <div key={index} className="dispute-item">
                    <div className="dispute-name">{dispute.name}</div>
                    <div className="dispute-parties">{dispute.parties}</div>
                    <div className={`dispute-status ${getStatusClass(dispute.status)}`}>
                      {dispute.status}
                    </div>
                    <div className="dispute-date">{dispute.date}</div>
                  </div>
                ))}
              </div>
              <div className="pagination">
                <button className="pagination-btn" disabled>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="pagination-number active">1</button>
                <button className="pagination-number">2</button>
                <span className="pagination-ellipsis">...</span>
                <button className="pagination-number">9</button>
                <button className="pagination-number">10</button>
                <button className="pagination-btn">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="user-detail-card api-integrations-card">
              <div className="card-header">
                <div className="card-title-section">
                  <span className="section-dot"></span>
                  <h3 className="card-title">API Integrations</h3>
                </div>
              </div>
              <div className="api-integrations-content">
                <p className="api-empty-message">No integrations configured</p>
              </div>
              <div className="pagination">
                <button className="pagination-btn" disabled>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="pagination-number active">1</button>
                <button className="pagination-number">2</button>
                <span className="pagination-ellipsis">...</span>
                <button className="pagination-number">9</button>
                <button className="pagination-number">10</button>
                <button className="pagination-btn">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDetail;
