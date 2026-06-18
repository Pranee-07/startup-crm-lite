import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { GRID_COLOR, AXIS_COLOR, BAR_COLOR } from '../../constants/analyticsColors';

import { useTheme } from '../../context/ThemeContext';

const BarTooltip = ({ active, payload, label }) => {
  const { isLightMode } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950 light:bg-white border border-slate-700 light:border-slate-200 rounded-xl p-3 shadow-2xl text-xs text-white light:text-slate-900 transition-colors duration-200">
      <p className="font-bold mb-1">{label}</p>
      <p className="text-blue-400 light:text-blue-600">{payload[0].value} Leads</p>
    </div>
  );
};

/**
 * BarChartCard – monthly lead count bar chart (last 6 months).
 * @param {{ data: { month: string, Leads: number }[] }} props
 */
const BarChartCard = ({ data = [] }) => {
  const { isLightMode } = useTheme();

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col h-full transition-colors duration-200">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-white light:text-black tracking-wide">Monthly Lead Volume</h4>
        <p className="text-xs text-slate-500 light:text-slate-400 mt-0.5">New leads created per month</p>
      </div>

      {data.every((d) => d.Leads === 0) ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 light:text-slate-400 text-xs">No data for this period</div>
      ) : (
        <div className="h-56 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#E2E8F0' : GRID_COLOR} vertical={false} />
              <XAxis dataKey="month" stroke={isLightMode ? '#94A3B8' : AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis stroke={isLightMode ? '#94A3B8' : AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: isLightMode ? '#F1F5F9' : '#1E293B', opacity: isLightMode ? 0.6 : 0.4, rx: 6 }} />
              <Bar dataKey="Leads" radius={[6, 6, 0, 0]} animationDuration={800}>
                {data.map((_, i) => (
                  <Cell key={i} fill={BAR_COLOR} className="hover:opacity-80 transition-opacity" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default React.memo(BarChartCard);
