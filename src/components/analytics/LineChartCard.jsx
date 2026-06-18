import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { GRID_COLOR, AXIS_COLOR, LINE_COLOR } from '../../constants/analyticsColors';

import { useTheme } from '../../context/ThemeContext';

const LineTooltip = ({ active, payload, label }) => {
  const { isLightMode } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950 light:bg-white border border-slate-700 light:border-slate-200 rounded-xl p-3 shadow-2xl text-xs text-white light:text-slate-900 transition-colors duration-200">
      <p className="font-bold mb-1">{label}</p>
      <p className="text-emerald-400 light:text-emerald-600">{payload[0].value}% Conversion</p>
    </div>
  );
};

/**
 * LineChartCard – monthly conversion rate line chart.
 * @param {{ data: { month: string, Rate: number }[] }} props
 */
const LineChartCard = ({ data = [] }) => {
  const { isLightMode } = useTheme();

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col h-full transition-colors duration-200">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-white light:text-black tracking-wide">Monthly Conversion Rate</h4>
        <p className="text-xs text-slate-500 light:text-slate-400 mt-0.5">Won leads as % of total leads per month</p>
      </div>

      {data.every((d) => d.Rate === 0) ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 light:text-slate-400 text-xs">No conversion data yet</div>
      ) : (
        <div className="h-56 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#E2E8F0' : GRID_COLOR} vertical={false} />
              <XAxis dataKey="month" stroke={isLightMode ? '#94A3B8' : AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis stroke={isLightMode ? '#94A3B8' : AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 11 }}
                     domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<LineTooltip />} />
              <ReferenceLine y={25} stroke="#2563EB" strokeDasharray="4 4" strokeWidth={1}
                             label={{ value: 'Benchmark', fill: isLightMode ? '#64748B' : '#64748B', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="Rate"
                stroke={LINE_COLOR}
                strokeWidth={2.5}
                dot={{ r: 4, fill: LINE_COLOR, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: LINE_COLOR, stroke: isLightMode ? '#FFFFFF' : '#0F172A', strokeWidth: 2 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default React.memo(LineChartCard);
