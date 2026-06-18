import React, { useState, useCallback } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

import { useTheme } from '../../context/ThemeContext';

/** Custom tooltip */
const PieTooltip = ({ active, payload }) => {
  const { isLightMode } = useTheme();
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  const pct = p.pct;
  return (
    <div className="bg-slate-950 light:bg-white border border-slate-700 light:border-slate-200 rounded-xl p-3 shadow-2xl text-xs text-white light:text-slate-900 transition-colors duration-200">
      <p className="font-bold mb-1">{name}</p>
      <p className="text-slate-300 light:text-slate-600">{value} Leads</p>
      <p className="text-slate-400 light:text-slate-500">{pct}%</p>
    </div>
  );
};

/** Custom centre label rendered as SVG text */
const CentreLabel = ({ cx, cy, total }) => {
  const { isLightMode } = useTheme();
  return (
    <>
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="central"
            className="fill-white light:fill-slate-800 text-2xl font-bold" style={{ fontSize: 26, fontWeight: 700, fill: isLightMode ? '#0F172A' : '#FFFFFF' }}>
        {total}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 11, fill: isLightMode ? '#64748B' : '#94A3B8' }}>
        Total Leads
      </text>
    </>
  );
};

/**
 * PieChartCard – doughnut chart showing status distribution.
 * @param {{ data: { name, value, color }[] }} props
 */
const PieChartCard = ({ data = [] }) => {
  const { isLightMode } = useTheme();
  const [activeIdx, setActiveIdx] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);

  // Add pct to each entry for tooltip
  const enriched = data.map((d) => ({ ...d, pct: total ? Math.round((d.value / total) * 100) : 0 }));

  const onEnter = useCallback((_, idx) => setActiveIdx(idx), []);
  const onLeave = useCallback(()      => setActiveIdx(null),  []);

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col h-full transition-colors duration-200">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-white light:text-black tracking-wide">Lead Status Distribution</h4>
        <p className="text-xs text-slate-500 light:text-slate-400 mt-0.5">Breakdown of leads across pipeline stages</p>
      </div>

      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 light:text-slate-400 text-xs">No data available</div>
      ) : (
        <>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enriched}
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="80%"
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  onMouseEnter={onEnter}
                  onMouseLeave={onLeave}
                >
                  {enriched.map((entry, idx) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      opacity={activeIdx === null || activeIdx === idx ? 1 : 0.4}
                      stroke="transparent"
                      style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {enriched.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300 light:text-slate-700 font-medium">{d.name}</span>
                </div>
                <span className="text-slate-400 light:text-slate-550">{d.value} <span className="text-slate-600 light:text-slate-400">({d.pct}%)</span></span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(PieChartCard);
