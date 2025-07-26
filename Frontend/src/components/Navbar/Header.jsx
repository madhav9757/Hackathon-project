import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Optional: replace with SVG or any icon

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            StreetEats
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/vendor-dashboard" className="text-gray-700 hover:text-indigo-600">Vendors</Link>
            <Link to="/supplier-dashboard" className="text-gray-700 hover:text-indigo-600">Suppliers</Link>
            <Link to="/login" className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Login</Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-white space-y-2">
          <Link to="/home" className="block text-gray-700 hover:text-indigo-600">Home</Link>
          <Link to="/vendor-dashboard" className="block text-gray-700 hover:text-indigo-600">Vendors</Link>
          <Link to="/supplier-dashboard" className="block text-gray-700 hover:text-indigo-600">Suppliers</Link>
          <Link to="/login" className="block px-4 py-2 bg-indigo-600 text-white rounded-md text-center hover:bg-indigo-700">Login</Link>
        </div>
      )}
    </nav>
  );
}
