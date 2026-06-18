import { STATUS_COLORS } from '../constants/analyticsColors';

/**
 * analyticsHelpers.js
 *
 * Pure utility functions for deriving analytics metrics from a leads array.
 * All functions are side-effect free and safe to wrap in useMemo().
 *
 * Lead shape expected:
 * {
 *   id, name, company, email, phone,
 *   status: 'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost',
 *   source: 'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other',
 *   value?: number,
 *   createdAt: ISO string,
 *   owner?: string,
 * }
 */

import { FUNNEL_STAGES, STATUS_LABELS } from '../constants/analyticsColors';

// ─── Date helpers ────────────────────────────────────────────────────────────

/** Returns a Date object; null if the value is falsy / invalid */
const toDate = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Returns the ISO month string 'YYYY-MM' for a given date value.
 * @param {string|Date} val
 * @returns {string}
 */
const toMonthKey = (val) => {
  const d = toDate(val);
  if (!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/** Short month labels e.g. 'Jan', 'Feb' ... */
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * Builds an array of the last N calendar months (including current),
 * each as { key: 'YYYY-MM', label: 'Mon YY' }.
 * @param {number} n
 * @returns {{ key: string, label: string }[]}
 */
const lastNMonths = (n = 6) => {
  const result = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: `${MONTH_NAMES[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`,
    });
  }
  return result;
};

/** Numeric lead value, defaulting to 0 */
const numVal = (lead) => {
  if (!lead) return 0;
  if (typeof lead.value === 'number') return lead.value;
  if (typeof lead.value === 'string') return parseFloat(lead.value.replace(/[^0-9.-]/g, '')) || 0;
  return 0;
};

// ─── Date range filter ────────────────────────────────────────────────────────

/**
 * Filters leads by a date range applied to createdAt.
 * @param {Lead[]} leads
 * @param {Date|null} from
 * @param {Date|null} to
 * @returns {Lead[]}
 */
export const filterByDateRange = (leads = [], from = null, to = null) => {
  if (!from && !to) return leads;
  return leads.filter((l) => {
    const d = toDate(l.createdAt);
    if (!d) return false;
    if (from && d < from) return false;
    if (to   && d > to  ) return false;
    return true;
  });
};

// ─── KPI helpers ─────────────────────────────────────────────────────────────

/**
 * Total number of leads.
 * @param {Lead[]} leads
 * @returns {number}
 */
export const getTotalLeads = (leads = []) => leads.length;

/**
 * Conversion rate as a decimal (0–1).
 * @param {Lead[]} leads
 * @returns {number}
 */
export const getConversionRate = (leads = []) => {
  if (!leads.length) return 0;
  const won = leads.filter((l) => l.status === 'Won').length;
  return won / leads.length;
};

/**
 * Sum of all active (non-Lost) lead values.
 * @param {Lead[]} leads
 * @returns {number}
 */
export const getPipelineValue = (leads = []) =>
  leads
    .filter((l) => l.status !== 'Lost')
    .reduce((sum, l) => sum + numVal(l), 0);

/**
 * Sum of Won lead values.
 * @param {Lead[]} leads
 * @returns {number}
 */
export const getWonRevenue = (leads = []) =>
  leads
    .filter((l) => l.status === 'Won')
    .reduce((sum, l) => sum + numVal(l), 0);

/**
 * Average sales cycle in days (createdAt → wonAt or createdAt).
 * Falls back to createdAt-only leads for a rough estimate.
 * @param {Lead[]} leads
 * @returns {number}
 */
export const getAverageSalesCycle = (leads = []) => {
  const won = leads.filter((l) => l.status === 'Won' && l.wonAt && l.createdAt);
  if (!won.length) {
    // rough estimate: days from first to last created lead
    const dates = leads.map((l) => toDate(l.createdAt)).filter(Boolean);
    if (dates.length < 2) return 0;
    const span = Math.max(...dates) - Math.min(...dates);
    return Math.round(span / 86_400_000);
  }
  const total = won.reduce((sum, l) => {
    const s = toDate(l.createdAt);
    const e = toDate(l.wonAt);
    return sum + (e && s ? (e - s) / 86_400_000 : 0);
  }, 0);
  return Math.round(total / won.length);
};

/**
 * Lost rate as a decimal (0–1).
 * @param {Lead[]} leads
 * @returns {number}
 */
export const getLostRate = (leads = []) => {
  if (!leads.length) return 0;
  return leads.filter((l) => l.status === 'Lost').length / leads.length;
};

// ─── Chart data helpers ────────────────────────────────────────────────────────

/**
 * Distribution of leads by status for the pie/doughnut chart.
 * @param {Lead[]} leads
 * @returns {{ name: string, value: number, color: string }[]}
 */
export const getStatusDistribution = (leads = []) => {
  const counts = {};
  leads.forEach((l) => {
    const key = l.status || 'Unknown';
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([status, count]) => ({
      name:  STATUS_LABELS[status] || status,
      value: count,
      color: STATUS_COLORS[status] || '#64748B',
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Monthly lead counts for the bar chart (last 6 months).
 * @param {Lead[]} leads
 * @returns {{ month: string, Leads: number }[]}
 */
export const getMonthlyLeads = (leads = []) => {
  const months = lastNMonths(6);
  const map = {};
  leads.forEach((l) => {
    const k = toMonthKey(l.createdAt);
    map[k] = (map[k] || 0) + 1;
  });
  return months.map(({ key, label }) => ({ month: label, Leads: map[key] || 0 }));
};

/**
 * Monthly conversion rates for the line chart (last 6 months).
 * @param {Lead[]} leads
 * @returns {{ month: string, Rate: number }[]}
 */
export const getConversionByMonth = (leads = []) => {
  const months = lastNMonths(6);
  return months.map(({ key, label }) => {
    const monthLeads = leads.filter((l) => toMonthKey(l.createdAt) === key);
    const won = monthLeads.filter((l) => l.status === 'Won').length;
    const rate = monthLeads.length ? Math.round((won / monthLeads.length) * 100) : 0;
    return { month: label, Rate: rate };
  });
};

/**
 * Monthly Won revenue for the area chart (last 6 months).
 * @param {Lead[]} leads
 * @returns {{ month: string, Revenue: number }[]}
 */
export const getRevenueByMonth = (leads = []) => {
  const months = lastNMonths(6);
  return months.map(({ key, label }) => {
    const revenue = leads
      .filter((l) => l.status === 'Won' && toMonthKey(l.wonAt || l.createdAt) === key)
      .reduce((sum, l) => sum + numVal(l), 0);
    return { month: label, Revenue: revenue };
  });
};

/**
 * Lead counts grouped by source, sorted descending.
 * @param {Lead[]} leads
 * @returns {{ source: string, Count: number }[]}
 */
export const getLeadSourceStats = (leads = []) => {
  const map = {};
  leads.forEach((l) => {
    const k = l.source || 'Other';
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map)
    .map(([source, Count]) => ({ source, Count }))
    .sort((a, b) => b.Count - a.Count);
};

/**
 * Funnel data showing volume at each pipeline stage (only forward stages, not Lost).
 * @param {Lead[]} leads
 * @returns {{ stage: string, Volume: number, convRate: number, dropRate: number }[]}
 */
export const getFunnelData = (leads = []) => {
  const STAGE_ORDER = ['New','Contacted','Meeting Scheduled','Proposal Sent','Won'];
  const SHORT       = ['New','Contacted','Meeting','Proposal','Won'];

  // Count leads that have REACHED each stage (i.e. their current status is ≥ the stage)
  const reached = STAGE_ORDER.map((stage) => {
    const idx = STAGE_ORDER.indexOf(stage);
    return leads.filter((l) => {
      const li = STAGE_ORDER.indexOf(l.status);
      return li >= idx;
    }).length;
  });

  return STAGE_ORDER.map((stage, i) => {
    const volume   = reached[i];
    const prev     = i === 0 ? volume : reached[i - 1];
    const convRate = prev > 0 ? Math.round((volume / prev) * 100) : 0;
    const dropRate = 100 - convRate;
    return { stage: SHORT[i], Volume: volume, convRate, dropRate };
  });
};

/**
 * Sales velocity in currency per day.
 * Formula: (Opportunities × WinRate × AvgDealSize) / CycleLength
 * @param {Lead[]} leads
 * @returns {number}
 */
export const getSalesVelocity = (leads = []) => {
  const active = leads.filter((l) => l.status !== 'Lost');
  const ops     = active.length;
  const winRate = getConversionRate(leads);
  const avg     = ops > 0 ? getPipelineValue(leads) / ops : 0;
  const cycle   = getAverageSalesCycle(leads) || 30;
  if (cycle === 0) return 0;
  return Math.round((ops * winRate * avg) / cycle);
};

/**
 * Forecasted revenue for next month based on avg of last 6 months' Won revenue.
 * @param {Lead[]} leads
 * @returns {{ forecast: number, confidence: number }}
 */
export const getForecastRevenue = (leads = []) => {
  const monthly = getRevenueByMonth(leads);
  const values  = monthly.map((m) => m.Revenue);
  const nonZero = values.filter((v) => v > 0);
  if (!nonZero.length) return { forecast: 0, confidence: 0 };
  const avg = nonZero.reduce((s, v) => s + v, 0) / nonZero.length;

  // Simple linear trend (slope of last vs first non-zero)
  const slope  = nonZero.length > 1 ? (nonZero[nonZero.length - 1] - nonZero[0]) / nonZero.length : 0;
  const forecast = Math.max(0, Math.round(avg + slope));

  // Confidence: higher data coverage = higher confidence (max 95%)
  const confidence = Math.min(95, Math.round((nonZero.length / 6) * 100));
  return { forecast, confidence };
};

/**
 * Ranks sales reps by Won revenue.
 * @param {Lead[]} leads
 * @returns {{ owner: string, revenue: number, deals: number }[]}
 */
export const getTopPerformers = (leads = []) => {
  const map = {};
  leads
    .filter((l) => l.status === 'Won' && l.owner)
    .forEach((l) => {
      if (!map[l.owner]) map[l.owner] = { owner: l.owner, revenue: 0, deals: 0 };
      map[l.owner].revenue += numVal(l);
      map[l.owner].deals   += 1;
    });
  return Object.values(map).sort((a, b) => b.revenue - a.revenue);
};

/**
 * Builds a 12-week activity heatmap (GitHub-style).
 * Returns an array of 84 cells { date, count, intensity: 0-4 }.
 * @param {Lead[]} leads
 * @returns {{ date: string, count: number, intensity: number }[]}
 */
export const getActivityHeatmapData = (leads = []) => {
  const map = {};
  leads.forEach((l) => {
    const d = toDate(l.createdAt);
    if (!d) return;
    const key = d.toISOString().slice(0, 10);
    map[key] = (map[key] || 0) + 1;
  });

  const today   = new Date();
  const cells   = [];
  const maxDays = 84; // 12 weeks

  for (let i = maxDays - 1; i >= 0; i--) {
    const d   = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = map[key] || 0;
    // Map count → intensity 0-4
    const intensity = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;
    cells.push({ date: key, count, intensity });
  }
  return cells;
};

/**
 * Formats a number as a compact currency string.
 * e.g. 120000 → '₹1.2L'  |  4800 → '₹4.8K'
 * @param {number} val
 * @param {string} [symbol='₹']
 * @returns {string}
 */
export const formatCurrency = (val = 0, symbol = '₹') => {
  if (val >= 1_00_00_000) return `${symbol}${(val / 1_00_00_000).toFixed(1)}Cr`;
  if (val >= 1_00_000)    return `${symbol}${(val / 1_00_000).toFixed(1)}L`;
  if (val >= 1_000)       return `${symbol}${(val / 1_000).toFixed(1)}K`;
  return `${symbol}${val.toLocaleString('en-IN')}`;
};

/**
 * Formats a percentage (0–1 decimal) as a string e.g. 0.31 → '31%'
 * @param {number} rate
 * @returns {string}
 */
export const formatPercent = (rate = 0) => `${Math.round(rate * 100)}%`;
