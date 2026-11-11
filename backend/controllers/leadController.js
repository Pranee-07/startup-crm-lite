import mongoose from 'mongoose';
import Lead, { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '../models/Lead.js';
import {
  successResponse,
  errorResponse,
  paginatedResponse
} from '../utils/apiResponse.js';

/**
 * Escapes special regex characters in a string to prevent ReDoS attacks.
 * 
 * @param {string} text - User search input
 * @returns {string} Sanitized string safe for RegExp
 */
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Retrieves a paginated list of leads with filtering, search, and role-based data scoping.
 * 
 * Access Rules:
 * - Regular users ('user') only see leads they own (owner: req.user._id).
 * - Admins ('admin') can view all leads across the CRM, or filter by a specific owner.
 * 
 * Query Parameters:
 * - page: Current page number (default: 1)
 * - limit: Number of leads per page (default: 10, max: 100)
 * - search: Search keyword matched against name, company, and email
 * - status: Pipeline stage filter (e.g. 'New', 'Won')
 * - source: Channel filter (e.g. 'LinkedIn', 'Referral')
 * - sortBy: Field to sort by (default: 'createdAt')
 * - sortOrder: 'asc' (1) or 'desc' (-1) (default: 'desc')
 * 
 * @route GET /api/leads
 * @access Private
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      source,
      owner,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (numericPage - 1) * numericLimit;

    // Base query filter
    const query = {};

    // Role-based data scoping: regular users only access their own leads
    if (req.user.role !== 'admin') {
      query.owner = req.user._id;
    } else if (owner && mongoose.Types.ObjectId.isValid(owner)) {
      // Admin optional filter by owner
      query.owner = new mongoose.Types.ObjectId(owner);
    }

    // Filter by pipeline status
    if (status && LEAD_STATUS_OPTIONS.includes(status)) {
      query.status = status;
    }

    // Filter by acquisition source
    if (source && LEAD_SOURCE_OPTIONS.includes(source)) {
      query.source = source;
    }

    // Case-insensitive multi-field search
    if (search && search.trim()) {
      const sanitizedSearch = escapeRegex(search.trim());
      const searchRegex = new RegExp(sanitizedSearch, 'i');
      query.$or = [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex }
      ];
    }

    // Sort order
    const sortOptions = {};
    const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'company', 'status', 'source'];
    const fieldToSort = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sortOptions[fieldToSort] = sortOrder === 'asc' ? 1 : -1;

    // Parallel execution for optimal performance: count + paginated query
    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('owner', 'name email role')
        .sort(sortOptions)
        .skip(skip)
        .limit(numericLimit)
        .lean({ virtuals: true }),
      Lead.countDocuments(query)
    ]);

    return paginatedResponse(res, leads, total, numericPage, numericLimit);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single lead by its unique MongoDB ObjectId.
 * 
 * Access Rules:
 * - Regular users can only access their own leads.
 * - Admins can access any lead.
 * 
 * @route GET /api/leads/:id
 * @access Private
 */
export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'Invalid lead identifier', 400);
    }

    const lead = await Lead.findById(id).populate('owner', 'name email role');

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    // Enforce ownership check for non-admin users
    if (req.user.role !== 'admin' && lead.owner._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to access this lead', 403);
    }

    return successResponse(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new lead in the CRM and assigns ownership to the authenticated user.
 * 
 * @route POST /api/leads
 * @access Private
 */
export const createLead = async (req, res, next) => {
  try {
    const { name, company, email, phone, status, source, notes } = req.body;

    // Instantiate and bind owner to authenticated user
    const newLead = new Lead({
      name,
      company,
      email,
      phone,
      status: status || 'New',
      source: source || 'Website',
      notes,
      owner: req.user._id
    });

    await newLead.save();

    // Populate owner metadata before returning
    await newLead.populate('owner', 'name email role');

    return successResponse(res, newLead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing lead.
 * 
 * Access Rules:
 * - Regular users can only update their own leads.
 * - Admins can update any lead.
 * 
 * @route PUT /api/leads/:id
 * @access Private
 */
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'Invalid lead identifier', 400);
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    // Enforce ownership check for non-admin users
    if (req.user.role !== 'admin' && lead.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to update this lead', 403);
    }

    // Allowed updatable fields
    const updatableFields = ['name', 'company', 'email', 'phone', 'status', 'source', 'notes'];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        lead[field] = req.body[field];
      }
    });

    await lead.save();
    await lead.populate('owner', 'name email role');

    return successResponse(res, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a lead record from MongoDB Atlas.
 * 
 * Access Rules:
 * - Regular users can only delete their own leads.
 * - Admins can delete any lead.
 * 
 * @route DELETE /api/leads/:id
 * @access Private
 */
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 'Invalid lead identifier', 400);
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    // Enforce ownership check for non-admin users
    if (req.user.role !== 'admin' && lead.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to delete this lead', 403);
    }

    await lead.deleteOne();

    return successResponse(res, { id }, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Aggregates high-level pipeline analytics and conversion statistics.
 * 
 * Computes:
 * - Total leads count
 * - Status distribution breakdown (New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost)
 * - Source distribution breakdown (Website, Referral, LinkedIn, Cold Call, Email Campaign, Other)
 * - Conversion rate (% Won)
 * - Lost rate (% Lost)
 * 
 * @route GET /api/leads/stats
 * @access Private
 */
export const getLeadStats = async (req, res, next) => {
  try {
    const matchStage = {};

    // Scope stats to regular user or CRM-wide for admin
    if (req.user.role !== 'admin') {
      matchStage.owner = req.user._id;
    }

    const [statusStats, sourceStats, totalCount] = await Promise.all([
      // Count leads grouped by status
      Lead.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      // Count leads grouped by source
      Lead.aggregate([
        { $match: matchStage },
        { $group: { _id: '$source', count: { $sum: 1 } } }
      ]),
      // Total matching leads count
      Lead.countDocuments(matchStage)
    ]);

    // Build complete status map with 0 counts for unused statuses
    const statusBreakdown = LEAD_STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});
    statusStats.forEach((item) => {
      if (item._id) statusBreakdown[item._id] = item.count;
    });

    // Build complete source map with 0 counts for unused sources
    const sourceBreakdown = LEAD_SOURCE_OPTIONS.reduce((acc, source) => {
      acc[source] = 0;
      return acc;
    }, {});
    sourceStats.forEach((item) => {
      if (item._id) sourceBreakdown[item._id] = item.count;
    });

    const wonCount = statusBreakdown['Won'] || 0;
    const lostCount = statusBreakdown['Lost'] || 0;
    const conversionRate = totalCount > 0 ? Number(((wonCount / totalCount) * 100).toFixed(2)) : 0;
    const lostRate = totalCount > 0 ? Number(((lostCount / totalCount) * 100).toFixed(2)) : 0;

    const stats = {
      totalLeads: totalCount,
      wonLeads: wonCount,
      lostLeads: lostCount,
      conversionRate,
      lostRate,
      statusBreakdown,
      sourceBreakdown
    };

    return successResponse(res, stats, 'Lead statistics fetched successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats
};
