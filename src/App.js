import React, { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard';
import UserManagement from './components/users';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Check if user is already logged in (has token in localStorage)
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const handleMenuClick = (menu) => {
    if (menu === 'dashboard') {
      setCurrentPage('dashboard');
    } else if (menu === 'users') {
      setCurrentPage('users');
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'users') {
    return <UserManagement onLogout={handleLogout} onMenuClick={handleMenuClick} />;
  }

  return <Dashboard onLogout={handleLogout} onMenuClick={handleMenuClick} />;
}

export default App;
