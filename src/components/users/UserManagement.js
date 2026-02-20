import React, { useState } from 'react';
import Layout from '../shared/Layout';
import './UserManagement.css';

const UserManagement = ({ onMenuClick, onUserClick }) => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [selectedFilter, setSelectedFilter] = useState('Verified Unverified');

  const users = [
    { name: 'John Doe', kycStatus: 'Verified', totalVolume: '$14,800', escrowCreated: '45', savingsAccount: '4', accountCreated: '21 July 2025', lastActivity: '3hrs ago', email: 'johndoe@gmail.com', accountType: 'Personal', nationality: 'Nigerian', dateOfBirth: '13 07 2003', linkedIdType: 'National ID card', cardNumber: '32415473628', walletAddress: 'HTWR524TRy3', wallets: [], escrows: [], transactions: [], disputes: [] },
    { name: 'Jane Smith', kycStatus: 'Pending', totalVolume: '$9,300', escrowCreated: '30', savingsAccount: '2', accountCreated: '20 July 2025', lastActivity: '5hrs ago' },
    { name: 'Michael Brown', kycStatus: 'Verified', totalVolume: '$21,500', escrowCreated: '60', savingsAccount: '5', accountCreated: '19 July 2025', lastActivity: '2hrs ago' },
    { name: 'Emily Davis', kycStatus: 'Rejected', totalVolume: '$7,400', escrowCreated: '20', savingsAccount: '1', accountCreated: '18 July 2025', lastActivity: '1 day ago' },
    { name: 'David Wilson', kycStatus: 'Verified', totalVolume: '$15,000', escrowCreated: '50', savingsAccount: '4', accountCreated: '17 July 2025', lastActivity: '3 days ago' },
    { name: 'Sophia Johnson', kycStatus: 'Pending', totalVolume: '$12,200', escrowCreated: '25', savingsAccount: '3', accountCreated: '16 July 2025', lastActivity: '4 days ago' }
  ];

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
            <div className="um-card">
              <div className="um-card-head">
                <div className="um-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="#fff"/>
                  </svg>
                </div>
                <div className="um-card-trend">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                  <span>10% in the past month</span>
                </div>
              </div>
              <div className="um-card-label">Total Users</div>
              <div className="um-card-value">5,454</div>
            </div>
            <div className="um-card">
              <div className="um-card-head">
                <div className="um-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="#fff"/>
                    <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="um-card-trend">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                  <span>10% in the past month</span>
                </div>
              </div>
              <div className="um-card-label">Verified Users</div>
              <div className="um-card-value">5,454</div>
            </div>
            <div className="um-card">
              <div className="um-card-head">
                <div className="um-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="7" width="18" height="10" rx="2" fill="#fff"/>
                  </svg>
                </div>
              </div>
              <div className="um-card-label">Personal Suite</div>
              <div className="um-card-value">5,454</div>
            </div>
            <div className="um-card">
              <div className="um-card-head">
                <div className="um-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="um-card-label">Business Suite</div>
              <div className="um-card-value">5,454</div>
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
            <div className="um-table-search">
              <svg className="um-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="Search" />
            </div>
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
          <div className="um-table-wrap">
            <table className="um-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>KYC Status</th>
                  <th>Total Volume:</th>
                  <th>Escrow created</th>
                  <th>Savings Account</th>
                  <th>Account Created</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} onClick={() => onUserClick && onUserClick(user)}>
                    <td>
                      <div className="um-user-cell">
                        <span className="um-user-radio" />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td><span className={`um-kyc um-kyc--${user.kycStatus.toLowerCase()}`}>{user.kycStatus}</span></td>
                    <td>{user.totalVolume}</td>
                    <td>{user.escrowCreated}</td>
                    <td>{user.savingsAccount}</td>
                    <td>{user.accountCreated}</td>
                    <td>
                      <div className="um-activity-cell">
                        <span>{user.lastActivity}</span>
                        <button type="button" className="um-view-btn" aria-label="View">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="um-pagination">
            <button type="button" className="um-page-btn" disabled aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button type="button" className="um-page-num active">1</button>
            <button type="button" className="um-page-num">2</button>
            <span className="um-page-ellipsis">...</span>
            <button type="button" className="um-page-num">9</button>
            <button type="button" className="um-page-num">10</button>
            <button type="button" className="um-page-btn" aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default UserManagement;
