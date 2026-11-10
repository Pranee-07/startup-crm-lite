import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Database connection
import connectDB from './config/database.js';

// Route modules
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Centralized error handling middleware
import errorHandler from './middleware/errorHandler.js';

// Load environment variables from .env
dotenv.config();

// Initialize Express application
const app = express();

// ==========================================
// Security & Utility Middleware
// ==========================================

// Helmet sets critical HTTP security headers
app.use(helmet());

// Morgan logs HTTP requests in dev format
app.use(morgan('dev'));

// CORS configuration to allow secure communication with the frontend client
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
);

// Body parsers: restrict JSON payload to 10kb to defend against DoS attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Health Check Endpoint
// ==========================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date()
  });
});

// ==========================================
// API Routes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ==========================================
// Global Error Handler
// ==========================================
// Must be registered LAST, after all route definitions
app.use(errorHandler);

// ==========================================
// Server Initialization
// ==========================================
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Initializes database connection and starts listening for HTTP requests.
 */
const startServer = async () => {
  // Connect to MongoDB Atlas first
  await connectDB();

  // Start Express HTTP server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

startServer();

export default app;
