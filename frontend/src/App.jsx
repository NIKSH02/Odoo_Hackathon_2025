
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Authentication from './pages/Authentication';
import Home from './pages/Home';
import Browse from './pages/Browse';
import About from './pages/About';
import AddItemForm from './pages/AddItemForm';
import ReWearUserDashboard from './pages/RewearUserDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (check for token in localStorage)
    const token = localStorage.getItem('accesstoken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <>
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
            path='/browse' 
            element={<Browse onLogout={handleLogout} />} 
          />
          <Route 
            path='/about' 
            element={<About onLogout={handleLogout} />} 
          />
          <Route 
            path='/' 
            element={<Navigate to='/home' replace />}
          />
          <Route 
            path='/addItem'
            element={<AddItemForm />}
         />
          
          <Route 
          path='/dashboard'
          element={

            <ReWearUserDashboard /> 
          } />

        </Routes>
      </Router>
    </>
  );
}

export default App;