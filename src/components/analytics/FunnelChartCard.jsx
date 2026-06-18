import React from 'react';
import { STATUS_COLORS } from '../../constants/analyticsColors';

/**
 * FunnelChartCard – custom CSS funnel visualisation showing pipeline stage volumes,
 * conversion rates and drop-offs.
 *
 * @param {{ data: { stage, Volume, convRate, dropRate }[] }} props
 */
const FunnelChartCard = ({ data = [] }) => {
  const maxVol = data[0]?.Volume || 1;

  const STAGE_COLORS = {
    New:       STATUS_COLORS['New'],
    Contacted: STATUS_COLORS['Contacted'],
    Meeting:   STATUS_COLORS['Meeting Scheduled'],
    Proposal:  STATUS_COLORS['Proposal Sent'],
    Won:       STATUS_COLORS['Won'],
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col h-full transition-colors duration-200">
      <div className="mb-5">
        <h4 className="text-sm font-bold text-white light:text-black tracking-wide">Sales Pipeline Funnel</h4>
        <p className="text-xs text-slate-500 light:text-slate-400 mt-0.5">Lead volume at each conversion stage</p>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 light:text-slate-400 text-xs">No data available</div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          {data.map((stage, i) => {
            const color    = STAGE_COLORS[stage.stage] || '#64748B';
            const widthPct = maxVol > 0 ? (stage.Volume / maxVol) * 100 : 0;

            return (
              <div key={stage.stage}>
                {/* Stage row */}
                <div className="flex items-center gap-3 mb-1.5">
                  {/* Label */}
                  <span className="text-xs font-semibold text-slate-300 light:text-slate-650 w-20 shrink-0">{stage.stage}</span>
                  {/* Bar */}
                  <div className="flex-1 h-7 bg-slate-950 light:bg-slate-50 rounded-lg overflow-hidden border border-slate-800 light:border-slate-200 relative">
                    <div
                      className="h-full rounded-lg transition-all duration-700 flex items-center px-3"
                      style={{ width: `${widthPct}%`, backgroundColor: color, minWidth: stage.Volume > 0 ? '2rem' : '0' }}
                    >
                      {stage.Volume > 0 && (
                        <span className="text-[10px] font-bold text-white whitespace-nowrap">{stage.Volume}</span>
                      )}
                    </div>
                  </div>
                  {/* Volume number (fallback) */}
                  <span className="text-xs font-bold text-white light:text-black w-8 text-right shrink-0">{stage.Volume}</span>
                </div>

                {/* Conversion / drop badge */}
                {i > 0 && (
                  <div className="ml-[5.5rem] flex items-center gap-3 mb-1">
                    <span className="text-[10px] text-emerald-400 light:text-emerald-600 font-semibold">
                      ↗ {stage.convRate}% converted
                    </span>
                    <span className="text-[10px] text-red-400 light:text-red-650 font-semibold">
                      ↘ {stage.dropRate}% drop-off
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(FunnelChartCard);
