import React, { useState } from 'react';
import { loginUser as apiLoginUser } from '../app/api/auth'; // Renamed to avoid conflict
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Removed: const [roleSelection, setRoleSelection] = useState('vendor'); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth(); // Get the login function from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors

    try {
      const userData = await apiLoginUser(email, password);

      login(userData); // Update context and localStorage with the actual user data from backend
      console.log('Login successful:', userData);

      const { _id, role, name, email } = userData;

      if (role == 'admin') {
        navigate('/admin-dashboard');
      } else if (role == 'vendor') {
        navigate('/vendor-dashboard');
      } else if (role == 'customer') {
        navigate('/customer-dashboard');
      } else {
        navigate('/dashboard'); // Fallback for unknown roles or general dashboard
      }

    } catch (err) {
      console.error('Login error:', err);
      // Display error message from backend or a generic one
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Set loading to false after API call completes
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">Login to Your Account</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com"
              disabled={loading} // Disable input during loading
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="••••••••"
              disabled={loading} // Disable input during loading
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading} // Disable button during loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}