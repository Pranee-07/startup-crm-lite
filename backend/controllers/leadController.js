import mongoose from 'mongoose';
import Lead, { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '../models/Lead.js';
import {
  successResponse,
  errorResponse,
  paginatedResponse
} from '../utils/apiResponse.js';

/**
 * Escapes regex special characters in a search term to prevent regular expression injection (ReDoS).
 * 
 * @param {string} text - Raw search term from user query
 * @returns {string} Sanitized string safe for new RegExp
 */
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Month names for monthly analytics generation.
 */
const MONTH_NAMES = Object.freeze([
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]);

/**
 * Retrieves a paginated list of leads belonging to the authenticated user.
 * 
 * INPUTS:
 * - req.user._id: Authenticated user ID (enforces owner isolation)
 * - req.query.status: Optional status filter (e.g. 'New', 'Contacted', or 'All')
 * - req.query.search: Optional search term matching name, company, or email
 * - req.query.page: Page number (default: 1)
 * - req.query.limit: Items per page (default: 20)
 * - req.query.sortBy: Field to sort on (default: 'createdAt')
 * - req.query.sortOrder: 'asc' or 'desc' (default: 'desc')
 * 
 * OUTPUTS:
 * - 200 OK with paginatedResponse: { success: true, data: Lead[], pagination: { total, page, limit, pages } }
 * 
 * SIDE EFFECTS:
 * - Reads from MongoDB Atlas `leads` collection.
 * - Logs operation details in development mode.
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:getLeads] User ${req.user._id} querying leads:`, {
        status, search, page, limit, sortBy, sortOrder
      });
    }

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (numericPage - 1) * numericLimit;

    // Strict owner isolation: only return leads created by authenticated user
    const filter = { owner: req.user._id };

    // Apply status filter if provided and not 'All'
    if (status && status !== 'All' && LEAD_STATUS_OPTIONS.includes(status)) {
      filter.status = status;
    }

    // Apply regex search on name, company, and email
    if (search && search.trim()) {
      const sanitizedSearch = escapeRegex(search.trim());
      const regex = new RegExp(sanitizedSearch, 'i');
      filter.$or = [
        { name: regex },
        { company: regex },
        { email: regex }
      ];
    }

    // Determine sort options
    const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'company', 'status', 'source'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    // Run query and total count concurrently for optimum performance
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(numericLimit),
      Lead.countDocuments(filter)
    ]);

    return paginatedResponse(res, leads, total, numericPage, numericLimit);
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new lead record assigned to the authenticated user.
 * 
 * INPUTS:
 * - req.user._id: Authenticated user ID (assigned as owner)
 * - req.body: { name, company, email, phone, status, source, notes }
 * 
 * OUTPUTS:
 * - 201 Created with newly created lead document
 * 
 * SIDE EFFECTS:
 * - Inserts a new document into MongoDB Atlas `leads` collection with `owner: req.user._id`.
 * - Logs creation in development mode.
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const createLead = async (req, res, next) => {
  try {
    const { name, company, email, phone, status, source, notes } = req.body;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:createLead] User ${req.user._id} creating lead for "${company}"`);
    }

    // Create lead with guaranteed owner assignment to prevent ownership hijacking
    const newLead = await Lead.create({
      name,
      company,
      email,
      phone,
      status: status || 'New',
      source: source || 'Website',
      notes,
      owner: req.user._id
    });

    return successResponse(res, newLead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single lead by ID, verifying owner ownership.
 * 
 * INPUTS:
 * - req.params.id: Target lead MongoDB ObjectId
 * - req.user._id: Authenticated user ID
 * 
 * OUTPUTS:
 * - 200 OK with lead document
 * - 404 Not Found if lead does not exist or belongs to another user
 * 
 * SIDE EFFECTS:
 * - Reads single lead document from database.
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'Invalid lead identifier format', 400);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:getLeadById] User ${req.user._id} fetching lead ${id}`);
    }

    // Strict owner isolation: query by both _id AND owner
    const lead = await Lead.findOne({ _id: id, owner: req.user._id });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing lead by ID with strict ownership validation and owner immutability.
 * 
 * INPUTS:
 * - req.params.id: Target lead MongoDB ObjectId
 * - req.user._id: Authenticated user ID
 * - req.body: Updated lead attributes
 * 
 * OUTPUTS:
 * - 200 OK with updated lead document
 * - 404 Not Found if lead does not exist or belongs to another user
 * 
 * SIDE EFFECTS:
 * - Updates document in MongoDB Atlas.
 * - Strips `owner` field from body to prevent unauthorized transfer.
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'Invalid lead identifier format', 400);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:updateLead] User ${req.user._id} updating lead ${id}`);
    }

    // Prevent client from mutating ownership
    const updateData = { ...req.body };
    delete updateData.owner;

    // Atomic update with schema validation
    const updatedLead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates only the status pipeline stage of a lead.
 * 
 * INPUTS:
 * - req.params.id: Target lead MongoDB ObjectId
 * - req.user._id: Authenticated user ID
 * - req.body.status: New pipeline stage enum value
 * 
 * OUTPUTS:
 * - 200 OK with updated lead document
 * - 400 Bad Request if status is missing or invalid enum
 * - 404 Not Found if lead not found or not owned by user
 * 
 * SIDE EFFECTS:
 * - Updates status field in database.
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'Invalid lead identifier format', 400);
    }

    if (!status || !LEAD_STATUS_OPTIONS.includes(status)) {
      return errorResponse(
        res,
        `Status is required and must be one of: ${LEAD_STATUS_OPTIONS.join(', ')}`,
        400
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:updateLeadStatus] User ${req.user._id} changing lead ${id} status to "${status}"`);
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead status updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a lead by ID after confirming user ownership.
 * 
 * INPUTS:
 * - req.params.id: Target lead MongoDB ObjectId
 * - req.user._id: Authenticated user ID
 * 
 * OUTPUTS:
 * - 200 OK with { message: 'Lead deleted successfully' }
 * - 404 Not Found if lead not found or not owned by user
 * 
 * SIDE EFFECTS:
 * - Deletes the lead document from MongoDB Atlas.
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'Invalid lead identifier format', 400);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:deleteLead] User ${req.user._id} deleting lead ${id}`);
    }

    const lead = await Lead.findOne({ _id: id, owner: req.user._id });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    await lead.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Aggregates summary statistics for the user's dashboard KPI cards.
 * 
 * INPUTS:
 * - req.user._id: Authenticated user ID
 * 
 * OUTPUTS:
 * - 200 OK with:
 *   {
 *     totalLeads: number,
 *     wonLeads: number,
 *     lostLeads: number,
 *     conversionRate: number, // (Won / Total * 100)
 *     statusBreakdown: Record<string, number>
 *   }
 * 
 * SIDE EFFECTS:
 * - Executes high-performance MongoDB aggregation pipeline on leads collection.
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:getLeadStats] Computing dashboard KPIs for user ${req.user._id}`);
    }

    // Aggregate counts grouped by pipeline status
    const statusAggregation = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Build complete status dictionary initialized with 0
    const statusBreakdown = LEAD_STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    let totalLeads = 0;
    statusAggregation.forEach((item) => {
      if (item._id && Object.prototype.hasOwnProperty.call(statusBreakdown, item._id)) {
        statusBreakdown[item._id] = item.count;
        totalLeads += item.count;
      }
    });

    const wonLeads = statusBreakdown['Won'] || 0;
    const lostLeads = statusBreakdown['Lost'] || 0;
    const conversionRate = totalLeads > 0
      ? Number(((wonLeads / totalLeads) * 100).toFixed(1))
      : 0;

    const stats = {
      totalLeads,
      wonLeads,
      lostLeads,
      conversionRate,
      statusBreakdown
    };

    return successResponse(res, stats, 'Lead statistics fetched successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Aggregates monthly lead creation and conversion volume for the last 6 months.
 * Formatted specifically for consumption by Analytics bar and funnel charts.
 * 
 * INPUTS:
 * - req.user._id: Authenticated user ID
 * 
 * OUTPUTS:
 * - 200 OK with array:
 *   [
 *     { month: 'Jun', year: 2026, total: 5, won: 2, Leads: 5 },
 *     ...
 *   ]
 * 
 * SIDE EFFECTS:
 * - Executes MongoDB aggregation grouped by $year and $month for createdAt >= 6 months ago.
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LeadController:getMonthlyStats] Generating 6-month analytics for user ${req.user._id}`);
    }

    // Calculate beginning of the window 5 months ago (giving 6 months total including current)
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(startDate.getMonth() - 5);
    startDate.setHours(0, 0, 0, 0);

    // Aggregate monthly totals and won counts
    const aggregationResult = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' } // 1-indexed (1 = Jan, 12 = Dec)
          },
          total: { $sum: 1 },
          won: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Won'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    // Construct sequential 6-month array ensuring zero-filling for empty months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(1);
      targetDate.setMonth(targetDate.getMonth() - i);

      const targetYear = targetDate.getFullYear();
      const targetMonthIndex = targetDate.getMonth(); // 0-indexed (0 = Jan)
      const targetMonthNumber = targetMonthIndex + 1; // 1-indexed for MongoDB comparison
      const monthLabel = MONTH_NAMES[targetMonthIndex];

      const matchingAggregation = aggregationResult.find(
        (item) => item._id.year === targetYear && item._id.month === targetMonthNumber
      );

      const total = matchingAggregation ? matchingAggregation.total : 0;
      const won = matchingAggregation ? matchingAggregation.won : 0;

      monthlyData.push({
        month: monthLabel,
        name: monthLabel,
        year: targetYear,
        total,
        won,
        Leads: total, // Aliased for direct Recharts bar chart binding
        Conversions: won
      });
    }

    return successResponse(res, monthlyData, 'Monthly lead statistics fetched successfully', 200);
  } catch (error) {
    next(error);
  }
};

export default {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats
};
