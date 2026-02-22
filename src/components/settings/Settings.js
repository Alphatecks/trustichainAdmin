import React, { useState, useEffect } from 'react';
import Layout from '../shared/Layout';
import { sendPushNotification } from '../../services/notificationService';
import { fetchProfile, updateProfile, updateProfilePhoto, deleteProfilePhoto, fetchNotificationSettings, updateNotificationSettings } from '../../services/settingsService';
import './Settings.css';

const getInitials = (name) => {
  if (!name || !name.trim()) return '—';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const Settings = ({ onLogout, onMenuClick }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notificationsUpdateLoading, setNotificationsUpdateLoading] = useState(false);
  const [notificationsUpdateError, setNotificationsUpdateError] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState(null);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoUpdateLoading, setPhotoUpdateLoading] = useState(false);
  const [photoUpdateError, setPhotoUpdateError] = useState(null);

  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    let cancelled = false;
    setProfileError(null);
    fetchProfile()
      .then((res) => {
        if (cancelled || !res?.success || !res?.data) return;
        const d = res.data;
        setFullName(d.fullName ?? '');
        setEmail(d.email ?? '');
        setAvatarUrl(d.avatarUrl ?? '');
      })
      .catch((e) => { if (!cancelled) setProfileError(e.message || 'Failed to load profile'); })
      .finally(() => { if (!cancelled) setProfileLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchNotificationSettings()
      .then((res) => {
        if (cancelled || !res?.success || !res?.data) return;
        const d = res.data;
        setNotifyEmail(d.emailNotificationsEnabled !== false);
        setNotifyPush(d.pushNotificationsEnabled !== false);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [pushTarget, setPushTarget] = useState('all');
  const [pushUserId, setPushUserId] = useState('');
  const [pushSending, setPushSending] = useState(false);
  const [pushError, setPushError] = useState(null);
  const [pushSuccess, setPushSuccess] = useState(false);

  const handleUpdateProfile = async () => {
    setProfileUpdateError(null);
    setProfileUpdateSuccess(false);
    try {
      setProfileUpdateLoading(true);
      const res = await updateProfile({ fullName, email });
      if (res?.success && res?.data) {
        const d = res.data;
        setFullName(d.fullName ?? '');
        setEmail(d.email ?? '');
        setAvatarUrl(d.avatarUrl ?? '');
        setNotifyEmail(d.emailNotificationsEnabled !== false);
        setNotifyPush(d.pushNotificationsEnabled !== false);
        setProfileUpdateSuccess(true);
      }
    } catch (err) {
      setProfileUpdateError(err.message || 'Failed to update profile');
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  const handleUpdatePhoto = async () => {
    setPhotoUpdateError(null);
    try {
      setPhotoUpdateLoading(true);
      const res = await updateProfilePhoto({ avatarUrl: photoUrlInput.trim() || null });
      if (res?.success && res?.data) {
        setAvatarUrl(res.data.avatarUrl ?? '');
        setPhotoUrlInput('');
      }
    } catch (err) {
      setPhotoUpdateError(err.message || 'Failed to update photo');
    } finally {
      setPhotoUpdateLoading(false);
    }
  };

  const handleNotificationChange = async (type, checked) => {
    const prevEmail = notifyEmail;
    const prevPush = notifyPush;
    if (type === 'email') setNotifyEmail(checked);
    else setNotifyPush(checked);
    setNotificationsUpdateError(null);
    try {
      setNotificationsUpdateLoading(true);
      await updateNotificationSettings({
        emailNotifications: type === 'email' ? checked : prevEmail,
        pushNotifications: type === 'push' ? checked : prevPush,
      });
    } catch (err) {
      if (type === 'email') setNotifyEmail(prevEmail);
      else setNotifyPush(prevPush);
      setNotificationsUpdateError(err.message || 'Failed to update');
    } finally {
      setNotificationsUpdateLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoUpdateError(null);
    try {
      setPhotoUpdateLoading(true);
      const res = await deleteProfilePhoto();
      if (res?.success && res?.data) {
        setAvatarUrl(res.data.avatarUrl ?? '');
        setPhotoUrlInput('');
      }
    } catch (err) {
      setPhotoUpdateError(err.message || 'Failed to remove photo');
    } finally {
      setPhotoUpdateLoading(false);
    }
  };

  const handleSendPush = async () => {
    setPushError(null);
    setPushSuccess(false);
    try {
      setPushSending(true);
      await sendPushNotification({
        title: pushTitle,
        message: pushBody,
        sendTo: pushTarget,
        userId: pushTarget === 'user' ? pushUserId : undefined,
      });
      setPushSuccess(true);
      setPushTitle('');
      setPushBody('');
      setPushUserId('');
    } catch (err) {
      setPushError(err.message || 'Failed to send');
    } finally {
      setPushSending(false);
    }
  };

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
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="set-avatar set-avatar-img" />
            ) : (
              <span className="set-avatar">{profileLoading ? '…' : getInitials(fullName)}</span>
            )}
            <div className="set-profile-info">
              <span className="set-profile-name-row">
                <span className="set-profile-name">{profileLoading ? '…' : fullName || '—'}</span>
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
            {profileError && <div className="set-profile-error">{profileError}</div>}
            {profileUpdateError && <div className="set-profile-error">{profileUpdateError}</div>}
            {profileUpdateSuccess && <div className="set-profile-success">Profile updated.</div>}
            <div className="set-form-grid">
              <div className="set-field">
                <label className="set-label">Full name</label>
                <input
                  type="text"
                  className="set-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={profileLoading ? 'Loading…' : 'Full name'}
                />
              </div>
              <div className="set-field">
                <label className="set-label">Email address</label>
                <input
                  type="email"
                  className="set-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={profileLoading ? 'Loading…' : 'Email'}
                />
              </div>
              <div className="set-field set-field--avatar">
                <label className="set-label">Profile photo</label>
                <div className="set-avatar-upload">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="set-avatar-preview set-avatar-preview-img" />
                  ) : (
                    <span className="set-avatar-preview">{profileLoading ? '…' : getInitials(fullName)}</span>
                  )}
                  <div className="set-avatar-actions">
                    <input
                      type="url"
                      className="set-input set-photo-url-input"
                      placeholder="https://..."
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="set-btn set-btn--secondary"
                      disabled={photoUpdateLoading}
                      onClick={handleUpdatePhoto}
                    >
                      {photoUpdateLoading ? 'Updating…' : 'Update photo'}
                    </button>
                    <button
                      type="button"
                      className="set-btn set-btn--ghost"
                      disabled={photoUpdateLoading}
                      onClick={handleRemovePhoto}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {photoUpdateError && <div className="set-profile-error">{photoUpdateError}</div>}
              </div>
            </div>
            <button
              type="button"
              className="set-btn set-btn--primary set-btn--profile-save"
              disabled={profileLoading || profileUpdateLoading}
              onClick={handleUpdateProfile}
            >
              {profileUpdateLoading ? 'Updating…' : 'Update profile'}
            </button>
          </section>

          <section className="set-card">
            <div className="set-section-title">
              <span className="set-section-bar" />
              <span>Notifications</span>
            </div>
            {notificationsUpdateError && <div className="set-profile-error">{notificationsUpdateError}</div>}
            <div className="set-toggles">
              <div className="set-toggle-row">
                <div>
                  <div className="set-toggle-title">Email notifications</div>
                  <div className="set-toggle-desc">Receive email updates for disputes and account activity</div>
                </div>
                <label className="set-toggle">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    disabled={notificationsUpdateLoading}
                  />
                  <span className="set-toggle-slider" />
                </label>
              </div>
              <div className="set-toggle-row">
                <div>
                  <div className="set-toggle-title">Push notifications</div>
                  <div className="set-toggle-desc">Browser and in-app push notifications</div>
                </div>
                <label className="set-toggle">
                  <input
                    type="checkbox"
                    checked={notifyPush}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    disabled={notificationsUpdateLoading}
                  />
                  <span className="set-toggle-slider" />
                </label>
              </div>
            </div>
          </section>

          <section className="set-card set-card--wide">
            <div className="set-section-title">
              <span className="set-section-bar" />
              <span>Send push notification</span>
            </div>
            <p className="set-push-desc">Send a push notification to app users.</p>
            <div className="set-form-grid set-form-grid--push">
              <div className="set-field">
                <label className="set-label">Title</label>
                <input
                  type="text"
                  className="set-input"
                  placeholder="Notification title"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                />
              </div>
              <div className="set-field set-field--full">
                <label className="set-label">Message</label>
                <textarea
                  className="set-input set-textarea"
                  placeholder="Notification message"
                  rows={3}
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                />
              </div>
              <div className="set-field">
                <label className="set-label">Send to</label>
                <select className="set-select" value={pushTarget} onChange={(e) => setPushTarget(e.target.value)}>
                  <option value="all">All users</option>
                  <option value="user">Specific user</option>
                </select>
              </div>
              {pushTarget === 'user' && (
                <div className="set-field">
                  <label className="set-label">User ID</label>
                  <input
                    type="text"
                    className="set-input"
                    placeholder="User ID"
                    value={pushUserId}
                    onChange={(e) => setPushUserId(e.target.value)}
                  />
                </div>
              )}
            </div>
            {pushError && <p className="set-push-message set-push-message--error">{pushError}</p>}
            {pushSuccess && <p className="set-push-message set-push-message--success">Notification sent.</p>}
            <button
              type="button"
              className="set-btn set-btn--primary set-btn--push"
              disabled={pushSending || !pushTitle.trim() || !pushBody.trim() || (pushTarget === 'user' && !pushUserId.trim())}
              onClick={handleSendPush}
            >
              {pushSending ? 'Sending…' : 'Send push notification'}
            </button>
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

          <section className="set-card">
            <div className="set-section-title">
              <span className="set-section-bar" />
              <span>Account</span>
            </div>
            <button type="button" className="set-btn set-btn--logout" onClick={onLogout}>
              Log out
            </button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
