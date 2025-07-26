import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom'; // Import Link

import LoginPage from './pages/Login'; // Assuming it's 'Login.jsx'
import HomePage from './pages/Home';
import RegisterPage from './pages/Register'; // Assuming it's 'Register.jsx' or renamed 'RegisterPage.jsx'

// Import Dashboard Pages
import VendorDashboardPage from './pages/VendorDashboardPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SupplierDashboardPage from './pages/SupplierDashboardPage'; // NEW: For supplier role

// Import other protected pages
import ProfilePage from './pages/ProfilePage'; // NEW: For user profile

// Import the ProtectedRoute component
import ProtectedRoute from './components/ProtectedRoute'; // Adjust path as needed

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} /> {/* Optional: alias for root */}

      {/* Protected Routes - Wrap common layouts or specific pages */}
      
      {/* User Profile - Accessible by any logged-in role */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'vendor', 'supplier', 'customer']} />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

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

      {/* Supplier Dashboard - Only accessible by 'supplier' role */}
      <Route element={<ProtectedRoute allowedRoles={['supplier']} />}>
        <Route path="/supplier-dashboard" element={<SupplierDashboardPage />} />
      </Route>
      
      {/* Optional: Unauthorized Page - Displayed when a user tries to access a route they don't have permission for */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center bg-red-100">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h1 className="text-3xl font-bold text-red-700 mb-4">Access Denied!</h1>
            <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
            {/* Use Link to navigate, not Navigate component if you want to render content */}
            <Link to="/" className="text-blue-600 hover:underline">Go to Home</Link>
          </div>
        </div>
      } />

      {/* Fallback for any unmatched routes - Redirects to home for unknown paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}