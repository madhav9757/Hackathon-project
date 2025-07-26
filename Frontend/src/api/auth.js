// src/api/auth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required to send/receive cookies
});

// Login user
export const loginUser = async (email, password) => {
  const res = await axiosInstance.post('/login', { email, password });
  return res.data; // returns user object
};

// Register user
export const registerUser = async (name, email, password) => {
  const res = await axiosInstance.post('/register', { name, email, password });
  return res.data;
};

// Logout user
export const logoutUser = async () => {
  const res = await axiosInstance.post('/logout');
  return res.data;
};

// Get current user profile
export const getUserProfile = async () => {
  const res = await axiosInstance.get('/profile');
  return res.data;
};
