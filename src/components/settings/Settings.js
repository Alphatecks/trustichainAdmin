import React, { useState } from 'react';
import Layout from '../shared/Layout';
import './Settings.css';

const Settings = ({ onMenuClick }) => {
  const [email, setEmail] = useState('sarah.chen@example.com');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  return (
    <Layout activeMenu="settings" onMenuClick={onMenuClick}>
      <div className="set-page">
        <header className="set-header">
          <div className="set-breadcrumb">Admin End &gt; Settings</div>
          <div className="set-search">
            <svg className="set-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
          <div className="set-profile">
            <button type="button" className="set-notification-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C7.23858 2 5 4.23858 5 7V11C5 12.1046 4.10457 13 3 13H17C15.8954 13 15 12.1046 15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 15C7 16.1046 8.34315 17 10 17C11.6569 17 13 16.1046 13 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="set-notification-dot" />
            </button>
            <span className="set-avatar">SC</span>
            <div className="set-profile-info">
              <span className="set-profile-name-row">
                <span className="set-profile-name">Sarah Chen</span>
                <img src={require('../../assets/images/Frame.png')} alt="" className="set-verified-badge" />
              </span>
              <span className="set-profile-role">Freelancer</span>
            </div>
          </div>
        </header>

        <div className="set-content">
          <section className="set-card">
            <div className="set-section-title">
              <span className="set-section-bar" />
              <span>Profile</span>
            </div>
            <div className="set-form-grid">
              <div className="set-field">
                <label className="set-label">Full name</label>
                <input type="text" className="set-input" defaultValue="Sarah Chen" />
              </div>
              <div className="set-field">
                <label className="set-label">Email address</label>
                <input type="email" className="set-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="set-field set-field--avatar">
                <label className="set-label">Profile photo</label>
                <div className="set-avatar-upload">
                  <span className="set-avatar-preview">SC</span>
                  <div className="set-avatar-actions">
                    <button type="button" className="set-btn set-btn--secondary">Change</button>
                    <button type="button" className="set-btn set-btn--ghost">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="set-card">
            <div className="set-section-title">
              <span className="set-section-bar" />
              <span>Notifications</span>
            </div>
            <div className="set-toggles">
              <div className="set-toggle-row">
                <div>
                  <div className="set-toggle-title">Email notifications</div>
                  <div className="set-toggle-desc">Receive email updates for disputes and account activity</div>
                </div>
                <label className="set-toggle">
                  <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />
                  <span className="set-toggle-slider" />
                </label>
              </div>
              <div className="set-toggle-row">
                <div>
                  <div className="set-toggle-title">Push notifications</div>
                  <div className="set-toggle-desc">Browser and in-app push notifications</div>
                </div>
                <label className="set-toggle">
                  <input type="checkbox" checked={notifyPush} onChange={(e) => setNotifyPush(e.target.checked)} />
                  <span className="set-toggle-slider" />
                </label>
              </div>
            </div>
          </section>

          <section className="set-card">
            <div className="set-section-title">
              <span className="set-section-bar" />
              <span>Security</span>
            </div>
            <div className="set-toggles">
              <div className="set-toggle-row">
                <div>
                  <div className="set-toggle-title">Two-factor authentication</div>
                  <div className="set-toggle-desc">Add an extra layer of security to your account</div>
                </div>
                <label className="set-toggle">
                  <input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />
                  <span className="set-toggle-slider" />
                </label>
              </div>
            </div>
            <div className="set-form-grid set-form-grid--narrow">
              <div className="set-field">
                <label className="set-label">Current password</label>
                <input type="password" className="set-input" placeholder="••••••••" />
              </div>
              <div className="set-field">
                <label className="set-label">New password</label>
                <input type="password" className="set-input" placeholder="••••••••" />
              </div>
              <div className="set-field">
                <label className="set-label">Confirm new password</label>
                <input type="password" className="set-input" placeholder="••••••••" />
              </div>
            </div>
            <button type="button" className="set-btn set-btn--primary">Update password</button>
          </section>

          <section className="set-card">
            <div className="set-section-title">
              <span className="set-section-bar" />
              <span>Preferences</span>
            </div>
            <div className="set-form-grid">
              <div className="set-field">
                <label className="set-label">Language</label>
                <select className="set-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div className="set-field">
                <label className="set-label">Timezone</label>
                <select className="set-select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
