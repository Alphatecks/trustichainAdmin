import React from 'react';
import Layout from '../shared/Layout';
import './EscrowManagement.css';

const EscrowManagement = ({ onMenuClick }) => {
  const escrowData = [
    { id: 'ESC-2354-2425', party1: 'John Doe', party2: 'May Lane', date: '11:30 5th Jul 25', status: 'In progress' },
    { id: 'ESC-2354-2426', party1: 'Jane Smith', party2: 'Oak Street', date: '09:15 6th Jul 25', status: 'Completed' },
    { id: 'ESC-2354-2427', party1: 'Alice Johnson', party2: 'Pine Avenue', date: '14:45 6th Jul 25', status: 'In Progress' },
    { id: 'ESC-2354-2428', party1: 'Bob Brown', party2: 'Maple Boulevard', date: '12:00 7th Jul 25', status: 'Cancelled' },
    { id: 'ESC-2354-2429', party1: 'Charlie White', party2: 'Cedar Court', date: '10:30 7th Jul 25', status: 'Disputed' },
    { id: 'ESC-2354-2430', party1: 'Diana Green', party2: 'Birch Way', date: '16:00 8th Jul 25', status: 'Completed' },
    { id: 'ESC-2354-2431', party1: 'Edward Black', party2: 'Spruce Lane', date: '08:20 8th Jul 25', status: 'In Progress' },
    { id: 'ESC-2354-2432', party1: 'Fiona Gray', party2: 'Elm Drive', date: '13:15 9th Jul 25', status: 'Pending' },
    { id: 'ESC-2354-2433', party1: 'George Blue', party2: 'Willow Way', date: '15:50 9th Jul 25', status: 'Completed' },
    { id: 'ESC-2354-2434', party1: 'Hannah Red', party2: 'Cherry Street', date: '11:00 10th Jul 25', status: 'Cancelled' },
    { id: 'ESC-2354-2435', party1: 'Ian Yellow', party2: 'Hawthorn Path', date: '17:30 10th Jul 25', status: 'In Progress' }
  ];

  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') {
      return 'status-completed';
    } else if (statusLower === 'in progress' || statusLower === 'in progress') {
      return 'status-in-progress';
    } else if (statusLower === 'cancelled') {
      return 'status-cancelled';
    } else if (statusLower === 'disputed') {
      return 'status-disputed';
    } else if (statusLower === 'pending') {
      return 'status-pending';
    }
    return '';
  };

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
            <span className="avatar">SC</span>
            <div className="profile-info">
              <span className="profile-name-row">
                <span className="name">Sarah Chen</span>
                <img src={require('../../assets/images/Frame.png')} alt="" className="verified-badge" />
              </span>
              <span className="role">Freelancer</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="escrow-content">
          {/* Left Panel - Overview Statistics */}
          <div className="overview-panel">
            <div className="overview-cards-grid">
              <div className="overview-card">
                <div className="overview-card-head">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#fff"/>
                    </svg>
                  </div>
                  <div className="overview-card-row">
                    <span className="overview-card-trend-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/>
                      </svg>
                    </span>
                    <span className="overview-card-trend-label">10% in the past month</span>
                  </div>
                </div>
                <div className="overview-card-label">Total Amount</div>
                <div className="overview-card-value">5,454</div>
              </div>

              <div className="overview-card">
                <div className="overview-card-head">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" fill="#fff"/>
                    </svg>
                  </div>
                  <div className="overview-card-row">
                    <span className="overview-card-trend-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/>
                      </svg>
                    </span>
                    <span className="overview-card-trend-label">10% in the past month</span>
                  </div>
                </div>
                <div className="overview-card-label">Total Escrow transaction</div>
                <div className="overview-card-value">5,454</div>
              </div>

              <div className="overview-card">
                <div className="overview-card-head">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff"/>
                    </svg>
                  </div>
                </div>
                <div className="overview-card-label">Completed Escrow</div>
                <div className="overview-card-value">5,454</div>
              </div>

              <div className="overview-card">
                <div className="overview-card-head">
                  <div className="overview-card-icon-bg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fff"/>
                      <path d="M12 8v4M12 16h.01" stroke="#0671FF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                <div className="overview-card-label">Disputed Escrow</div>
                <div className="overview-card-value">5,454</div>
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
                  {escrowData.map((escrow, index) => (
                    <tr key={index}>
                      <td>
                        <div className="escrow-id-cell">
                          <span className="escrow-dot"></span>
                          {escrow.id}
                        </div>
                      </td>
                      <td>{escrow.party1}</td>
                      <td>{escrow.party2}</td>
                      <td>{escrow.date}</td>
                      <td>
                        <div className="status-cell">
                          <span className={`escrow-status ${getStatusClass(escrow.status)}`}>
                            {escrow.status}
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
    </Layout>
  );
};

export default EscrowManagement;
