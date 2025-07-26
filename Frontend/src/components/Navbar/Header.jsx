import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { logoutUser } from '../../api/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const renderDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'vendor') return <Link to="/vendor-dashboard" className="text-gray-700 hover:text-indigo-600">Vendor Dashboard</Link>;
    if (user.role === 'supplier') return <Link to="/supplier-dashboard" className="text-gray-700 hover:text-indigo-600">Supplier Dashboard</Link>;
    return null;
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            StreetEats
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-gray-700 hover:text-indigo-600">Home</Link>
            {renderDashboardLink()}
            {!user ? (
              <Link to="/login" className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Login</Link>
            ) : (
              <button onClick={handleLogout} className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Logout</button>
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
          <Link to="/home" className="block text-gray-700 hover:text-indigo-600">Home</Link>
          {renderDashboardLink() && (
            <div className="block text-gray-700 hover:text-indigo-600">
              {renderDashboardLink()}
            </div>
          )}
          {!user ? (
            <Link to="/login" className="block px-4 py-2 bg-indigo-600 text-white rounded-md text-center hover:bg-indigo-700">Login</Link>
          ) : (
            <button onClick={handleLogout} className="block w-full px-4 py-2 bg-red-500 text-white rounded-md text-center hover:bg-red-600">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}
