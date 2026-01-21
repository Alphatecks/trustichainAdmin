import React from 'react';
import Layout from '../shared/Layout';
import './Dashboard.css';

const Dashboard = ({ onLogout, onMenuClick }) => {
  return (
    <Layout activeMenu="dashboard" onMenuClick={onMenuClick}>
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
          <section className="overview-section">
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

          <div className="insights-group">
          <div className="insight-card escrow-insight">
            <div className="insight-header">
              <div className="insight-title-wrapper">
                <span className="insight-dot"></span>
                <span className="insight-title">Escrow Insight</span>
              </div>
              <select className="insight-period-dropdown">
                <option>This month</option>
                <option>Last month</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="donut-chart">
              <svg width="120" height="120" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#e0e7ff" strokeWidth="6" />
                <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#2563eb" strokeWidth="6" strokeDasharray="70 30" strokeDashoffset="25" />
                <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="10" fontWeight="700" fill="#2563eb">70%</text>
              </svg>
              <div className="donut-legend">
                <div className="legend-item">
                  <span className="dot approved"></span>
                  <span>Approved Escrow</span>
                </div>
                <div className="legend-item">
                  <span className="dot pending"></span>
                  <span>Pending Escrow</span>
                </div>
              </div>
            </div>
          </div>

          <div className="insight-card dispute-insight">
            <div className="insight-header">
              <div className="insight-title-wrapper">
                <span className="insight-dot"></span>
                <span className="insight-title">Dispute Resolution</span>
              </div>
              <button className="insight-period-button">Last 6 months</button>
            </div>
            <div className="dispute-metric">
              <div className="dispute-metric-label">Total Dispute Resolved</div>
              <div className="dispute-metric-value">5,454</div>
            </div>
            <div className="bar-chart-container">
              <div className="bar-chart">
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '100%'}}></div>
                <div className="bar" style={{height: '75%'}}></div>
                <div className="bar" style={{height: '40%'}}></div>
                <div className="bar" style={{height: '95%'}}></div>
                <div className="bar" style={{height: '80%'}}></div>
              </div>
              <div className="bar-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
          </div>
        </div>
        {/* Live Transactions Feed & User Overview */}
        <section className="feed-overview-section">
          <div className="feed-card">
            <div className="section-header">
              <span className="section-dot"></span>
              <span className="feed-title">Live Transactions Feed</span>
            </div>
            <ul className="feed-list">
              <li className="feed-item">
                <div className="feed-item-content">
                  <div className="feed-action">Escrow Created</div>
                  <div className="feed-description">John doe created an escrow wallet for Sarah landi</div>
                </div>
                <div className="feed-item-right">
                  <span className="feed-time">1min ago</span>
                  <button className="feed-view-btn">View</button>
                </div>
              </li>
              <li className="feed-item">
                <div className="feed-item-content">
                  <div className="feed-action">Payment Released</div>
                  <div className="feed-description">Payment has been released successfully</div>
                </div>
                <div className="feed-item-right">
                  <span className="feed-time">5min ago</span>
                  <button className="feed-view-btn">View</button>
                </div>
              </li>
              <li className="feed-item">
                <div className="feed-item-content">
                  <div className="feed-action">Dispute Opened</div>
                  <div className="feed-description">A new dispute has been opened</div>
                </div>
                <div className="feed-item-right">
                  <span className="feed-time">10min ago</span>
                  <button className="feed-view-btn">View</button>
                </div>
              </li>
              <li className="feed-item">
                <div className="feed-item-content">
                  <div className="feed-action">Escrow Completed</div>
                  <div className="feed-description">Escrow transaction has been completed</div>
                </div>
                <div className="feed-item-right">
                  <span className="feed-time">15min ago</span>
                  <button className="feed-view-btn">View</button>
                </div>
              </li>
              <li className="feed-item">
                <div className="feed-item-content">
                  <div className="feed-action">Funds Deposited</div>
                  <div className="feed-description">Funds have been deposited into escrow</div>
                </div>
                <div className="feed-item-right">
                  <span className="feed-time">20min ago</span>
                  <button className="feed-view-btn">View</button>
                </div>
              </li>
            </ul>
          </div>
          <div className="overview-card">
            <div className="section-header">
              <span className="section-dot"></span>
              <span className="overview-title">User & Business Overview</span>
            </div>
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
                <tr>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"></div>
                      <span>John Doe</span>
                    </div>
                  </td>
                  <td>Business Suite</td>
                  <td><span className="kyc-status verified">Verified</span></td>
                  <td>$14,800</td>
                  <td>3 days ago</td>
                </tr>
                <tr>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"></div>
                      <span>Jane Smith</span>
                    </div>
                  </td>
                  <td>Premium Plan</td>
                  <td><span className="kyc-status pending">Pending</span></td>
                  <td>$9,250</td>
                  <td>1 day ago</td>
                </tr>
                <tr>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"></div>
                      <span>Michael Brown</span>
                    </div>
                  </td>
                  <td>Basic Package</td>
                  <td><span className="kyc-status verified">Verified</span></td>
                  <td>$4,100</td>
                  <td>5 days ago</td>
                </tr>
                <tr>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"></div>
                      <span>Emily Davis</span>
                    </div>
                  </td>
                  <td>Enterprise Solution</td>
                  <td><span className="kyc-status declined">Declined</span></td>
                  <td>$22,500</td>
                  <td>2 weeks ago</td>
                </tr>
                <tr>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"></div>
                      <span>David Wilson</span>
                    </div>
                  </td>
                  <td>Starter Plan</td>
                  <td><span className="kyc-status verified">Verified</span></td>
                  <td>$2,750</td>
                  <td>1 week ago</td>
                </tr>
                <tr>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar"></div>
                      <span>Sarah Johnson</span>
                    </div>
                  </td>
                  <td>Business Suite</td>
                  <td><span className="kyc-status pending">Pending</span></td>
                  <td>$15,600</td>
                  <td>3 days ago</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="kyc-alert-column">
            <div className="kyc-card">
              <div className="section-header">
                <span className="section-dot"></span>
                <span className="kyc-title">KYC Verification</span>
              </div>
              <ul className="kyc-list">
                <li className="kyc-item">
                  <div className="user-avatar"></div>
                  <div className="kyc-item-info">
                    <span className="kyc-user-name">John Doe</span>
                    <span className="kyc-status verified">Verified</span>
                  </div>
                  <button className="kyc-action-btn">View</button>
                </li>
                <li className="kyc-item">
                  <div className="user-avatar"></div>
                  <div className="kyc-item-info">
                    <span className="kyc-user-name">Jane Smith</span>
                    <span className="kyc-status pending">Pending</span>
                  </div>
                  <button className="kyc-action-btn">Approve</button>
                </li>
                <li className="kyc-item">
                  <div className="user-avatar"></div>
                  <div className="kyc-item-info">
                    <span className="kyc-user-name">Alice Johnson</span>
                    <span className="kyc-status suspended">Suspended</span>
                  </div>
                  <button className="kyc-action-btn">View</button>
                </li>
                <li className="kyc-item">
                  <div className="user-avatar"></div>
                  <div className="kyc-item-info">
                    <span className="kyc-user-name">Bob Brown</span>
                    <span className="kyc-status verified">Verified</span>
                  </div>
                  <button className="kyc-action-btn">View</button>
                </li>
              </ul>
            </div>
            <div className="alert-card">
              <div className="section-header">
                <span className="section-dot"></span>
                <span className="alert-title">Alert</span>
              </div>
              <div className="alert-content">
                <div className="alert-heading">Alert Heading</div>
                <div className="alert-subheading">Alert SubHeading</div>
                <button className="alert-action-btn">Action</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Dashboard;
