import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // Get user and logout function from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Call logout from context
    navigate('/login');
  };

  const renderDashboardLink = () => {
    if (!user) return null; // No user, no dashboard link

    // Use a switch statement for cleaner role-based rendering
    switch (user.role) {
      case 'vendor':
        return <Link to="/vendor-dashboard" className="text-gray-700 hover:text-indigo-600">Vendor Dashboard</Link>;
      case 'customer': // Changed from 'supplier' to align with backend
        return <Link to="/customer-dashboard" className="text-gray-700 hover:text-indigo-600">Customer Dashboard</Link>;
      case 'admin':
        return <Link to="/admin-dashboard" className="text-gray-700 hover:text-indigo-600">Admin Dashboard</Link>;
      default:
        return null; // Handle unknown roles gracefully
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            StreetEats
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {/* Always visible links */}
            <Link to="/home" className="text-gray-700 hover:text-indigo-600">Home</Link>

            {/* Conditional links based on user status and role */}
            {user ? (
              // If user is logged in
              <>
                {renderDashboardLink()} {/* Render role-specific dashboard */}
                <button onClick={handleLogout} className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Logout</button>
              </>
            ) : (
              // If user is NOT logged in
              <>
                <Link to="/register" className="text-gray-700 hover:text-indigo-600">Register</Link> {/* Added Register link */}
                <Link to="/login" className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Login</Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-white space-y-2">
          <Link to="/home" className="block text-gray-700 hover:text-indigo-600" onClick={() => setIsOpen(false)}>Home</Link>

          {user ? (
            <>
              {/* Conditional rendering for mobile dashboard link */}
              {user.role === 'vendor' && <Link to="/vendor-dashboard" className="block text-gray-700 hover:text-indigo-600" onClick={() => setIsOpen(false)}>Vendor Dashboard</Link>}
              {user.role === 'customer' && <Link to="/customer-dashboard" className="block text-gray-700 hover:text-indigo-600" onClick={() => setIsOpen(false)}>Customer Dashboard</Link>}
              {user.role === 'admin' && <Link to="/admin-dashboard" className="block text-gray-700 hover:text-indigo-600" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>}
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full px-4 py-2 bg-red-500 text-white rounded-md text-center hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/register" className="block text-gray-700 hover:text-indigo-600" onClick={() => setIsOpen(false)}>Register</Link>
              <Link to="/login" className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-center hover:bg-indigo-700" onClick={() => setIsOpen(false)}>Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}