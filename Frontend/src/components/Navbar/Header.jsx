// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // For the mobile menu icons
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook to access global auth state

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State to control mobile menu visibility
  const { user, logout } = useAuth(); // Get the current user object and logout function from AuthContext
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle user logout
  const handleLogout = async () => {
    // Call the logout function from AuthContext, which also clears backend session
    await logout(); 
    navigate('/login'); // Redirect to login page after successful logout
    setIsOpen(false); // Close mobile menu if open
  };

  // Helper function to render the appropriate dashboard link based on user role
  const renderDashboardLink = () => {
    if (!user) return null; // If no user is logged in, don't render any dashboard link

    // Use a switch statement for clear and scalable role-based dashboard links
    switch (user.role) {
      case 'vendor':
        return <Link to="/vendor-dashboard" className="text-gray-700 hover:text-indigo-600">Vendor Dashboard</Link>;
      case 'customer': // Aligned with backend User model roles: 'customer'
        return <Link to="/customer-dashboard" className="text-gray-700 hover:text-indigo-600">Customer Dashboard</Link>;
      case 'admin':
        return <Link to="/admin-dashboard" className="text-gray-700 hover:text-indigo-600">Admin Dashboard</Link>;
      default:
        return null; // Handle any other roles or no matching role
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Site Title */}
          <Link to="/" className="text-xl font-bold text-indigo-600">
            StreetEats
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-gray-700 hover:text-indigo-600">Home</Link>
            
            {/* Conditional Links based on Authentication Status */}
            {user ? (
              // If user is logged in
              <>
                {renderDashboardLink()} {/* Render role-specific dashboard link */}
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              // If user is NOT logged in
              <>
                <Link to="/register" className="text-gray-700 hover:text-indigo-600">Register</Link>
                <Link to="/login" className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200">Login</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content (conditionally rendered) */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-white space-y-2">
          <Link to="/home" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={() => setIsOpen(false)}>Home</Link>

          {user ? (
            // If user is logged in (Mobile View)
            <>
              {/* Role-specific dashboard links for mobile */}
              {user.role === 'vendor' && <Link to="/vendor-dashboard" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={() => setIsOpen(false)}>Vendor Dashboard</Link>}
              {user.role === 'customer' && <Link to="/customer-dashboard" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={() => setIsOpen(false)}>Customer Dashboard</Link>}
              {user.role === 'admin' && <Link to="/admin-dashboard" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>}
              
              <button 
                onClick={handleLogout} 
                className="block w-full px-4 py-2 bg-red-500 text-white rounded-md text-center hover:bg-red-600 transition duration-200 mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            // If user is NOT logged in (Mobile View)
            <>
              <Link to="/register" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={() => setIsOpen(false)}>Register</Link>
              <Link to="/login" className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-center hover:bg-indigo-700 transition duration-200 mt-2" onClick={() => setIsOpen(false)}>Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}