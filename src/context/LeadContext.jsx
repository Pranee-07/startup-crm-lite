import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * @typedef {Object} Lead
 * @property {string}   id        - Unique identifier (UUID or timestamp string)
 * @property {string}   name      - Full name of the lead contact
 * @property {string}   company   - Company or organisation name
 * @property {string}   email     - Contact email address
 * @property {string}   phone     - Contact phone number
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline stage
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Acquisition channel
 * @property {string}   createdAt - ISO 8601 date string set automatically on creation
 */

/**
 * @typedef {Object} LeadContextValue
 * @property {Lead[]}                          leads       - Array of all lead objects
 * @property {(data: Omit<Lead,'id'|'createdAt'>) => Lead} addLead     - Creates and stores a new lead
 * @property {(id: string, data: Partial<Lead>) => void}   updateLead  - Merges partial data into an existing lead
 * @property {(id: string) => void}            deleteLead  - Removes a lead by ID
 * @property {(id: string) => Lead|undefined}  getLeadById - Returns a single lead or undefined
 */

const STORAGE_KEY = 'crm_leads_v1';

// ─── Seed data – shown when localStorage is empty ──────────────────────────
/** @type {Lead[]} */
const seedLeads = [
  {
    id: '1',
    name: 'Marcus Vance',
    company: 'Apex Corp Solutions',
    email: 'marcus@apex.io',
    phone: '+1 (555) 234-5678',
    status: 'Contacted',
    source: 'LinkedIn',
    createdAt: '2026-06-15T14:30:00.000Z',
  },
  {
    id: '2',
    name: 'Nadia Thorne',
    company: 'Siren Systems Ltd',
    email: 'nadia@siren.co',
    phone: '+1 (555) 876-5432',
    status: 'New',
    source: 'Website',
    createdAt: '2026-06-14T09:15:00.000Z',
  },
  {
    id: '3',
    name: 'Julian Foster',
    company: 'Vortex Labs Inc',
    email: 'julian@vortex.net',
    phone: '+1 (555) 987-6543',
    status: 'New',
    source: 'Email Campaign',
    createdAt: '2026-06-16T10:00:00.000Z',
  },
  {
    id: '4',
    name: 'Elena Rostova',
    company: 'Horizon Ventures',
    email: 'elena@horizon.vc',
    phone: '+1 (555) 432-1098',
    status: 'Proposal Sent',
    source: 'Referral',
    createdAt: '2026-06-13T16:45:00.000Z',
  },
  {
    id: '5',
    name: 'Kenji Sato',
    company: 'Stellar Tech Corp',
    email: 'kenji@stellar.tech',
    phone: '+1 (555) 543-2109',
    status: 'Won',
    source: 'Referral',
    createdAt: '2026-06-10T11:00:00.000Z',
  },
  {
    id: '6',
    name: 'Robert Miller',
    company: 'Alpha Builders',
    email: 'robert@alphabuild.com',
    phone: '+1 (555) 654-3210',
    status: 'Lost',
    source: 'Cold Call',
    createdAt: '2026-06-11T13:20:00.000Z',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Reads and parses the leads array from localStorage.
 * Falls back to seed data if the key is absent or corrupted.
 *
 * @returns {Lead[]} Persisted or seed leads
 */
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('[LeadContext] Failed to parse localStorage leads:', err);
  }
  return seedLeads;
};

/**
 * Serialises and persists the leads array to localStorage.
 *
 * @param {Lead[]} leads - Current leads array to persist
 */
const saveToStorage = (leads) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('[LeadContext] Failed to write leads to localStorage:', err);
  }
};

// ─── Context creation ────────────────────────────────────────────────────────

/** @type {React.Context<LeadContextValue|null>} */
export const LeadContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * LeadProvider wraps the application and supplies the lead state + operations
 * to every consumer via React Context.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element}
 */
export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState(() => loadFromStorage());

  // Sync to localStorage whenever leads change
  useEffect(() => {
    saveToStorage(leads);
  }, [leads]);

  /**
   * Creates a new lead with an auto-generated ID and createdAt timestamp,
   * then prepends it to the leads array.
   *
   * @param {Omit<Lead, 'id'|'createdAt'>} data - Lead fields supplied by the caller
   * @returns {Lead} The newly created lead object (including generated id + createdAt)
   */
  const addLead = useCallback((data) => {
    const newLead = {
      ...data,
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, []);

  /**
   * Merges partial fields into an existing lead identified by ID.
   * No-ops silently if the ID is not found.
   *
   * @param {string}       id   - ID of the lead to update
   * @param {Partial<Lead>} data - Fields to merge into the existing lead
   */
  const updateLead = useCallback((id, data) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, ...data, id } : lead
      )
    );
  }, []);

  /**
   * Permanently removes a lead from state (and therefore localStorage).
   *
   * @param {string} id - ID of the lead to delete
   */
  const deleteLead = useCallback((id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }, []);

  /**
   * Looks up and returns a single lead by ID.
   *
   * @param {string} id - ID to search for
   * @returns {Lead|undefined} The matching lead, or undefined if not found
   */
  const getLeadById = useCallback(
    (id) => leads.find((lead) => lead.id === id),
    [leads]
  );

  /** @type {LeadContextValue} */
  const value = { leads, addLead, updateLead, deleteLead, getLeadById };

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
};

// ─── Custom hook ─────────────────────────────────────────────────────────────

/**
 * Convenience hook that returns the full LeadContext value.
 * Throws a descriptive error when called outside of <LeadProvider>.
 *
 * @returns {LeadContextValue}
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
