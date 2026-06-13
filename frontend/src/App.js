import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import SubmitEventPage from './pages/SubmitEventPage';
import MyEventsPage from './pages/MyEventsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return admin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes with Navbar */}
          <Route path="/" element={<><Navbar /><HomePage /></>} />
          <Route path="/events/:id" element={<><Navbar /><EventDetailPage /></>} />
          <Route path="/submit" element={<><Navbar /><SubmitEventPage /></>} />
          <Route path="/my-events" element={<><Navbar /><MyEventsPage /></>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute><AdminDashboardPage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
