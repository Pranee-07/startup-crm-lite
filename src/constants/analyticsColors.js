/**
 * Canonical color tokens for analytics charts.
 * All chart components import from here so palette changes propagate everywhere.
 */

/** Status-to-hex color map matching the CRM pipeline stages */
export const STATUS_COLORS = {
  New:                '#94A3B8', // slate-400
  Contacted:          '#2563EB', // blue-600
  'Meeting Scheduled':'#F59E0B', // amber-500  (also labelled "Meeting" in charts)
  'Proposal Sent':    '#7C3AED', // violet-600 (also labelled "Proposal" in charts)
  Won:                '#22C55E', // green-500
  Lost:               '#EF4444', // red-500
};

/** Shortened display labels for each status (used in charts/legends) */
export const STATUS_LABELS = {
  New:                'New',
  Contacted:          'Contacted',
  'Meeting Scheduled':'Meeting',
  'Proposal Sent':    'Proposal',
  Won:                'Won',
  Lost:               'Lost',
};

/** Ordered funnel stages for pipeline visualisations */
export const FUNNEL_STAGES = [
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
];

/** Source colors used in the LeadSourceChart */
export const SOURCE_COLORS = [
  '#2563EB', // LinkedIn
  '#22C55E', // Referral
  '#F59E0B', // Website
  '#7C3AED', // Cold Call
  '#EC4899', // Email Campaign
  '#94A3B8', // Other
];

/** Heatmap intensity stops (0 = empty, 4 = most active) */
export const HEATMAP_COLORS = [
  '#1E293B', // 0 – no activity   (slate-800)
  '#1e3a5f', // 1 – low
  '#1d4ed8', // 2 – medium        (blue-700)
  '#2563EB', // 3 – high          (blue-600)
  '#60A5FA', // 4 – very high     (blue-400)
];

/** Chart grid / axis color */
export const GRID_COLOR  = '#1E293B';
/** Chart axis tick color */
export const AXIS_COLOR  = '#64748B';
/** Revenue chart gradient start */
export const REVENUE_COLOR = '#22C55E';
/** Bar chart primary color */
export const BAR_COLOR     = '#2563EB';
/** Line chart primary color */
export const LINE_COLOR    = '#22C55E';
