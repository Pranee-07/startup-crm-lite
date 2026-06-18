import React, { useState, useCallback, Suspense } from 'react';
import { BarChart3 } from 'lucide-react';

import useAnalytics from '../hooks/useAnalytics';

// ── Analytics Components ────────────────────────────────────────────────────
import AnalyticsFilters    from '../components/analytics/AnalyticsFilters';
import StatsCards          from '../components/analytics/StatsCards';
import PieChartCard        from '../components/analytics/PieChartCard';
import FunnelChartCard     from '../components/analytics/FunnelChartCard';
import BarChartCard        from '../components/analytics/BarChartCard';
import LineChartCard       from '../components/analytics/LineChartCard';
import RevenueChartCard    from '../components/analytics/RevenueChartCard';
import LeadSourceChart     from '../components/analytics/LeadSourceChart';
import SalesVelocityCard   from '../components/analytics/SalesVelocityCard';
import ForecastCard        from '../components/analytics/ForecastCard';
import ActivityHeatmap     from '../components/analytics/ActivityHeatmap';
import TopPerformersCard   from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton     from '../components/analytics/LoadingSkeleton';

/**
 * Analytics – production-ready analytics dashboard page.
 *
 * Layout:
 *   1. Header  (title + description + date filters)
 *   2. KPI cards (6 tiles)
 *   3. Row: Pie (Status Distribution) | Funnel
 *   4. Row: Bar (Monthly Leads)       | Line (Conversion Rate)
 *   5. Row: Revenue Area Chart        | Lead Source Chart
 *   6. Row: Activity Heatmap          | Top Performers
 *   7. Row: Forecast                  | Sales Velocity
 *
 * @returns {React.JSX.Element}
 */
const Analytics = () => {
  // ── Date-range state lifted here so a single filter change
  //    triggers one recompute via useAnalytics ─────────────────────────────
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const handleRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  const {
    isEmpty,
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
  } = useAnalytics(dateRange);

  // ── Empty state ─────────────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <div className="flex flex-col gap-8">
        <AnalyticsHeader onRangeChange={handleRangeChange} />
        <div className="rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md transition-colors duration-200">
          <EmptyAnalyticsState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. Header ──────────────────────────────────────────────────────── */}
      <AnalyticsHeader onRangeChange={handleRangeChange} />

      {/* ── 2. KPI Summary ─────────────────────────────────────────────────── */}
      <StatsCards
        totalLeads={totalLeads}
        conversionRate={conversionRate}
        pipelineValue={pipelineValue}
        wonRevenue={wonRevenue}
        avgSalesCycle={avgSalesCycle}
        lostRate={lostRate}
      />

      {/* ── 3. Status Distribution + Funnel ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartCard   data={statusDist} />
        <FunnelChartCard data={funnelData} />
      </div>

      {/* ── 4. Monthly Leads + Conversion Rate ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChartCard  data={monthlyLeads} />
        <LineChartCard data={conversionByMonth} />
      </div>

      {/* ── 5. Revenue Trend + Lead Sources ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChartCard data={revenueByMonth} />
        <LeadSourceChart  data={leadSourceStats} />
      </div>

      {/* ── 6. Activity Heatmap + Top Performers ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityHeatmap   data={activityHeatmap} />
        <TopPerformersCard data={topPerformers} />
      </div>

      {/* ── 7. Forecast + Sales Velocity ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ForecastCard
          forecast={forecastRevenue.forecast}
          confidence={forecastRevenue.confidence}
        />
        <SalesVelocityCard velocity={salesVelocity} />
      </div>
    </div>
  );
};

// ─── Sub-component: sticky analytics header ──────────────────────────────────

/**
 * AnalyticsHeader – displays the page title, description, date filters, and
 * a subtle gradient banner.
 */
const AnalyticsHeader = React.memo(({ onRangeChange }) => (
  <div className="relative p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-violet-950 light:from-white light:via-slate-50 light:to-violet-50 border border-slate-800 light:border-slate-200 overflow-hidden shadow-xl transition-all duration-200">
    {/* Ambient glow */}
    <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64
                    bg-violet-500/10 light:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      {/* Title block */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 light:bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <BarChart3 className="w-5 h-5 text-violet-400 light:text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white light:text-slate-900 tracking-tight">Analytics Dashboard</h2>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5 max-w-sm">
            Track sales performance, conversion trends, and revenue growth in real-time.
          </p>
        </div>
      </div>

      {/* Date filters */}
      <div className="shrink-0">
        <AnalyticsFilters onChange={onRangeChange} />
      </div>
    </div>
  </div>
));

export default Analytics;
