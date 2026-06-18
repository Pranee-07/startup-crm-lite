import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/analyticsHelpers';

/**
 * ForecastCard – next-month revenue prediction with confidence score.
 * @param {{ forecast: number, confidence: number }} props
 */
const ForecastCard = ({ forecast = 0, confidence = 0 }) => {
  const confColor =
    confidence >= 70 ? 'text-emerald-400 light:text-emerald-600' :
    confidence >= 40 ? 'text-amber-400 light:text-amber-650'   :
                       'text-slate-500 light:text-slate-400';

  const barColor =
    confidence >= 70 ? 'bg-emerald-500' :
    confidence >= 40 ? 'bg-amber-500'   :
                       'bg-slate-600';

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col justify-between h-full transition-colors duration-200">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white light:text-black tracking-wide">Revenue Forecast</h4>
            <p className="text-xs text-slate-500 light:text-slate-400 mt-0.5">Predicted revenue — next month</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-violet-500/15 light:bg-violet-500/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-400 light:text-violet-600" />
          </div>
        </div>

        <p className="text-3xl font-bold text-white light:text-black mt-4">
          {forecast > 0 ? formatCurrency(forecast) : '—'}
        </p>
        <p className="text-xs text-slate-500 light:text-slate-400 mt-2">
          Based on 6-month trailing average with linear trend projection
        </p>
      </div>

      {/* Confidence meter */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-400 light:text-slate-500 font-medium">Confidence Score</span>
          <span className={`text-xs font-bold ${confColor}`}>{confidence}%</span>
        </div>
        <div className="h-2 bg-slate-800 light:bg-slate-100 rounded-full overflow-hidden border border-slate-700 light:border-slate-200">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-700`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-600 light:text-slate-500 mt-1.5 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
          {confidence >= 70
            ? 'High confidence — sufficient historical data'
            : confidence >= 40
            ? 'Medium confidence — add more won deals for accuracy'
            : 'Low confidence — need more historical data'}
        </p>
      </div>
    </div>
  );
};

export default React.memo(ForecastCard);
