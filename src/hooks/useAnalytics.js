import { useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import {
  filterByDateRange,
  getTotalLeads,
  getConversionRate,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
} from '../utils/analyticsHelpers';

/**
 * @typedef {Object} DateRange
 * @property {Date|null} from
 * @property {Date|null} to
 */

/**
 * @typedef {Object} AnalyticsData
 * @property {Lead[]}   filteredLeads      - Leads after date-range filter
 * @property {number}   totalLeads
 * @property {number}   conversionRate     - 0–1 decimal
 * @property {number}   pipelineValue
 * @property {number}   wonRevenue
 * @property {number}   avgSalesCycle      - days
 * @property {number}   lostRate           - 0–1 decimal
 * @property {object[]} statusDist
 * @property {object[]} monthlyLeads
 * @property {object[]} conversionByMonth
 * @property {object[]} revenueByMonth
 * @property {object[]} leadSourceStats
 * @property {object[]} funnelData
 * @property {number}   salesVelocity      - currency per day
 * @property {{ forecast: number, confidence: number }} forecastRevenue
 * @property {object[]} topPerformers
 * @property {object[]} activityHeatmap
 * @property {boolean}  isEmpty
 */

/**
 * Master analytics hook.
 * Derives every dashboard metric from the LeadContext with memoised selectors
 * so nothing recomputes unless filteredLeads actually changes.
 *
 * @param {DateRange} [dateRange] - Optional date window; pass { from, to }
 * @returns {AnalyticsData}
 */
const useAnalytics = (dateRange = { from: null, to: null }) => {
  const { leads } = useLeads();

  /** Apply date filter once; all downstream calculations use this slice */
  const filteredLeads = useMemo(
    () => filterByDateRange(leads, dateRange.from, dateRange.to),
    [leads, dateRange.from, dateRange.to]
  );

  const totalLeads       = useMemo(() => getTotalLeads(filteredLeads),        [filteredLeads]);
  const conversionRate   = useMemo(() => getConversionRate(filteredLeads),    [filteredLeads]);
  const pipelineValue    = useMemo(() => getPipelineValue(filteredLeads),     [filteredLeads]);
  const wonRevenue       = useMemo(() => getWonRevenue(filteredLeads),        [filteredLeads]);
  const avgSalesCycle    = useMemo(() => getAverageSalesCycle(filteredLeads), [filteredLeads]);
  const lostRate         = useMemo(() => getLostRate(filteredLeads),          [filteredLeads]);
  const statusDist       = useMemo(() => getStatusDistribution(filteredLeads),[filteredLeads]);
  const monthlyLeads     = useMemo(() => getMonthlyLeads(filteredLeads),      [filteredLeads]);
  const conversionByMonth= useMemo(() => getConversionByMonth(filteredLeads), [filteredLeads]);
  const revenueByMonth   = useMemo(() => getRevenueByMonth(filteredLeads),    [filteredLeads]);
  const leadSourceStats  = useMemo(() => getLeadSourceStats(filteredLeads),   [filteredLeads]);
  const funnelData       = useMemo(() => getFunnelData(filteredLeads),        [filteredLeads]);
  const salesVelocity    = useMemo(() => getSalesVelocity(filteredLeads),     [filteredLeads]);
  const forecastRevenue  = useMemo(() => getForecastRevenue(filteredLeads),   [filteredLeads]);
  const topPerformers    = useMemo(() => getTopPerformers(filteredLeads),     [filteredLeads]);
  const activityHeatmap  = useMemo(() => getActivityHeatmapData(leads),       [leads]); // heatmap always uses all-time

  return {
    filteredLeads,
    totalLeads,
    conversionRate,
    pipelineValue,
    wonRevenue,
    avgSalesCycle,
    lostRate,
    statusDist,
    monthlyLeads,
    conversionByMonth,
    revenueByMonth,
    leadSourceStats,
    funnelData,
    salesVelocity,
    forecastRevenue,
    topPerformers,
    activityHeatmap,
    isEmpty: leads.length === 0,
  };
};

export default useAnalytics;
