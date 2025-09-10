import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sites from './components/Sites';
import Leads from './components/Leads';
import Tasks from './components/Tasks';
import Financial from './components/Financial';
import Settings from './components/Settings';
import Backlinks from './components/Backlinks';
import SEO from './components/SEO';
import Automation from './components/Automation';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
      />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/sites" element={
        <ProtectedRoute>
          <Layout>
            <Sites />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/leads" element={
        <ProtectedRoute>
          <Layout>
            <Leads />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Layout>
            <Tasks />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/financial" element={
        <ProtectedRoute>
          <Layout>
            <Financial />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/backlinks" element={
        <ProtectedRoute>
          <Layout>
            <Backlinks />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/seo" element={
        <ProtectedRoute>
          <Layout>
            <SEO />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/automation" element={
        <ProtectedRoute>
          <Layout>
            <Automation />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router basename="/company-hub">
        <div className="company-hub-app">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;