import React, { useState } from 'react';
import './Login.css';
import ForgotPassword from '../ForgotPassword';
import { authService } from '../../../services/authService';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);
      // Support common response shapes: token at top level or under data
      const token = data.token ?? data.data?.token ?? data.accessToken ?? data.access_token
        ?? data.data?.accessToken ?? data.data?.access_token;
      const admin = data.admin ?? data.data?.admin ?? data.user ?? data.data?.user;
      if (!token) {
        throw new Error('Login succeeded but no token was received. Please contact support.');
      }
      authService.storeAuthData(token, admin);

      // Handle successful login - notify parent component
      console.log('Login successful:', data);
      if (onLoginSuccess) {
        onLoginSuccess();
      }

    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword 
        onBackToLogin={() => setShowForgotPassword(false)}
        onEmailSent={(email) => console.log('Reset email sent to:', email)}
      />
    );
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <img src={require('../../../assets/images/logo.png')} alt="TrustiChain Logo" className="login-logo-img" />
              <span className="login-logo-text">TrustiChain</span>
            </div>
            <h1 className="login-title">Admin Portal</h1>
            <p className="login-subtitle">Secure access to your blockchain escrow platform</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 6.66667L10 11.6667L17.5 6.66667M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="admin@trustichain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83333 9.16667V5.83333C5.83333 4.72876 6.27232 3.66895 7.05372 2.88755C7.83512 2.10615 8.89493 1.66667 9.99999 1.66667C11.1051 1.66667 12.1649 2.10615 12.9463 2.88755C13.7277 3.66895 14.1667 4.72876 14.1667 5.83333V9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2.5 2.5L17.5 17.5M8.33333 8.33333C7.89131 8.77535 7.5 9.44102 7.5 10.4167C7.5 12.2576 8.99238 13.75 10.8333 13.75C11.809 13.75 12.4747 13.3587 12.9167 12.9167M5.41667 5.41667C4.33333 6.25 2.91667 7.91667 1.66667 10.4167C3.75 14.5833 7.08333 17.5 10.8333 17.5C12.0833 17.5 13.3333 17.0833 14.5833 16.25M12.9167 12.9167L14.5833 14.5833M12.9167 12.9167L5.41667 5.41667M14.5833 14.5833L17.5 17.5M14.5833 14.5833C15.6667 13.75 17.0833 12.0833 18.3333 9.58333C16.25 5.41667 12.9167 2.5 9.16667 2.5C7.91667 2.5 6.66667 2.91667 5.41667 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M1.66667 10.4167C3.75 14.5833 7.08333 17.5 10.8333 17.5C14.5833 17.5 17.9167 14.5833 20 10.4167C17.9167 6.25 14.5833 3.33333 10.8333 3.33333C7.08333 3.33333 3.75 6.25 1.66667 10.4167Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.8333 13.75C12.6743 13.75 14.1667 12.2576 14.1667 10.4167C14.1667 8.57576 12.6743 7.08333 10.8333 7.08333C8.99238 7.08333 7.5 8.57576 7.5 10.4167C7.5 12.2576 8.99238 13.75 10.8333 13.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox-input" />
                <span className="checkbox-text">Remember me</span>
              </label>
              <button 
                type="button"
                className="forgot-password"
                onClick={() => {
                  setShowForgotPassword(true);
                }}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="1.5s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="1.5s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="security-badge">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 1.66667L3.33333 5V9.16667C3.33333 13.3333 6.25 17.0833 10 18.3333C13.75 17.0833 16.6667 13.3333 16.6667 9.16667V5L10 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>256-bit SSL Encryption</span>
            </div>
            <p className="login-help">Need help? Contact <a href="mailto:support@trustichain.com">support@trustichain.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
