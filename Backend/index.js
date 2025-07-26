import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/ProductRoute.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectToDatabase();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true 
}));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);

app.use(notFound);       // 404 handler
app.use(errorHandler);   // general error handler

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
