import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Connects to MongoDB Atlas database using Mongoose.
 * 
 * - Configures required connection options (useNewUrlParser, useUnifiedTopology).
 * - Logs host connection details on success.
 * - Logs error and terminates the process with exit code 1 on failure.
 * 
 * @returns {Promise<typeof mongoose>} Active Mongoose connection instance
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    // Connect with user-specified Mongoose connection options
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
