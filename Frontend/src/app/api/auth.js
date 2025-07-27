import axios from 'axios';
import { API_URL_AUTH } from '../constant'; 

const authApiClient = axios.create({
  baseURL: API_URL_AUTH, 
  withCredentials: true,
});

// Optional: Add a response interceptor for global error handling (e.g., 401 Unauthorized)
authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request. Session might have expired or token is invalid.');
      // You might want to trigger a global logout action here (e.g., clear AuthContext, redirect to login)
      // Example: window.location.href = '/login'; // This would force a full page reload and re-initialization
    }
    return Promise.reject(error); // Re-throw the error for component-specific handling
  }
);

// Login user
export const loginUser = async (email, password) => {
  const res = await authApiClient.post('/login', { email, password });
  return res.data; 
};

// Register user
// IMPORTANT: Ensure the function signature includes phone and address
// Make sure you are passing phone and address from your RegisterPage component!
export const registerUser = async (name, email, password, phone, address, role) => {
  const res = await authApiClient.post('/register', {
    name,
    email,
    password,
    phone,   
    address, 
    role,
  });
  return res.data;
};

// Logout user
export const logoutUser = async () => {
  const res = await authApiClient.post('/logout');
  return res.data;
};

// Get current user profile
export const getUserProfile = async () => {
  const res = await authApiClient.get('/profile');
  return res.data;
};