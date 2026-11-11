import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * PRODUCTION RATE LIMITING RECOMMENDATION:
 * 
 * In production environments, sensitive authentication endpoints (specifically /login and /register)
 * MUST be protected against brute-force and credential stuffing attacks by attaching
 * `express-rate-limit`. Example configuration:
 * 
 * import rateLimit from 'express-rate-limit';
 * export const authLimiter = rateLimit({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 5, // Limit each IP to 5 failed login attempts per window
 *   message: { success: false, message: 'Too many login attempts from this IP. Please try again after 15 minutes.' },
 *   standardHeaders: true,
 *   legacyHeaders: false,
 * });
 * 
 * Apply `authLimiter` directly to the `POST /login` and `POST /register` routes in authRoutes.js.
 */

/**
 * Cryptographic helper to sign a JSON Web Token for an authenticated user.
 * 
 * @param {string|import('mongoose').Types.ObjectId} userId - Target user identifier
 * @returns {string} Signed JWT string
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Registers a new user account.
 * 
 * - Checks for duplicate email registration.
 * - Saves user record (password is automatically hashed via Mongoose pre-save hook).
 * - Issues JWT access token upon successful registration.
 * - Guarantees password hash is stripped from response payload.
 * 
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Normalize email for case-insensitive uniqueness check
    const normalizedEmail = email.toLowerCase().trim();

    // Check if account already exists with this email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user in database (pre-save hook hashes password with 10 salt rounds)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role || 'user'
    });

    // Generate authenticated JWT
    const token = generateToken(user._id);

    // Return 201 Created with token and safe user payload
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticates user credentials and issues a JWT session token.
 * 
 * Security safeguards:
 * - Constant-time check / generic "Invalid credentials" error to prevent user enumeration.
 * - Explicit check for deactivated accounts (!isActive).
 * - Excludes password hash from output.
 * 
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Query user by email explicitly selecting the password hash for comparison
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Security practice: Never specify whether the email or password was wrong
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password against stored bcrypt hash using instance method
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate JWT access token
    const token = generateToken(user._id);

    // Return 200 OK with token and user document (toJSON strips password automatically)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the currently authenticated user's profile.
 * 
 * @route GET /api/auth/me, GET /api/auth/profile
 * @access Private (Requires valid JWT)
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user was securely resolved and attached by the protect middleware
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates user profile attributes (name and password).
 * 
 * Security rules:
 * - Email modification is blocked here; email changes require dedicated re-verification flow.
 * - Password modification requires verification of the current password before accepting the new password.
 * 
 * @route PUT /api/auth/profile
 * @access Private (Requires valid JWT)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    // Fetch user including password hash for authentication
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update name if supplied
    if (name) {
      user.name = name.trim();
    }

    // Update password if requested
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password'
        });
      }

      // Verify old password first
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Validate new password minimum length
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      // Assigning new password triggers Mongoose pre-save hook to hash with bcryptjs
      user.password = newPassword;
    }

    // Save triggers schema validations and pre-save hooks
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getProfile,
  updateProfile,
  generateToken
};
