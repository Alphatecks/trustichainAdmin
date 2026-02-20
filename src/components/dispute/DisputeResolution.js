import React, { useState } from 'react';
import Layout from '../shared/Layout';
import DisputeDetail from './DisputeDetail';
import './DisputeResolution.css';

const DisputeResolution = ({ onMenuClick }) => {
  const [filterAll, setFilterAll] = useState('All');
  const [selectedDispute, setSelectedDispute] = useState(null);

  const alerts = [
    { title: 'New Evidence Provided', desc: 'A new evidence was provided for Ds354T4534', time: '1min ago' },
    { title: 'Dispute Created', desc: 'A new dispute was created', time: '5min ago' },
    { title: 'Dispute Resolved', desc: 'Dispute Ds354T4533 has been resolved', time: '10min ago' },
    { title: 'New Comment Added', desc: 'A new comment was added to Ds354T4532', time: '15min ago' },
    { title: 'Evidence Rejected', desc: 'Evidence for Ds354T4531 was rejected', time: '20min ago' },
  ];

  const disputes = [
    { id: 'ESC-2354-2425', party1: 'John Doe', party2: 'May Lane', date: '11:30 5th Jul 25', status: 'In progress' },
    { id: 'ESC-2354-2426', party1: 'Jane Smith', party2: 'Oak Drive', date: '13:45 6th Jul 25', status: 'Completed' },
    { id: 'ESC-2354-2427', party1: 'Alice Johnson', party2: 'Pine Street', date: '09:00 7th Jul 25', status: 'Pending' },
    { id: 'ESC-2354-2428', party1: 'Bob Brown', party2: 'Maple Blvd', date: '12:15 8th Jul 25', status: 'In progress' },
    { id: 'ESC-2354-2429', party1: 'Charlie Davis', party2: 'Cedar Court', date: '10:30 9th Jul 25', status: 'Completed' },
    { id: 'ESC-2354-2430', party1: 'Diana Evans', party2: 'Birch Way', date: '14:00 10th Jul 25', status: 'Pending' },
    { id: 'ESC-2354-2431', party1: 'Ethan White', party2: 'Spruce Lane', date: '08:20 11th Jul 25', status: 'In progress' },
    { id: 'ESC-2354-2432', party1: 'Fiona Green', party2: 'Elm Drive', date: '16:45 12th Jul 25', status: 'Completed' },
    { id: 'ESC-2354-2433', party1: 'George Black', party2: 'Willow Way', date: '11:00 13th Jul 25', status: 'Pending' },
    { id: 'ESC-2354-2434', party1: 'Hannah Wilson', party2: 'Cherry St', date: '09:30 14th Jul 25', status: 'In progress' },
    { id: 'ESC-2354-2435', party1: 'Ian Taylor', party2: 'Hawthorn Rd', date: '15:15 15th Jul 25', status: 'Completed' },
  ];

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'in progress') return 'in-progress';
    if (s === 'completed') return 'completed';
    if (s === 'pending') return 'pending';
    return '';
  };

  if (selectedDispute) {
    return (
      <Layout activeMenu="dispute" onMenuClick={onMenuClick}>
        <div className="dr-page">
          <DisputeDetail dispute={selectedDispute} onBack={() => setSelectedDispute(null)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeMenu="dispute" onMenuClick={onMenuClick}>
      <div className="dr-page">
        <header className="dr-header">
          <div className="dr-breadcrumb">Admin End &gt; Dispute Resolution</div>
          <div className="dr-search">
            <svg className="dr-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
          <div className="dr-profile">
            <button type="button" className="dr-notification-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.23858 2 5 4.23858 5 7V11C5 12.1046 4.10457 13 3 13H17C15.8954 13 15 12.1046 15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 15C7 16.1046 8.34315 17 10 17C11.6569 17 13 16.1046 13 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="dr-notification-dot" />
            </button>
            <span className="dr-avatar">SC</span>
            <div className="dr-profile-info">
              <span className="dr-profile-name-row">
                <span className="dr-profile-name">Sarah Chen</span>
                <img src={require('../../assets/images/Frame.png')} alt="" className="dr-verified-badge" />
              </span>
              <span className="dr-profile-role">Freelancer</span>
            </div>
          </div>
        </header>

        <div className="dr-content">
          <div className="dr-left">
            <section className="dr-overview-card">
              <div className="dr-section-title">
                <span className="dr-section-bar" />
                <span>Overview</span>
              </div>
              <div className="dr-metrics-grid">
                <div className="dr-metric">
                  <div className="dr-metric-head">
                    <div className="dr-metric-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="dr-metric-trend">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                      <span>10% in the past month</span>
                    </div>
                  </div>
                  <div className="dr-metric-label">Total Dispute</div>
                  <div className="dr-metric-value">5,454</div>
                </div>
                <div className="dr-metric">
                  <div className="dr-metric-head">
                    <div className="dr-metric-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M23 7l-7 5 7 5V7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" stroke="#fff" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="dr-metric-trend">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 12l6 6L20 6" stroke="#0671FF" strokeWidth="2" fill="none"/></svg>
                      <span>10% in the past month</span>
                    </div>
                  </div>
                  <div className="dr-metric-label">Active Dispute</div>
                  <div className="dr-metric-value">5,454</div>
                </div>
                <div className="dr-metric">
                  <div className="dr-metric-head">
                    <div className="dr-metric-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="dr-metric-label">Resolved Dispute</div>
                  <div className="dr-metric-value">5,454</div>
                </div>
                <div className="dr-metric">
                  <div className="dr-metric-head">
                    <div className="dr-metric-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="dr-metric-label">Average Res Time</div>
                  <div className="dr-metric-value">3hr</div>
                </div>
              </div>
            </section>

            <section className="dr-alert-card">
              <div className="dr-section-title">
                <span className="dr-section-bar" />
                <span>Dispute Alert Level</span>
              </div>
              <ul className="dr-alert-list">
                {alerts.map((alert, index) => (
                  <li key={index} className="dr-alert-item">
                    <div className="dr-alert-content">
                      <div className="dr-alert-title">{alert.title}</div>
                      <div className="dr-alert-desc">{alert.desc}</div>
                    </div>
                    <div className="dr-alert-right">
                      <span className="dr-alert-time">{alert.time}</span>
                      <button type="button" className="dr-alert-btn">View</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="dr-right">
            <section className="dr-table-card">
              <div className="dr-table-header">
                <div className="dr-section-title">
                  <span className="dr-section-bar" />
                  <span>Dispute Overview</span>
                </div>
                <div className="dr-toolbar">
                  <div className="dr-table-search">
                    <svg className="dr-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input type="text" placeholder="Search" />
                  </div>
                  <select className="dr-filter-select" value={filterAll} onChange={(e) => setFilterAll(e.target.value)}>
                    <option>All</option>
                    <option>In progress</option>
                    <option>Completed</option>
                    <option>Pending</option>
                  </select>
                  <button type="button" className="dr-filter-btn" aria-label="Filter">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 5h14M5 10h10M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="3" cy="5" r="2" fill="currentColor"/>
                      <circle cx="10" cy="10" r="2" fill="currentColor"/>
                      <circle cx="7" cy="15" r="2" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="dr-table-wrap">
                <table className="dr-table">
                  <thead>
                    <tr>
                      <th>Dispute ID</th>
                      <th>Party 1</th>
                      <th>Party 2</th>
                      <th>Date created</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {disputes.map((row, index) => (
                      <tr
                        key={index}
                        onClick={() => setSelectedDispute({ ...row, caseId: row.id })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDispute({ ...row, caseId: row.id }); } }}
                      >
                        <td>
                          <div className="dr-id-cell">
                            <span className="dr-id-dot" />
                            <span>{row.id}</span>
                          </div>
                        </td>
                        <td>{row.party1}</td>
                        <td>{row.party2}</td>
                        <td>{row.date}</td>
                        <td><span className={`dr-status dr-status--${getStatusClass(row.status)}`}>{row.status}</span></td>
                        <td>
                          <button
                            type="button"
                            className="dr-view-btn"
                            aria-label="View"
                            onClick={(e) => { e.stopPropagation(); setSelectedDispute({ ...row, caseId: row.id }); }}
                          >
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
              <div className="dr-pagination">
                <button type="button" className="dr-page-btn" disabled aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button type="button" className="dr-page-num active">1</button>
                <button type="button" className="dr-page-num">2</button>
                <span className="dr-page-ellipsis">...</span>
                <button type="button" className="dr-page-num">9</button>
                <button type="button" className="dr-page-num">10</button>
                <button type="button" className="dr-page-btn" aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DisputeResolution;
