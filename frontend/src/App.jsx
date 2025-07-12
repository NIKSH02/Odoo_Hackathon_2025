
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import Authentication from './pages/Authentication';
import Home from './pages/Home';
import Browse from './pages/Browse';
import About from './pages/About';
import AddItemForm from './pages/AddItemForm';
import ReWearUserDashboard from './pages/ReWearUserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route 
              path='/auth' 
              element={<Authentication />} 
            />
            <Route 
              path='/home' 
              element={<Home />} 
            />
            <Route 
              path='/browse' 
              element={<Browse />} 
            />
            <Route 
              path='/about' 
              element={<About />} 
            />
            <Route 
            path='/messages' 
            element={<Messages onLogout={handleLogout} />} 
          />
          <Route 
              path='/' 
              element={<Navigate to='/home' replace />}
            />
            <Route 
              path='/addItem'
              element={
                <ProtectedRoute requireProfileComplete={true}>
                  <AddItemForm />
                </ProtectedRoute>
              }
            />
            <Route 
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <ReWearUserDashboard /> 
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;