import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={require('../assets/images/logo.png')} alt="Logo" className="logo-img" />
          <span className="logo-text">TrustiChain</span>
        </div>
        <nav>
          <ul>
            <li className="active"><span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 9.5L10 3L17 9.5V17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17V9.5Z" stroke="#2563eb" strokeWidth="2"/></svg></span> Dashboard</li>
            <li><span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="4" stroke="#2563eb" strokeWidth="2"/><path d="M2 17C2 13.6863 5.13401 11 9 11H11C14.866 11 18 13.6863 18 17" stroke="#2563eb" strokeWidth="2"/></svg></span> Users Management</li>
            <li><span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="10" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M7 7V5C7 3.89543 7.89543 3 9 3H11C12.1046 3 13 3.89543 13 5V7" stroke="#2563eb" strokeWidth="2"/></svg></span> Escrow Management</li>
            <li><span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="10" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M7 9H13" stroke="#2563eb" strokeWidth="2"/><path d="M7 11H13" stroke="#2563eb" strokeWidth="2"/></svg></span> Transactions</li>
            <li><span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#2563eb" strokeWidth="2"/><path d="M10 6V10L13 13" stroke="#2563eb" strokeWidth="2"/></svg></span> Dispute Resolution</li>
            <li><span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="10" rx="2" stroke="#2563eb" strokeWidth="2"/><rect x="7" y="3" width="6" height="4" rx="2" stroke="#2563eb" strokeWidth="2"/></svg></span> Business Management</li>
            <li><span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#2563eb" strokeWidth="2"/><path d="M10 6V10L13 13" stroke="#2563eb" strokeWidth="2"/></svg></span> Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="breadcrumb">Admin End &gt; Dashboard</div>
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

        {/* Overview and Escrow Row */}
        <div className="overview-escrow-row">
          <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
            <section className="overview-section" style={{flex: '0 0 340px'}}>
              <div className="overview-header">
                <span className="overview-dot"></span>
                <span className="overview-title">Overview</span>
              </div>
              <div className="overview-cards-flex">
                <div className="overview-card">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="#fff"/></svg>
                  </div>
                  <div className="overview-card-info">
                    <div className="overview-card-row">
                      <span className="overview-card-trend-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#2563eb" strokeWidth="2" fill="none"/></svg></span>
                      <span className="overview-card-trend-label">10% in the past month</span>
                    </div>
                    <div className="overview-card-label">Total Users</div>
                    <div className="overview-card-value">5,454</div>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 7.5l-9 6-9-6" stroke="#fff" strokeWidth="2"/><rect x="2" y="7" width="20" height="10" rx="2" fill="#fff" fillOpacity="0.1"/></svg>
                  </div>
                  <div className="overview-card-info">
                    <div className="overview-card-row">
                      <span className="overview-card-trend-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#2563eb" strokeWidth="2" fill="none"/></svg></span>
                      <span className="overview-card-trend-label">10% in the past month</span>
                    </div>
                    <div className="overview-card-label">Total Escrows</div>
                    <div className="overview-card-value">5,454</div>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="10" rx="2" fill="#fff"/></svg>
                  </div>
                  <div className="overview-card-info">
                    <div className="overview-card-label">Total Transaction</div>
                    <div className="overview-card-value">5,454</div>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="10" rx="2" fill="#fff"/><path d="M7 12h10" stroke="#2563eb" strokeWidth="2"/></svg>
                  </div>
                  <div className="overview-card-info">
                    <div className="overview-card-label">Pending Actions:</div>
                    <div className="overview-card-value">5,454</div>
                  </div>
                </div>
              </div>
            </section>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginLeft: '32px', gap: '24px', marginTop: '64px'}}>
              <div className="insight-card escrow-insight">
                <div className="insight-title">Escrow Insight <span className="insight-period">This month</span></div>
                <div className="donut-chart">
                  <svg width="100" height="100" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#e6e6e6" strokeWidth="6" />
                    <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#2563eb" strokeWidth="6" strokeDasharray="70 30" strokeDashoffset="25" />
                    <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="12" fill="#2563eb">70%</text>
                  </svg>
                  <div className="donut-legend">
                    <span className="dot approved"></span> Approved Escrow
                    <span className="dot pending"></span> Pending Escrow
                  </div>
                </div>
              </div>
              <div className="insight-card dispute-insight">
                <div className="insight-title">Dispute Resolution <span className="insight-period">Last 6 months</span></div>
                {/* ...add dispute card content here if needed... */}
              </div>
            </div>
          </div>
        </div>
        {/* Live Transactions Feed & User Overview */}
        <section className="feed-overview-section">
          <div className="feed-card">
            <div className="feed-title">Live Transactions Feed</div>
            <ul className="feed-list">
              <li><span className="feed-action">Escrow Created</span><span className="feed-time">1min ago</span><button>View</button></li>
              <li><span className="feed-action">Payment Released</span><span className="feed-time">5min ago</span><button>View</button></li>
              <li><span className="feed-action">Dispute Opened</span><span className="feed-time">10min ago</span><button>View</button></li>
              <li><span className="feed-action">Escrow Completed</span><span className="feed-time">15min ago</span><button>View</button></li>
              <li><span className="feed-action">Funds Deposited</span><span className="feed-time">20min ago</span><button>View</button></li>
            </ul>
          </div>
          <div className="overview-card">
            <div className="overview-title">User & Business Overview</div>
            <table className="overview-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Account type</th>
                  <th>KYC Status</th>
                  <th>Total Volume:</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>John Doe</td><td>Business Suite</td><td>Verified</td><td>$14,800</td><td>3 days ago</td></tr>
                <tr><td>Jane Smith</td><td>Premium Plan</td><td>Pending</td><td>$9,250</td><td>1 day ago</td></tr>
                <tr><td>Michael Brown</td><td>Basic Package</td><td>Verified</td><td>$4,100</td><td>5 days ago</td></tr>
                <tr><td>Emily Davis</td><td>Enterprise Solution</td><td>Declined</td><td>$22,500</td><td>2 weeks ago</td></tr>
                <tr><td>David Wilson</td><td>Starter Plan</td><td>Verified</td><td>$2,750</td><td>1 week ago</td></tr>
                <tr><td>Sarah Johnson</td><td>Business Suite</td><td>Pending</td><td>$15,600</td><td>3 days ago</td></tr>
              </tbody>
            </table>
          </div>
          <div className="kyc-card">
            <div className="kyc-title">KYC Verification</div>
            <ul className="kyc-list">
              <li><span className="kyc-user verified">John Doe</span><button>View</button></li>
              <li><span className="kyc-user pending">Jane Smith</span><button>Approve</button></li>
              <li><span className="kyc-user suspended">Alice Johnson</span><button>View</button></li>
              <li><span className="kyc-user verified">Bob Brown</span><button>View</button></li>
            </ul>
            <div className="alert-card">
              <div className="alert-title">Alert</div>
              <div className="alert-heading">Alert Heading</div>
              <div className="alert-subheading">Alert SubHeading</div>
              <button className="alert-action">Action</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
