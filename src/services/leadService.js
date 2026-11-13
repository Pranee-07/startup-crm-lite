import api from './api';

/**
 * Lead API Service Module.
 * Communicates with the Express backend lead endpoints.
 * Unwraps Axios response and returns `response.data`.
 */

/**
 * Fetches a paginated, filterable list of leads belonging to the authenticated user.
 * 
 * @param {Object} [params] - Query options { status?, search?, page?, limit?, sortBy?, sortOrder? }
 * @returns {Promise<{ success: boolean, data: Array, pagination: Object }>}
 */
export const getLeads = async (params = {}) => {
  const response = await api.get('/api/leads', { params });
  return response.data;
};

/**
 * Creates a new lead document assigned to the current user.
 * 
 * @param {Object} leadData - Lead attributes { name, company, email, phone?, status?, source?, notes? }
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export const createLead = async (leadData) => {
  const response = await api.post('/api/leads', leadData);
  return response.data;
};

/**
 * Updates an existing lead's attributes by ID.
 * 
 * @param {string} id - Lead identifier
 * @param {Object} leadData - Updated lead fields
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export const updateLead = async (id, leadData) => {
  const response = await api.put(`/api/leads/${id}`, leadData);
  return response.data;
};

/**
 * Updates only the pipeline status stage of a lead.
 * 
 * @param {string} id - Lead identifier
 * @param {string} status - New pipeline status ('New', 'Contacted', etc.)
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/api/leads/${id}/status`, { status });
  return response.data;
};

/**
 * Permanently removes a lead record.
 * 
 * @param {string} id - Lead identifier
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};

/**
 * Fetches aggregated lead summary statistics for dashboard KPI cards.
 * 
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export const getLeadStats = async () => {
  const response = await api.get('/api/leads/stats/summary');
  return response.data;
};

/**
 * Fetches chronological monthly lead volume for the last 6 months.
 * 
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export const getMonthlyStats = async () => {
  const response = await api.get('/api/leads/stats/monthly');
  return response.data;
};

export default {
  getLeads,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
};
