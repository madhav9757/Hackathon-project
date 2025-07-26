import axios from 'axios';
import { API_URL_AUTH, API_BASE_URL } from '../constant'; 


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

// Login user
export const loginUser = async (email, password) => {
  const res = await axiosInstance.post(`${API_URL_AUTH}/login`, { email, password });
  return res.data;
};

// Register user
export const registerUser = async (name, email, password, role) => {
  const res = await axiosInstance.post(`${API_URL_AUTH}/register`, { name, email, password, role });
  return res.data;
};

// Logout user
export const logoutUser = async () => {
  const res = await axiosInstance.post(`${API_URL_AUTH}/logout`);
  return res.data;
};

// Get current user profile
export const getUserProfile = async () => {
  const res = await axiosInstance.get(`${API_URL_AUTH}/profile`);
  return res.data;
};
