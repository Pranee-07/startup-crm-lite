import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { SOURCE_COLORS, GRID_COLOR, AXIS_COLOR } from '../../constants/analyticsColors';

import { useTheme } from '../../context/ThemeContext';

const SrcTooltip = ({ active, payload }) => {
  const { isLightMode } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950 light:bg-white border border-slate-700 light:border-slate-200 rounded-xl p-3 shadow-2xl text-xs text-white light:text-slate-900 transition-colors duration-200">
      <p className="font-bold mb-1">{payload[0].payload.source}</p>
      <p style={{ color: payload[0].fill }}>{payload[0].value} Leads</p>
    </div>
  );
};

/**
 * LeadSourceChart – horizontal bar chart of lead counts by acquisition channel.
 * @param {{ data: { source: string, Count: number }[] }} props
 */
const LeadSourceChart = ({ data = [] }) => {
  const { isLightMode } = useTheme();

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col h-full transition-colors duration-200">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-white light:text-black tracking-wide">Lead Acquisition Channels</h4>
        <p className="text-xs text-slate-500 light:text-slate-400 mt-0.5">Lead volume by source, sorted by performance</p>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 light:text-slate-400 text-xs">No source data available</div>
      ) : (
        <div className="h-56 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#E2E8F0' : GRID_COLOR} horizontal={false} />
              <XAxis type="number" stroke={isLightMode ? '#94A3B8' : AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="source" stroke={isLightMode ? '#94A3B8' : AXIS_COLOR} tickLine={false} axisLine={false}
                     tick={{ fontSize: 11 }} width={88} />
              <Tooltip content={<SrcTooltip />} cursor={{ fill: isLightMode ? '#F1F5F9' : '#1E293B', opacity: isLightMode ? 0.6 : 0.4, rx: 6 }} />
              <Bar dataKey="Count" radius={[0, 6, 6, 0]} animationDuration={800}>
                {data.map((_, i) => (
                  <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default React.memo(LeadSourceChart);
