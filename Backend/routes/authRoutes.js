import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { registerUser, loginUser, logoutUser, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const AuthRouter = express.Router();

// @route   POST /api/users/register
router.post('/register', asyncHandler(registerUser));

// @route   POST /api/users/login
router.post('/login', asyncHandler(loginUser));

// @route   POST /api/users/logout
router.post('/logout', asyncHandler(logoutUser));

// @route   GET /api/users/profile
router.get('/profile', protect, asyncHandler(getProfile));

export default AuthRouter;
