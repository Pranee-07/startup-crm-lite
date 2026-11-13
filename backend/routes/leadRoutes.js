import express from 'express';
import { body, param } from 'express-validator';

// Controller actions
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats
} from '../controllers/leadController.js';

// Middlewares
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '../models/Lead.js';

const router = express.Router();

// ==========================================
// Authentication Guard
// ==========================================
// Apply JWT authentication guard to ALL lead routes in this router
router.use(protect);

// ==========================================
// Validation Rule Sets
// ==========================================

/**
 * Validation rules for creating a new lead document.
 */
const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email format'),
  body('status')
    .optional()
    .isIn(LEAD_STATUS_OPTIONS)
    .withMessage(`Status must be one of: ${LEAD_STATUS_OPTIONS.join(', ')}`),
  body('source')
    .optional()
    .isIn(LEAD_SOURCE_OPTIONS)
    .withMessage(`Source must be one of: ${LEAD_SOURCE_OPTIONS.join(', ')}`),
  body('phone')
    .optional()
    .trim(),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

/**
 * Validation rules for updating an existing lead document.
 */
const updateLeadValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID format'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('company')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email format'),
  body('status')
    .optional()
    .isIn(LEAD_STATUS_OPTIONS)
    .withMessage(`Status must be one of: ${LEAD_STATUS_OPTIONS.join(', ')}`),
  body('source')
    .optional()
    .isIn(LEAD_SOURCE_OPTIONS)
    .withMessage(`Source must be one of: ${LEAD_SOURCE_OPTIONS.join(', ')}`),
  body('phone')
    .optional()
    .trim(),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

/**
 * Validation rules for updating only the pipeline status of a lead.
 */
const updateStatusValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID format'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(LEAD_STATUS_OPTIONS)
    .withMessage(`Status must be one of: ${LEAD_STATUS_OPTIONS.join(', ')}`)
];

/**
 * Validation rules for route parameters expecting a MongoDB ObjectId.
 */
const idParamValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID format')
];

// ==========================================
// 8 Lead API Endpoints
// ==========================================

// 1. GET /api/leads - Retrieve paginated, filterable, searchable list of leads
router.get('/', getLeads);

// 2. POST /api/leads - Create a new lead assigned to authenticated user
router.post('/', validate(createLeadValidation), createLead);

// 3. GET /api/leads/stats - Retrieve high-level KPI and status breakdown statistics
router.get('/stats', getLeadStats);
router.get('/stats/summary', getLeadStats); // Alias matching client leadService

// 4. GET /api/leads/stats/monthly - Retrieve 6-month monthly lead volume analytics
router.get('/stats/monthly', getMonthlyStats);
router.get('/monthly-stats', getMonthlyStats); // Alias for flexible client routing

// 5. GET /api/leads/:id - Retrieve single lead by ID with owner isolation
router.get('/:id', validate(idParamValidation), getLeadById);

// 6. PUT /api/leads/:id - Update an existing lead with owner isolation and validation
router.put('/:id', validate(updateLeadValidation), updateLead);

// 7. PATCH /api/leads/:id/status - Update pipeline status in one atomic operation
router.patch('/:id/status', validate(updateStatusValidation), updateLeadStatus);
router.put('/:id/status', validate(updateStatusValidation), updateLeadStatus); // Alias for REST flexibility

// 8. DELETE /api/leads/:id - Delete a lead by ID with owner isolation
router.delete('/:id', validate(idParamValidation), deleteLead);

export default router;
