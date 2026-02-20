import React, { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard';
import UserManagement from './components/users';
import UserDetail from './components/users/UserDetail';
import EscrowManagement from './components/escrow';
import Transactions from './components/transactions';
import DisputeResolution from './components/dispute';
import Settings from './components/settings';
import { authService } from './services/authService';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);

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
      setSelectedUser(null);
    } else if (menu === 'escrow') {
      setCurrentPage('escrow');
      setSelectedUser(null);
    } else if (menu === 'transactions') {
      setCurrentPage('transactions');
      setSelectedUser(null);
    } else if (menu === 'dispute') {
      setCurrentPage('dispute');
      setSelectedUser(null);
    } else if (menu === 'settings') {
      setCurrentPage('settings');
      setSelectedUser(null);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setCurrentPage('userDetail');
  };

  const handleBackToUsers = () => {
    setCurrentPage('users');
    setSelectedUser(null);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'userDetail') {
    return <UserDetail user={selectedUser} onBack={handleBackToUsers} onMenuClick={handleMenuClick} />;
  }

  if (currentPage === 'users') {
    return <UserManagement onLogout={handleLogout} onMenuClick={handleMenuClick} onUserClick={handleUserClick} />;
  }

  if (currentPage === 'escrow') {
    return <EscrowManagement onLogout={handleLogout} onMenuClick={handleMenuClick} />;
  }

  if (currentPage === 'transactions') {
    return <Transactions onMenuClick={handleMenuClick} />;
  }

  if (currentPage === 'dispute') {
    return <DisputeResolution onMenuClick={handleMenuClick} />;
  }

  if (currentPage === 'settings') {
    return <Settings onMenuClick={handleMenuClick} />;
  }

  return <Dashboard onLogout={handleLogout} onMenuClick={handleMenuClick} />;
}

export default App;
