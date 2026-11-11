import express from 'express';
import { body } from 'express-validator';

// Controllers
import {
  register,
  login,
  getProfile,
  updateProfile
} from '../controllers/authController.js';

// Middlewares
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * ============================================================================
 * PRODUCTION RATE LIMITING:
 * 
 * To mitigate brute-force password guessing and automated credential stuffing,
 * attach express-rate-limit middleware to the public auth routes:
 * 
 * router.post('/login', authLimiter, validate(loginValidation), login);
 * router.post('/register', authLimiter, validate(registerValidation), register);
 * ============================================================================
 */

// Validation rules for user registration
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be either "admin" or "user"')
];

// Validation rules for user login
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for updating profile
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// ==========================================
// Authentication Routes (5 endpoints)
// ==========================================

// 1. Register a new user
router.post('/register', validate(registerValidation), register);

// 2. Authenticate existing user & issue token
router.post('/login', validate(loginValidation), login);

// 3. Get current authenticated user profile (alias 1)
router.get('/me', protect, getProfile);

// 4. Get current authenticated user profile (alias 2)
router.get('/profile', protect, getProfile);

// 5. Update authenticated user profile (name or password)
router.put('/profile', protect, validate(updateProfileValidation), updateProfile);

export default router;
