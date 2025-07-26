// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Access your global authentication state

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth(); // 1. Get user and loading state from AuthContext

  // 2. Handle Loading State
  if (loading) {
    // While the authentication status is being determined (e.g., checking localStorage)
    // You can show a loading spinner or a simple "Loading..." message.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  // 3. Check Authentication and Authorization
  // If user is logged in (user object exists)
  // AND (if allowedRoles is empty, meaning any logged-in user can access)
  // OR (if allowedRoles is not empty AND the user's role is in the allowedRoles array)
  if (user && (allowedRoles.length === 0 || allowedRoles.includes(user.role))) {
    return <Outlet />; // 4. If authorized, render the child component (the actual protected page)
  }

  // 5. Handle Unauthorized Scenarios

  // If user is NOT logged in (no user object)
  if (!user) {
    // Redirect to the login page. `replace` ensures they can't go back to the protected page with the browser back button.
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but their role is NOT in the allowedRoles array
  // Redirect to an "unauthorized" page to inform them they don't have permission.
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;