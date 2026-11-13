import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * JWT Authentication Guard Middleware.
 * 
 * Verifies the JSON Web Token provided in the Authorization header.
 * If valid, extracts the user payload and attaches the database user record to req.user.
 * 
 * Security checks performed:
 * 1. Checks presence of Authorization header in 'Bearer <token>' format.
 * 2. Cryptographically verifies token integrity and signature with JWT_SECRET.
 * 3. Enforces token expiration checks (TokenExpiredError).
 * 4. Ensures the user referenced in the token still exists in MongoDB Atlas.
 * 5. Checks that the user account is active (!isActive check).
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next middleware function
 */
export const protect = async (req, res, next) => {
  let token;

  // Extract Bearer token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Reject if token is missing
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided, access denied'
    });
  }

  try {
    // Cryptographically verify token signature and expiration
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'startup_crm_super_secret_jwt_key_2026_dev'
    );

    // Fetch user from database excluding password hash
    const user = await User.findById(decoded.id).select('-password');

    // Reject if user was deleted after token was issued
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists'
      });
    }

    // Check if account has been suspended or deactivated
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Attach authenticated user to request object
    req.user = user;
    next();
  } catch (error) {
    // Specific error mapping for client clarity and security
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired, please login again'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid'
      });
    }

    // Pass unexpected internal errors to global error handler
    next(error);
  }
};

export default protect;
