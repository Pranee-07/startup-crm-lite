import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Database connection
import connectDB from './config/database.js';

// Route modules
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Centralized error handling middleware
import errorHandler from './middleware/errorHandler.js';

// Load environment variables reliably from backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config(); // fallback to current working directory if needed

// Initialize Express application
const app = express();

// ==========================================
// Security & Utility Middleware
// ==========================================

// Helmet sets critical HTTP security headers
app.use(helmet());

// Morgan logs HTTP requests in dev format
app.use(morgan('dev'));

// CORS configuration supporting local dev and Vercel production deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://startup-crm-lite-khaki.vercel.app',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers: restrict JSON payload to 10kb to defend against DoS attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Health Check & Root Endpoints
// ==========================================
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const isConnected = dbState === 1;

  res.status(200).json({
    status: 'OK',
    server: 'running',
    database: states[dbState] || 'Unknown',
    databaseConnected: isConnected,
    timestamp: new Date()
  });
});

app.get('/', (req, res) => {
  res.status(200).send('Startup CRM Backend is running!');
});

// ==========================================
// API Routes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ==========================================
// Global Error Handler (MUST BE LAST)
// ==========================================
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
  // Connect to MongoDB Atlas
  await connectDB();

  // Start Express HTTP server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

startServer();

export default app;
