import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsHelpers';

/** Medal icon per rank */
const RankBadge = ({ rank }) => {
  if (rank === 1) return <span className="text-amber-400 text-base">🥇</span>;
  if (rank === 2) return <span className="text-slate-300 text-base">🥈</span>;
  if (rank === 3) return <span className="text-amber-600 text-base">🥉</span>;
  return <span className="text-xs font-bold text-slate-500 light:text-slate-450 w-5 text-center">#{rank}</span>;
};

/**
 * TopPerformersCard – ranked list of sales reps by won revenue.
 * @param {{ data: { owner: string, revenue: number, deals: number }[] }} props
 */
const TopPerformersCard = ({ data = [] }) => {
  const maxRev = data[0]?.revenue || 1;

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col h-full transition-colors duration-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h4 className="text-sm font-bold text-white light:text-black tracking-wide">Top Performers</h4>
          <p className="text-xs text-slate-500 light:text-slate-400 mt-0.5">Ranked by closed-won revenue</p>
        </div>
        <Trophy className="w-5 h-5 text-amber-400" />
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 light:text-slate-400 text-xs">
          No won deals assigned to owners yet
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-1">
          {data.slice(0, 5).map((rep, i) => {
            const barPct = maxRev > 0 ? (rep.revenue / maxRev) * 100 : 0;
            return (
              <div key={rep.owner} className="flex items-center gap-3">
                {/* Rank badge */}
                <div className="w-6 flex items-center justify-center shrink-0">
                  <RankBadge rank={i + 1} />
                </div>

                {/* Avatar initial */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                     style={{ backgroundColor: ['#2563EB','#22C55E','#7C3AED','#F59E0B','#EF4444'][i % 5] }}>
                  {rep.owner.charAt(0).toUpperCase()}
                </div>

                {/* Name + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-200 light:text-black truncate">{rep.owner}</span>
                    <span className="text-xs font-bold text-white light:text-black ml-2 shrink-0">{formatCurrency(rep.revenue)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 light:bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${barPct}%`,
                        backgroundColor: ['#2563EB','#22C55E','#7C3AED','#F59E0B','#EF4444'][i % 5],
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 light:text-slate-400 mt-0.5">{rep.deals} deal{rep.deals !== 1 ? 's' : ''} won</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(TopPerformersCard);
