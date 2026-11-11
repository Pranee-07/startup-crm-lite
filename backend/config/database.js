import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Connects to MongoDB Atlas using Mongoose.
 * 
 * Modern Mongoose (v7+) and MongoDB Driver (v4+) do not accept
 * deprecated options like useNewUrlParser and useUnifiedTopology.
 * Calling mongoose.connect(uri) directly uses the latest driver settings.
 * 
 * @returns {Promise<typeof mongoose>}
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    if (error.message.includes('authentication failed')) {
      console.error('\n[Atlas Auth Checklist]');
      console.error('1. Go to MongoDB Atlas -> Security -> Database Access.');
      console.error('2. Verify the database user exists (e.g. krishnampraneeth_db_user).');
      console.error('3. Click "Edit" -> "Edit Password" to reset/confirm the user password.');
      console.error('4. Check MongoDB Atlas -> Network Access: ensure 0.0.0.0/0 (or current IP) is added.\n');
    }

    process.exit(1);
  }
};

export default connectDB;
