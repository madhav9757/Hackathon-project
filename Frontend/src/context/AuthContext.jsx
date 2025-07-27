// src/context/AuthContext.jsx (Conceptual - you'll fill in the details)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getUserProfile } from '../app/api/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [LoginSuccess, setLoginSuccess] = useState(false);
  const [user, setUser] = useState(null); // Stores user data
  const [loading, setLoading] = useState(true); // Manages initial loading state
  const navigate = useNavigate(); // For programmatic redirection within context

  // Effect to load user from session/cookie on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile(); 
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        setUser(null); // Clear user if session invalid
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await loginUser(email, password);
      setLoginSuccess(true);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw for component to handle
    }
  };

  const register = async (name, email, password, phone, address, role) => {
    try {
      const userData = await registerUser(name, email, password, phone, address, role);
      setUser(userData); // Automatically log in user after registration if desired
      return userData;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null); // Clear user state
      navigate('/login'); // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    // You can add a function to refresh user data if needed:
    // refreshUserProfile: async () => { /* call getUserProfile and setUser */ }
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading authentication...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};