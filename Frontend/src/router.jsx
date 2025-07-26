// src/router.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import Register from './pages/Register';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
