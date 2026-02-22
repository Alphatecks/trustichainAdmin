import React from 'react';
import './Layout.css';

const Layout = ({ children, activeMenu, onMenuClick }) => {
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/2c3b4d0b-1e9d-43b2-93e5-66abcac194ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Layout.js:7',message:'Layout rendered',data:{activeMenu},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={require('../../assets/images/logo.png')} alt="Logo" className="logo-img" />
          <span className="logo-text">TrustiChain</span>
        </div>
        <nav>
          <ul>
            <li 
              className={activeMenu === 'dashboard' ? 'active' : ''}
              onClick={() => onMenuClick && onMenuClick('dashboard')}
            >
              <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 9.5L10 3L17 9.5V17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17V9.5Z" stroke="#0671FF" strokeWidth="2"/></svg></span> Dashboard</li>
            <li 
              className={activeMenu === 'users' ? 'active' : ''}
              onClick={() => onMenuClick && onMenuClick('users')}
            >
              <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="4" stroke="#0671FF" strokeWidth="2"/><path d="M2 17C2 13.6863 5.13401 11 9 11H11C14.866 11 18 13.6863 18 17" stroke="#0671FF" strokeWidth="2"/></svg></span> Users Management</li>
            <li 
              className={activeMenu === 'escrow' ? 'active' : ''}
              onClick={() => onMenuClick && onMenuClick('escrow')}
            >
              <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="10" rx="2" stroke="#0671FF" strokeWidth="2"/><path d="M7 7V5C7 3.89543 7.89543 3 9 3H11C12.1046 3 13 3.89543 13 5V7" stroke="#0671FF" strokeWidth="2"/></svg></span> Escrow Management</li>
            <li
              className={activeMenu === 'transactions' ? 'active' : ''}
              onClick={() => onMenuClick && onMenuClick('transactions')}
            >
              <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="10" rx="2" stroke="#0671FF" strokeWidth="2"/><path d="M7 9H13" stroke="#0671FF" strokeWidth="2"/><path d="M7 11H13" stroke="#0671FF" strokeWidth="2"/></svg></span> Transactions</li>
            <li
              className={activeMenu === 'dispute' ? 'active' : ''}
              onClick={() => onMenuClick && onMenuClick('dispute')}
            >
              <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#0671FF" strokeWidth="2"/><path d="M10 6V10L13 13" stroke="#0671FF" strokeWidth="2"/></svg></span> Dispute Resolution</li>
            <li
              className={activeMenu === 'businessManagement' ? 'active' : ''}
              onClick={() => onMenuClick && onMenuClick('businessManagement')}
            >
              <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="10" rx="2" stroke="#0671FF" strokeWidth="2"/><rect x="7" y="3" width="6" height="4" rx="2" stroke="#0671FF" strokeWidth="2"/></svg></span> Business Management</li>
            <li
              className={activeMenu === 'cardManagement' ? 'active' : ''}
              onClick={() => onMenuClick && onMenuClick('cardManagement')}
            >
              <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="11" rx="2" stroke="#0671FF" strokeWidth="2"/><path d="M2 9h16" stroke="#0671FF" strokeWidth="2"/><rect x="5" y="12" width="4" height="2" rx="0.5" fill="#0671FF" opacity="0.5"/></svg></span> Card Management</li>
            <li
              className={activeMenu === 'settings' ? 'active' : ''}
              onClick={() => onMenuClick && onMenuClick('settings')}
            >
              <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#0671FF" strokeWidth="2"/><path d="M10 6V10L13 13" stroke="#0671FF" strokeWidth="2"/></svg></span> Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      {children}
    </div>
  );
};

export default Layout;
