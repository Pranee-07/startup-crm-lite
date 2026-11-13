import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure backend/.env is loaded regardless of process.cwd()
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

/**
 * Connects to MongoDB Atlas using Mongoose.
 * 
 * Modern Mongoose (v7+) and MongoDB Driver (v4+) do not accept
 * deprecated options like useNewUrlParser and useUnifiedTopology.
 * 
 * @returns {Promise<typeof mongoose | null>}
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('\n⚠️ [Database Warning] MONGODB_URI is not defined in backend/.env');
      return null;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    const host = conn.connection.host || mongoose.connection.host || 'cluster0.hli4xat.mongodb.net';
    console.log(`✅ MongoDB Atlas Connected: ${host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);

    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('\n[Atlas Authentication Checklist]');
      console.error('1. Go to MongoDB Atlas -> Security -> Database Access.');
      console.error('2. Confirm the database user exists.');
      console.error('3. Click "Edit" -> "Edit Password" to reset and ensure it matches backend/.env.');
      console.error('4. In Security -> Network Access: ensure 0.0.0.0/0 (or current IP) is Active.\n');
    } else if (
      error.message.includes('IP that isn\'t whitelisted') ||
      error.message.includes('ssl3_read_bytes:tlsv1 alert internal error') ||
      error.message.includes('SSL alert number 80')
    ) {
      console.error('\n[Atlas Network Access Checklist]');
      console.error('1. Go to MongoDB Atlas -> Security -> Network Access.');
      console.error('2. Click "+ Add IP Address".');
      console.error('3. Choose "Allow Access From Anywhere" (0.0.0.0/0) or add your current IP address.');
      console.error('4. Click Confirm and wait ~1 minute for Atlas to apply.\n');
    }

    // In production, exit; in development, keep server alive for diagnostics
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

export default connectDB;
