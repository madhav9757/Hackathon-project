import React, { createContext, useState, useEffect, useContext } from 'react';
import { logoutUser as apiLogoutUser } from '../api/auth'; // Renamed to avoid conflict

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state for initial load

  useEffect(() => {
    // Load user from localStorage on initial app load
    try {
      const storedUser = localStorage.getItem('userInfo'); // Use 'userInfo' consistent with LoginPage suggestion
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('userInfo'); // Clear invalid data
    } finally {
      setLoading(false); // Indicate initial loading is complete
    }
  }, []);

  // Login function to be called from LoginPage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  // Logout function to be called from Navbar or other components
  const logout = async () => {
    try {
      await apiLogoutUser(); // Call backend logout
      setUser(null);
      localStorage.removeItem('userInfo');
      // Optionally, navigate to login here or let the calling component do it
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if backend logout fails, clear frontend state for UX
      setUser(null);
      localStorage.removeItem('userInfo');
    }
  };

  if (loading) {
    // Optional: Render a loading spinner or null while checking localStorage
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext easily
export const useAuth = () => {
  return useContext(AuthContext);
};