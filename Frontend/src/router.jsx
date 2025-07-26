// src/router.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import LoginPage from './pages/Login'; // Assuming it's 'Login.jsx'
import HomePage from './pages/Home';
import RegisterPage from './pages/Register'; // Renamed to RegisterPage for consistency

// Import Dashboard Pages
import VendorDashboardPage from './pages/VendorDashboardPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Import the ProtectedRoute component
import ProtectedRoute from './components/ProtectedRoute'; // Adjust path as needed
// Also ensure your AuthProvider wraps your router (e.g., in main.jsx)

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> {/* Use RegisterPage for consistency */}
      <Route path="/" element={<HomePage />} />
      
      {/* Vendor Dashboard - Only accessible by 'vendor' role */}
      <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
        <Route path="/vendor-dashboard" element={<VendorDashboardPage />} />
      </Route>

      {/* Customer Dashboard - Only accessible by 'customer' role */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/customer-dashboard" element={<CustomerDashboardPage />} />
      </Route>

      {/* Admin Dashboard - Only accessible by 'admin' role */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
      </Route>
      
      {/* Optional: Unauthorized Page */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center bg-red-100">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h1 className="text-3xl font-bold text-red-700 mb-4">Access Denied!</h1>
            <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
            <Navigate to="/" className="text-blue-600 hover:underline">Go to Home</Navigate>
          </div>
        </div>
      } />

      {/* Fallback for any unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirects to home for unknown paths */}
    </Routes>
  );
}