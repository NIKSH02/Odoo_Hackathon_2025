
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from './shared-theme/AppTheme';
import Authentication from './pages/Authentication';
import Home from './pages/Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated (check for token in localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <AppTheme>
        <CssBaseline />
        <div>Loading...</div>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path='/auth' 
            element={
              isAuthenticated ? 
              <Navigate to='/home' replace /> : 
              <Authentication onLogin={handleLogin} />
            } 
          />
          <Route 
            path='/home' 
            element={<Home onLogout={handleLogout} />} 
          />
          <Route 
            path='/' 
            element={<Navigate to='/home' replace />}
          />
        </Routes>
      </Router>
    </AppTheme>
  );
}

export default App;