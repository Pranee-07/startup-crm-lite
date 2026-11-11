import express from 'express';
import { body, param, query } from 'express-validator';

// Controllers
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats
} from '../controllers/leadController.js';

// Middlewares
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '../models/Lead.js';

const router = express.Router();

// Protect all lead routes with JWT verification
router.use(protect);

// Lead creation validation rules
const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Lead name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Lead name must be between 2 and 100 characters'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('phone')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(LEAD_STATUS_OPTIONS)
    .withMessage(`Status must be one of: ${LEAD_STATUS_OPTIONS.join(', ')}`),
  body('source')
    .optional()
    .isIn(LEAD_SOURCE_OPTIONS)
    .withMessage(`Source must be one of: ${LEAD_SOURCE_OPTIONS.join(', ')}`),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

// Lead update validation rules
const updateLeadValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Lead name must be between 2 and 100 characters'),
  body('company')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('phone')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(LEAD_STATUS_OPTIONS)
    .withMessage(`Status must be one of: ${LEAD_STATUS_OPTIONS.join(', ')}`),
  body('source')
    .optional()
    .isIn(LEAD_SOURCE_OPTIONS)
    .withMessage(`Source must be one of: ${LEAD_SOURCE_OPTIONS.join(', ')}`),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

// Lead ID param validation
const idParamValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID format')
];

// ==========================================
// Lead Routes
// ==========================================

// Pipeline overview and conversion analytics
router.get('/stats', getLeadStats);

// List leads (with pagination, search, status & source filters)
router.get('/', getLeads);

// Retrieve single lead by ID
router.get('/:id', validate(idParamValidation), getLeadById);

// Create new lead
router.post('/', validate(createLeadValidation), createLead);

// Update lead by ID
router.put('/:id', validate(updateLeadValidation), updateLead);

// Delete lead by ID
router.delete('/:id', validate(idParamValidation), deleteLead);

export default router;
