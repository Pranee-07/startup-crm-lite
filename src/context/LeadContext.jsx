import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService';
import { useAuth } from './AuthContext';

/**
 * Normalizes a lead document to ensure both `id` and `_id` are always populated.
 * Guarantees compatibility between MongoDB backend format (_id) and React components (lead.id).
 * 
 * @param {Object} lead - Raw lead document
 * @returns {Object} Normalized lead object
 */
const normalizeLead = (lead) => {
  if (!lead) return lead;
  const id = lead.id || lead._id;
  const rev = lead.revenue !== undefined
    ? Number(lead.revenue)
    : lead.value !== undefined
    ? Number(lead.value)
    : 0;
  return {
    ...lead,
    id,
    _id: id,
    contactName: lead.name || lead.contactName || '',
    name: lead.name || lead.contactName || '',
    stage: lead.status || lead.stage || 'New',
    status: lead.status || lead.stage || 'New',
    revenue: rev,
    value: rev,
    dateAdded: lead.createdAt || lead.dateAdded || new Date().toISOString(),
    createdAt: lead.createdAt || lead.dateAdded || new Date().toISOString(),
  };
};

/**
 * Helper to extract user-friendly error messages from Axios / backend responses.
 * 
 * @param {any} error - Caught error
 * @param {string} defaultMessage - Fallback text
 * @returns {string} Clean error string
 */
const extractErrorMessage = (error, defaultMessage = 'An error occurred') => {
  const resData = error?.response?.data;
  if (resData?.errors) {
    if (Array.isArray(resData.errors)) {
      return resData.errors.map((e) => e.message || e.msg).join(', ');
    }
    if (typeof resData.errors === 'object') {
      return Object.values(resData.errors).join(', ');
    }
  }
  if (resData?.message) {
    return resData.message;
  }
  return error?.message || defaultMessage;
};

/**
 * Lead Context definition.
 */
export const LeadContext = createContext(null);

/**
 * LeadProvider component that manages backend lead state and CRUD operations.
 * 
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element}
 */
export const LeadProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 100,
    pages: 1,
  });

  /**
   * Fetches high-level summary KPIs and status breakdown from backend MongoDB Atlas.
   */
  const fetchStats = useCallback(async () => {
    if (!localStorage.getItem('crm-token')) return;
    try {
      const [statsRes, monthlyRes] = await Promise.all([
        leadService.getLeadStats().catch(() => null),
        leadService.getMonthlyStats().catch(() => null),
      ]);
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
      if (monthlyRes?.data) {
        setMonthlyStats(monthlyRes.data);
      }
    } catch (err) {
      console.warn('[LeadContext] Could not fetch stats from backend:', err?.message);
    }
  }, []);

  /**
   * Fetches leads from the backend API with pagination and updates stats concurrently.
   * 
   * @param {Object} [params] - Query options { status?, search?, page?, limit?, sortBy?, sortOrder? }
   * @returns {Promise<Array>}
   */
  const fetchLeads = useCallback(async (params = { limit: 100 }) => {
    if (!localStorage.getItem('crm-token')) return [];
    setIsLoading(true);
    try {
      const [leadsRes, statsRes, monthlyRes] = await Promise.all([
        leadService.getLeads(params),
        leadService.getLeadStats().catch(() => null),
        leadService.getMonthlyStats().catch(() => null),
      ]);

      const normalized = (leadsRes?.data || []).map(normalizeLead);
      setLeads(normalized);

      if (leadsRes?.pagination) {
        setPagination(leadsRes.pagination);
      }
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
      if (monthlyRes?.data) {
        setMonthlyStats(monthlyRes.data);
      }
      return normalized;
    } catch (error) {
      if (localStorage.getItem('crm-token')) {
        const errorMsg = extractErrorMessage(error, 'Failed to fetch leads from server');
        toast.error(errorMsg);
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Automatically fetch leads and statistics whenever the authenticated token/user changes.
   * Wipes state cleanly when user logs out to prevent cross-account data leakage.
   */
  useEffect(() => {
    if (token) {
      fetchLeads();
    } else {
      setLeads([]);
      setStats(null);
      setMonthlyStats([]);
      setPagination({ total: 0, page: 1, limit: 100, pages: 1 });
    }
  }, [token, fetchLeads]);

  /**
   * Creates a new lead in MongoDB Atlas, adds it to local React state,
   * and refreshes dashboard statistics.
   * 
   * @param {Object} data - Form data
   * @returns {Promise<Object>} The created lead
   */
  const addLead = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const response = await leadService.createLead(data);
      const newLead = normalizeLead(response.data);
      setLeads((prev) => [newLead, ...prev]);
      setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
      fetchStats();
      toast.success(response.message || 'Lead created successfully');
      return newLead;
    } catch (error) {
      const errorMsg = extractErrorMessage(error, 'Failed to create lead');
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats]);

  /**
   * Updates an existing lead by ID, synchronizes local state, and refreshes statistics.
   * 
   * @param {string} id - Lead ID
   * @param {Object} data - Updated attributes
   * @returns {Promise<Object>} The updated lead
   */
  const updateLead = useCallback(async (id, data) => {
    setIsLoading(true);
    try {
      const response = await leadService.updateLead(id, data);
      const updated = normalizeLead(response.data);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id || lead._id === id ? updated : lead))
      );
      fetchStats();
      toast.success(response.message || 'Lead updated successfully');
      return updated;
    } catch (error) {
      const errorMsg = extractErrorMessage(error, 'Failed to update lead');
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats]);

  /**
   * Permanently deletes a lead by ID, updates local state, and recalculates dashboard stats.
   * 
   * @param {string} id - Lead ID
   */
  const deleteLead = useCallback(async (id) => {
    setIsLoading(true);
    try {
      const response = await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id && lead._id !== id));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      fetchStats();
      toast.success(response.message || 'Lead deleted successfully');
    } catch (error) {
      const errorMsg = extractErrorMessage(error, 'Failed to delete lead');
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats]);

  /**
   * Synchronously looks up a single lead from local state by ID.
   * 
   * @param {string} id - Lead identifier
   * @returns {Object|undefined}
   */
  const getLeadById = useCallback(
    (id) => leads.find((lead) => lead.id === id || lead._id === id),
    [leads]
  );

  const value = {
    leads,
    stats,
    monthlyStats,
    isLoading,
    pagination,
    fetchLeads,
    fetchStats,
    addLead,
    updateLead,
    deleteLead,
    getLeadById,
  };

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
};

/**
 * Convenience hook that returns the full LeadContext value.
 * Throws a descriptive error when called outside of <LeadProvider>.
 * 
 * @returns {NonNullable<React.ContextType<typeof LeadContext>>}
 */
export const useLeads = () => {
  const ctx = useContext(LeadContext);
  if (ctx === null) {
    throw new Error(
      '[useLeads] must be used inside a <LeadProvider>. ' +
      'Make sure <LeadProvider> wraps your component tree in main.jsx.'
    );
  }
  return ctx;
};

export default LeadContext;
