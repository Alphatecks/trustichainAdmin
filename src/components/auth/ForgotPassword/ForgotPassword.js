import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = ({ onBackToLogin, onEmailSent }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
      if (onEmailSent) {
        onEmailSent(email);
      }
    }, 1500);
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  if (isEmailSent) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <div className="forgot-password-card">
            <div className="forgot-password-header">
              <div className="forgot-password-logo">
                <img src={require('../../../assets/images/logo.png')} alt="TrustiChain Logo" className="forgot-password-logo-img" />
                <span className="forgot-password-logo-text">TrustiChain</span>
              </div>
              <div className="success-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="32" fill="#10B981" fillOpacity="0.1"/>
                  <path d="M32 20C25.3726 20 20 25.3726 20 32C20 38.6274 25.3726 44 32 44C38.6274 44 44 38.6274 44 32C44 25.3726 38.6274 20 32 20Z" fill="#10B981"/>
                  <path d="M28 32L31 35L36 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="forgot-password-title">Check Your Email</h1>
              <p className="forgot-password-subtitle">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="forgot-password-instructions">
                Please check your inbox and click on the link to reset your password. 
                If you don't see the email, check your spam folder.
              </p>
            </div>

            <div className="forgot-password-actions">
              <button 
                type="button" 
                className="forgot-password-button primary"
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>
              <button 
                type="button" 
                className="forgot-password-button secondary"
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
              >
                Resend Email
              </button>
            </div>

            <div className="forgot-password-footer">
              <p className="forgot-password-help">
                Didn't receive the email? Check your spam folder or{' '}
                <button type="button" className="link-button" onClick={() => setIsEmailSent(false)}>
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <div className="forgot-password-card">
            <div className="forgot-password-header">
              <div className="forgot-password-logo">
              <img src={require('../../../assets/images/logo.png')} alt="TrustiChain Logo" className="forgot-password-logo-img" />
              <span className="forgot-password-logo-text">TrustiChain</span>
            </div>
            <h1 className="forgot-password-title">Forgot Password?</h1>
            <p className="forgot-password-subtitle">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reset-email" className="form-label">
                <svg className="form-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 6.66667L10 11.6667L17.5 6.66667M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Email Address
              </label>
              <input
                type="email"
                id="reset-email"
                className="form-input"
                placeholder="admin@trustichain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <button type="submit" className="forgot-password-button primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="1.5s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="1.5s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3.33333 10H16.6667M16.6667 10L11.6667 5M16.6667 10L11.6667 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="forgot-password-footer">
            <button 
              type="button" 
              className="back-to-login-link"
              onClick={handleBackToLogin}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Login
            </button>
            <div className="security-badge">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 1.66667L3.33333 5V9.16667C3.33333 13.3333 6.25 17.0833 10 18.3333C13.75 17.0833 16.6667 13.3333 16.6667 9.16667V5L10 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Secure Password Reset</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
