import React from 'react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsHelpers';

/**
 * SalesVelocityCard – displays daily revenue velocity with a trend badge.
 * @param {{ velocity: number }} props
 */
const SalesVelocityCard = ({ velocity = 0 }) => {
  const isPositive = velocity > 0;
  const TrendIcon  = isPositive ? TrendingUp : TrendingDown;
  const trendCls   = isPositive ? 'text-emerald-400 light:text-emerald-600' : 'text-slate-500 light:text-slate-400';

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col justify-between h-full transition-colors duration-200">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white light:text-black tracking-wide">Sales Velocity</h4>
            <p className="text-xs text-slate-500 light:text-slate-400 mt-0.5">Revenue generated per day</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 light:bg-amber-500/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400 light:text-amber-600" />
          </div>
        </div>

        <p className="text-3xl font-bold text-white light:text-black mt-4">
          {velocity > 0 ? `${formatCurrency(velocity)}/day` : '—'}
        </p>

        <p className="text-xs text-slate-500 light:text-slate-400 mt-2">
          Formula: (Opportunities × Win Rate × Avg Deal) ÷ Cycle Length
        </p>
      </div>

      <div className={`flex items-center gap-2 mt-6 text-xs font-semibold ${trendCls}`}>
        <TrendIcon className="w-4 h-4" />
        {isPositive ? 'Active pipeline generating revenue' : 'No active deals yet'}
      </div>
    </div>
  );
};

export default React.memo(SalesVelocityCard);
