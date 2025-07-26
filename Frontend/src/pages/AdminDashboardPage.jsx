import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const AdminDashboardPage = () => {
  const { user, loading } = useAuth(); // Get user and loading state from context
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if loading is complete and user is not authenticated
    if (!loading && (!user || user.role !== 'admin')) {
      // If user is not logged in OR is logged in but not an admin, redirect
      console.log("Redirecting from Admin Dashboard: User not admin or not logged in.");
      navigate('/login'); // Or a specific unauthorized page
    }
  }, [user, loading, navigate]); // Depend on user, loading, and navigate

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  // Only render if user exists and is an admin
  if (user && user.role === 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">Admin Dashboard</h1>
          <p className="text-lg text-gray-800 mb-6">Welcome, <span className="font-semibold">{user.name}</span>!</p>
          <p className="text-md text-gray-600">You are logged in as an <span className="font-semibold text-blue-600">{user.role}</span>.</p>
          <div className="mt-8 space-y-4">
            {/* Add admin-specific content and links here */}
            <p className="text-gray-700">Manage users, view system analytics, and configure settings.</p>
            {/* Example link */}
            <button 
              onClick={() => alert("Manage Users Clicked!")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Manage Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not loading and not authorized, nothing is rendered here as user is redirected by useEffect
  return null;
};

export default AdminDashboardPage;