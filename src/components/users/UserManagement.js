import React, { useState, useEffect, useRef } from 'react';
import Layout from '../shared/Layout';
import './UserManagement.css';

const UserManagement = ({ onMenuClick }) => {
  const [activeTab, setActiveTab] = useState('Personal');
  const [selectedFilter, setSelectedFilter] = useState('Verified Unverified');
  const containerRef = useRef(null);
  const overviewSectionRef = useRef(null);
  const userOverviewSectionRef = useRef(null);

  // #region agent log
  useEffect(() => {
    const logSpacing = () => {
      if (containerRef.current && overviewSectionRef.current && userOverviewSectionRef.current) {
        const container = containerRef.current;
        const overview = overviewSectionRef.current;
        const userOverview = userOverviewSectionRef.current;
        
        const containerStyles = window.getComputedStyle(container);
        const overviewStyles = window.getComputedStyle(overview);
        const userOverviewStyles = window.getComputedStyle(userOverview);
        
        const overviewRect = overview.getBoundingClientRect();
        const userOverviewRect = userOverview.getBoundingClientRect();
        const actualGap = userOverviewRect.top - overviewRect.bottom;
        
        fetch('http://127.0.0.1:7245/ingest/2c3b4d0b-1e9d-43b2-93e5-66abcac194ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'UserManagement.js:25',message:'Spacing measurement',data:{containerGap:containerStyles.gap,overviewMarginBottom:overviewStyles.marginBottom,userOverviewMarginTop:userOverviewStyles.marginTop,actualGap,overviewBottom:overviewRect.bottom,userOverviewTop:userOverviewRect.top},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      }
    };
    
    setTimeout(logSpacing, 100);
    window.addEventListener('resize', logSpacing);
    return () => window.removeEventListener('resize', logSpacing);
  }, [activeTab, selectedFilter]);
  // #endregion

  const users = [
    {
      name: 'John Doe',
      kycStatus: 'Verified',
      totalVolume: '$14,800',
      escrowCreated: '45',
      savingsAccount: '4',
      accountCreated: '21 July 2025',
      lastActivity: '3hrs ago'
    },
    {
      name: 'Jane Smith',
      kycStatus: 'Pending',
      totalVolume: '$9,300',
      escrowCreated: '30',
      savingsAccount: '2',
      accountCreated: '20 July 2025',
      lastActivity: '5hrs ago'
    },
    {
      name: 'Michael Brown',
      kycStatus: 'Verified',
      totalVolume: '$21,500',
      escrowCreated: '60',
      savingsAccount: '5',
      accountCreated: '19 July 2025',
      lastActivity: '2hrs ago'
    },
    {
      name: 'Emily Davis',
      kycStatus: 'Rejected',
      totalVolume: '$7,400',
      escrowCreated: '20',
      savingsAccount: '1',
      accountCreated: '18 July 2025',
      lastActivity: '1 day ago'
    },
    {
      name: 'David Wilson',
      kycStatus: 'Verified',
      totalVolume: '$15,000',
      escrowCreated: '50',
      savingsAccount: '4',
      accountCreated: '17 July 2025',
      lastActivity: '3 days ago'
    },
    {
      name: 'Sophia Johnson',
      kycStatus: 'Pending',
      totalVolume: '$12,200',
      escrowCreated: '25',
      savingsAccount: '3',
      accountCreated: '16 July 2025',
      lastActivity: '4 days ago'
    }
  ];

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7245/ingest/2c3b4d0b-1e9d-43b2-93e5-66abcac194ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'UserManagement.js:95',message:'Component mounted',data:{activeTab,selectedFilter},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }, []);
  // #endregion

  return (
    <Layout activeMenu="users" onMenuClick={onMenuClick}>
      <div className="user-management-container" ref={containerRef}>
      {/* Header */}
      <header className="main-header">
        <div className="breadcrumb">Admin End &gt; User Management</div>
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
        </div>
      </header>

      {/* Overview Section */}
      <section className="overview-section" ref={overviewSectionRef}>
        <div className="section-header">
          <span className="section-dot"></span>
          <span className="section-title">Overview</span>
        </div>
        <div className="overview-cards-grid">
          <div className="overview-card">
            <div className="overview-card-icon-bg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="#fff"/>
              </svg>
            </div>
            <div className="overview-card-info">
              <div className="overview-card-row">
                <span className="overview-card-trend-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12l6 6L20 6" stroke="#2563eb" strokeWidth="2" fill="none"/>
                  </svg>
                </span>
                <span className="overview-card-trend-label">10% in the past month</span>
              </div>
              <div className="overview-card-label">Total Users</div>
              <div className="overview-card-value">5,454</div>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-card-icon-bg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="#fff"/>
                <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="overview-card-info">
              <div className="overview-card-row">
                <span className="overview-card-trend-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12l6 6L20 6" stroke="#2563eb" strokeWidth="2" fill="none"/>
                  </svg>
                </span>
                <span className="overview-card-trend-label">10% in the past month</span>
              </div>
              <div className="overview-card-label">Verified Users</div>
              <div className="overview-card-value">5,454</div>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-card-icon-bg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="7" width="18" height="10" rx="2" fill="#fff"/>
              </svg>
            </div>
            <div className="overview-card-info">
              <div className="overview-card-label">Personal Suite</div>
              <div className="overview-card-value">5,454</div>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-card-icon-bg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="overview-card-info">
              <div className="overview-card-label">Business Suite</div>
              <div className="overview-card-value">5,454</div>
            </div>
          </div>
        </div>
      </section>

      {/* User Overview Section */}
      <section className="user-overview-section" ref={userOverviewSectionRef}>
        <div className="section-header">
          <span className="section-dot"></span>
          <span className="section-title">User Overview</span>
        </div>
        
        <div className="user-overview-controls">
          <div className="search-control">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#666" strokeWidth="1.5"/>
              <path d="M15 15l-3-3" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search" className="user-search-input" />
          </div>
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'Personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('Personal')}
            >
              Personal
            </button>
            <button 
              className={`tab-button ${activeTab === 'Business suite' ? 'active' : ''}`}
              onClick={() => setActiveTab('Business suite')}
            >
              Business suite
            </button>
          </div>
          <div className="filter-controls">
            <select 
              className="filter-dropdown"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option>Verified Unverified</option>
              <option>Verified</option>
              <option>Unverified</option>
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

        <div className="user-table-container">
          <table className="user-table">
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
              {users.map((user, index) => (
                <tr key={index}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"></div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`kyc-status ${user.kycStatus.toLowerCase()}`}>
                      {user.kycStatus}
                    </span>
                  </td>
                  <td>{user.totalVolume}</td>
                  <td>{user.escrowCreated}</td>
                  <td>{user.savingsAccount}</td>
                  <td>{user.accountCreated}</td>
                  <td>
                    <div className="last-activity-cell">
                      <span>{user.lastActivity}</span>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
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
      </section>
      </div>
    </Layout>
  );
};

export default UserManagement;
