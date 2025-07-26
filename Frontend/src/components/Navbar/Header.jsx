import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, Home, UserPlus, LogIn } from 'lucide-react'; // Import necessary icons
import { useAuth } from '../../context/AuthContext'; // Assuming this path is correct for your project structure

/**
 * Navbar Component
 *
 * This component provides the main navigation for the application.
 * It dynamically displays links based on the user's authentication status
 * and role, including a mobile-responsive menu.
 */
export default function Navbar() {
  // State to control the visibility of the mobile navigation menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Destructure user object and logout function from the AuthContext
  const { user, logout } = useAuth();

  // Hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handles the user logout process.
   * Calls the logout function from AuthContext and redirects to the login page.
   */
  const handleLogout = async () => {
    try {
      await logout(); // Perform logout operation
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, display an error message to the user
    } finally {
      setIsMobileMenuOpen(false); // Always close the mobile menu after logout attempt
    }
  };

  /**
   * Renders the appropriate dashboard link based on the user's role.
   * Returns null if no user is logged in or the role doesn't match.
   */
  const renderDashboardLink = () => {
    if (!user) return null; // No user, no dashboard link

    // Use a switch statement for clear and extensible role-based routing
    switch (user.role) {
      case 'vendor':
        return (
          <Link
            to="/vendor-dashboard"
            className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
          >
            Vendor Dashboard
          </Link>
        );
      case 'customer':
        return (
          <Link
            to="/customer-dashboard"
            className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
          >
            Customer Dashboard
          </Link>
        );
      case 'admin':
        return (
          <Link
            to="/admin-dashboard"
            className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
          >
            Admin Dashboard
          </Link>
        );
      default:
        return null; // For any other roles or undefined roles
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Site Title */}
          <Link to="/" className="text-2xl font-extrabold text-indigo-700 hover:text-indigo-800 transition duration-200 ease-in-out">
            StreetEats
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-7">
            <Link
              to="/home"
              className="text-gray-700 hover:text-indigo-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md py-1 px-2"
            >
              Home
            </Link>

            {user ? (
              // If user is logged in: Show user's name, profile link, dashboard link, and logout button
              <>
                <span className="text-gray-800 font-medium px-2 py-1">Hello, {user.name}!</span>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-indigo-600 flex items-center space-x-1 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md py-1 px-2"
                >
                  <UserIcon size={18} />
                  <span>Profile</span>
                </Link>
                {renderDashboardLink()} {/* Render role-specific dashboard link */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              // If user is NOT logged in: Show Register and Login links
              <>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-indigo-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md py-1 px-2"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen ? "true" : "false"}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content (conditionally rendered with transition) */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 bg-white space-y-3 border-t border-gray-200 pt-4">
          <Link
            to="/home"
            className="flex items-center space-x-2 block text-gray-700 hover:text-indigo-600 py-2 rounded-md px-3 hover:bg-gray-50 transition duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          {user ? (
            // If user is logged in (Mobile View)
            <>
              <span className="block text-gray-800 font-semibold py-2 px-3">Hello, {user.name}!</span>
              <Link
                to="/profile"
                className="flex items-center space-x-2 block text-gray-700 hover:text-indigo-600 py-2 rounded-md px-3 hover:bg-gray-50 transition duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserIcon size={18} />
                <span>Profile</span>
              </Link>
              {/* Role-specific dashboard links for mobile */}
              {user.role === 'vendor' && (
                <Link
                  to="/vendor-dashboard"
                  className="block text-gray-700 hover:text-indigo-600 py-2 rounded-md px-3 hover:bg-gray-50 transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Vendor Dashboard
                </Link>
              )}
              {user.role === 'customer' && (
                <Link
                  to="/customer-dashboard"
                  className="block text-gray-700 hover:text-indigo-600 py-2 rounded-md px-3 hover:bg-gray-50 transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Customer Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin-dashboard"
                  className="block text-gray-700 hover:text-indigo-600 py-2 rounded-md px-3 hover:bg-gray-50 transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow-md text-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 mt-2"
                aria-label="Logout"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            // If user is NOT logged in (Mobile View)
            <>
              <Link
                to="/register"
                className="flex items-center space-x-2 block text-gray-700 hover:text-indigo-600 py-2 rounded-md px-3 hover:bg-gray-50 transition duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserPlus size={18} />
                <span>Register</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center space-x-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md text-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
