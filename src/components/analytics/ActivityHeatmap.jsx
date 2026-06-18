import React, { useState } from 'react';
import { HEATMAP_COLORS } from '../../constants/analyticsColors';

import { useTheme } from '../../context/ThemeContext';

/** Day-of-week labels */
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/**
 * ActivityHeatmap – GitHub-style 12-week contribution heatmap.
 * @param {{ data: { date: string, count: number, intensity: number }[] }} props
 */
const ActivityHeatmap = ({ data = [] }) => {
  const { isLightMode } = useTheme();
  const [hovered, setHovered] = useState(null);

  // Chunk into weeks (each week = 7 days)
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const totalActivity = data.reduce((s, d) => s + d.count, 0);

  // Dynamically map intensity colors depending on active theme
  const heatmapColors = isLightMode
    ? ['#E2E8F0', '#DBEAFE', '#93C5FD', '#3B82F6', '#1D4ED8'] // light mode slate -> blue scale
    : HEATMAP_COLORS;

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col h-full transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-white light:text-black tracking-wide">Lead Activity Heatmap</h4>
          <p className="text-xs text-slate-500 light:text-slate-400 mt-0.5">
            {totalActivity} leads created over the last 12 weeks
          </p>
        </div>
        {/* Intensity legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 light:text-slate-400">
          <span>Less</span>
          {heatmapColors.map((c, i) => (
            <span key={i} className="w-3 h-3 rounded-sm inline-block border border-slate-800/10" style={{ backgroundColor: c }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {/* Day labels column */}
          <div className="flex flex-col gap-1 pt-5">
            {DOW.map((d) => (
              <div key={d} className="h-3 text-[9px] text-slate-600 light:text-slate-500 leading-none w-6 flex items-center">{d}</div>
            ))}
          </div>

          {/* Week columns */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {/* Month label on top of first day of each week */}
              <div className="h-4 text-[9px] text-slate-600 light:text-slate-500 leading-none">
                {week[0] && new Date(week[0].date).getDate() <= 7
                  ? new Date(week[0].date).toLocaleString('default', { month: 'short' })
                  : ''}
              </div>
              {week.map((cell) => (
                <div
                  key={cell.date}
                  className="w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125 relative"
                  style={{ backgroundColor: heatmapColors[cell.intensity] }}
                  onMouseEnter={() => setHovered(cell)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Floating tooltip */}
      {hovered && (
        <div className="mt-3 px-3 py-1.5 bg-slate-800 light:bg-white border border-slate-700 light:border-slate-200 rounded-lg text-xs text-slate-200 light:text-slate-800 self-start shadow-md transition-all duration-200">
          <strong>{hovered.date}</strong> — {hovered.count} lead{hovered.count !== 1 ? 's' : ''} created
        </div>
      )}
    </div>
  );
};

export default React.memo(ActivityHeatmap);
