import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { GRID_COLOR, AXIS_COLOR, REVENUE_COLOR } from '../../constants/analyticsColors';
import { formatCurrency } from '../../utils/analyticsHelpers';

import { useTheme } from '../../context/ThemeContext';

const RevTooltip = ({ active, payload, label }) => {
  const { isLightMode } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950 light:bg-white border border-slate-700 light:border-slate-200 rounded-xl p-3 shadow-2xl text-xs text-white light:text-slate-900 transition-colors duration-200">
      <p className="font-bold mb-1">{label} Revenue</p>
      <p className="text-emerald-400 light:text-emerald-600">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

/**
 * RevenueChartCard – won revenue area chart with gradient fill.
 * @param {{ data: { month: string, Revenue: number }[] }} props
 */
const RevenueChartCard = ({ data = [] }) => {
  const { isLightMode } = useTheme();

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col h-full transition-colors duration-200">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-white light:text-black tracking-wide">Won Revenue Trend</h4>
        <p className="text-xs text-slate-500 light:text-slate-400 mt-0.5">Monthly revenue from closed-won deals</p>
      </div>

      {data.every((d) => d.Revenue === 0) ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 light:text-slate-400 text-xs">No won revenue yet</div>
      ) : (
        <div className="h-56 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={REVENUE_COLOR} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={REVENUE_COLOR} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#E2E8F0' : GRID_COLOR} vertical={false} />
              <XAxis dataKey="month" stroke={isLightMode ? '#94A3B8' : AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis stroke={isLightMode ? '#94A3B8' : AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 11 }}
                     tickFormatter={(v) => formatCurrency(v)} width={56} />
              <Tooltip content={<RevTooltip />} />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke={REVENUE_COLOR}
                strokeWidth={2.5}
                fill="url(#revGradient)"
                dot={{ r: 4, fill: REVENUE_COLOR, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: REVENUE_COLOR, stroke: isLightMode ? '#FFFFFF' : '#0F172A', strokeWidth: 2 }}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default React.memo(RevenueChartCard);
