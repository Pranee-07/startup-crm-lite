import React, { useState, useCallback } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

/**
 * @typedef {Object} FilterOption
 * @property {string} label  - Display label
 * @property {string} value  - Machine-readable key
 * @property {() => { from: Date|null, to: Date|null }} range - Returns the date window
 */

const now = () => new Date();

/** Pre-defined range definitions */
const OPTIONS = [
  {
    label: 'Last 7 Days',
    value: '7d',
    range: () => { const to = now(); const from = new Date(to); from.setDate(from.getDate() - 7); return { from, to }; },
  },
  {
    label: 'Last 30 Days',
    value: '30d',
    range: () => { const to = now(); const from = new Date(to); from.setDate(from.getDate() - 30); return { from, to }; },
  },
  {
    label: 'Last 90 Days',
    value: '90d',
    range: () => { const to = now(); const from = new Date(to); from.setDate(from.getDate() - 90); return { from, to }; },
  },
  {
    label: 'This Year',
    value: 'year',
    range: () => { const to = now(); const from = new Date(to.getFullYear(), 0, 1); return { from, to }; },
  },
  {
    label: 'All Time',
    value: 'all',
    range: () => ({ from: null, to: null }),
  },
];

/**
 * AnalyticsFilters – date range pill selector + optional custom range inputs.
 *
 * @param {{ onChange: (range: { from: Date|null, to: Date|null }) => void }} props
 */
const AnalyticsFilters = ({ onChange }) => {
  const [active, setActive]       = useState('all');
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo,   setCustomTo  ] = useState('');

  const handleSelect = useCallback((opt) => {
    setActive(opt.value);
    setShowCustom(opt.value === 'custom');
    if (opt.value !== 'custom') {
      onChange(opt.range());
    }
  }, [onChange]);

  const applyCustom = useCallback(() => {
    onChange({
      from: customFrom ? new Date(customFrom) : null,
      to:   customTo   ? new Date(customTo)   : null,
    });
  }, [customFrom, customTo, onChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Preset pills */}
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-150 cursor-pointer
              ${active === opt.value
                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 light:bg-white border-slate-700 light:border-slate-200 text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900 hover:border-slate-600 light:hover:border-slate-350'
              }`}
          >
            {opt.label}
          </button>
        ))}

        {/* Custom range toggle */}
        <button
          onClick={() => { setActive('custom'); setShowCustom((p) => !p); }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-150 cursor-pointer
            ${active === 'custom'
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-slate-900 light:bg-white border-slate-700 light:border-slate-200 text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900 hover:border-slate-600 light:hover:border-slate-350'
            }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Custom
          <ChevronDown className={`w-3 h-3 transition-transform ${showCustom ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Custom date pickers (visible only when custom is selected) */}
      {showCustom && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="text-xs bg-slate-900 light:bg-white border border-slate-700 light:border-slate-200 text-slate-200 light:text-slate-900 rounded-xl px-3 py-1.5
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <span className="text-xs text-slate-500 light:text-slate-400">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="text-xs bg-slate-900 light:bg-white border border-slate-700 light:border-slate-200 text-slate-200 light:text-slate-900 rounded-xl px-3 py-1.5
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <button
            onClick={applyCustom}
            className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(AnalyticsFilters);
