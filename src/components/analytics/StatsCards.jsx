import React from 'react';
import {
  Users, Target, DollarSign, TrendingUp, Clock, XCircle,
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/analyticsHelpers';

/**
 * Individual KPI card – memoised to avoid re-renders when sibling cards change.
 */
const KpiCard = React.memo(({
  icon: Icon, label, value, sub,
  trend, trendLabel, accentColor,
}) => {
  const trendCls =
    trend > 0 ? 'text-emerald-400 light:text-emerald-600' :
    trend < 0 ? 'text-red-400 light:text-red-600'     :
                'text-slate-400 light:text-slate-500';

  const TrendArrow = trend > 0 ? '↑' : trend < 0 ? '↓' : '—';

  return (
    <div
      className="relative p-5 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200
                 hover:border-slate-700 light:hover:border-slate-350 shadow-sm hover:shadow-md transition-all duration-200
                 overflow-hidden group"
    >
      {/* Ambient glow that appears on hover */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl
                   opacity-0 group-hover:opacity-20 light:group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold text-slate-400 light:text-slate-500 uppercase tracking-widest leading-tight">
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accentColor}22` }}
        >
          <Icon className="w-4 h-4" style={{ color: accentColor }} />
        </div>
      </div>

      {/* Primary value */}
      <p className="text-2xl font-extrabold text-white light:text-black tracking-tight">{value}</p>

      {/* Sub-label */}
      {sub && <p className="text-[10px] text-slate-500 light:text-slate-400 mt-1 leading-snug">{sub}</p>}

      {/* Trend indicator */}
      {trendLabel !== undefined && (
        <p className={`mt-3 text-xs font-semibold flex items-center gap-1 ${trendCls}`}>
          <span>{TrendArrow}</span>
          <span>{trendLabel}</span>
        </p>
      )}
    </div>
  );
});

/**
 * StatsCards – renders six KPI tiles from useAnalytics metrics.
 *
 * @param {{
 *   totalLeads:       number,
 *   conversionRate:   number,
 *   pipelineValue:    number,
 *   wonRevenue:       number,
 *   avgSalesCycle:    number,
 *   lostRate:         number,
 * }} props
 */
const StatsCards = ({
  totalLeads,
  conversionRate,
  pipelineValue,
  wonRevenue,
  avgSalesCycle,
  lostRate,
}) => {
  /** @type {Parameters<typeof KpiCard>[0][]} */
  const cards = [
    {
      icon:        Users,
      label:       'Total Leads',
      value:       totalLeads.toLocaleString(),
      sub:         'All pipeline entries',
      trend:       totalLeads > 0 ? 1 : 0,
      trendLabel:  totalLeads > 0 ? 'Active tracking' : 'No leads yet',
      accentColor: '#2563EB',
    },
    {
      icon:        Target,
      label:       'Conversion Rate',
      value:       formatPercent(conversionRate),
      sub:         'Won ÷ Total leads',
      trend:       conversionRate > 0.25 ? 1 : conversionRate > 0 ? 0 : -1,
      trendLabel:  conversionRate > 0.25 ? 'Above 25% benchmark' : 'Below benchmark',
      accentColor: '#22C55E',
    },
    {
      icon:        DollarSign,
      label:       'Pipeline Value',
      value:       formatCurrency(pipelineValue),
      sub:         'Sum of active deals',
      trend:       pipelineValue > 0 ? 1 : 0,
      trendLabel:  'Current active value',
      accentColor: '#7C3AED',
    },
    {
      icon:        TrendingUp,
      label:       'Won Revenue',
      value:       formatCurrency(wonRevenue),
      sub:         'Closed-won deals total',
      trend:       wonRevenue > 0 ? 1 : 0,
      trendLabel:  wonRevenue > 0 ? 'Revenue realised' : 'No won deals yet',
      accentColor: '#22C55E',
    },
    {
      icon:        Clock,
      label:       'Avg Sales Cycle',
      value:       avgSalesCycle > 0 ? `${avgSalesCycle} days` : '—',
      sub:         'Created → Won duration',
      trend:       avgSalesCycle > 0 && avgSalesCycle < 30 ? 1 : -1,
      trendLabel:  avgSalesCycle > 0 && avgSalesCycle < 30 ? 'Fast cycle' : 'Lengthy cycle',
      accentColor: '#F59E0B',
    },
    {
      icon:        XCircle,
      label:       'Lost Rate',
      value:       formatPercent(lostRate),
      sub:         'Lost ÷ Total leads',
      trend:       lostRate < 0.2 ? 1 : -1,
      trendLabel:  lostRate < 0.2 ? 'Under control' : 'Needs attention',
      accentColor: '#EF4444',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default React.memo(StatsCards);
