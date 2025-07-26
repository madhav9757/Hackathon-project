import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">Welcome to the Street Food Platform</h1>
        <p className="text-gray-600 mb-6">
          You are successfully logged in! This is the dashboard for vendors and suppliers to connect.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/vendor-dashboard"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
          >
            Vendor Dashboard
          </Link>

          <Link
            to="/supplier-dashboard"
            className="px-6 py-3 bg-gray-100 text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition duration-200"
          >
            Supplier Dashboard
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Not your account? <Link to="/login" className="text-indigo-500 underline">Logout</Link>
        </p>
      </div>
    </div>
  );
}
