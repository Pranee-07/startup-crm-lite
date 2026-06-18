import React from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * EmptyAnalyticsState – shown when the leads array is empty.
 * Prompts the user to create their first lead.
 */
const EmptyAnalyticsState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Glowing icon container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 light:bg-blue-500/10 blur-2xl scale-150" />
        <div className="relative w-20 h-20 rounded-2xl bg-slate-800 light:bg-white border border-slate-700 light:border-slate-200 flex items-center justify-center shadow-xl transition-colors duration-200">
          <BarChart3 className="w-9 h-9 text-blue-400 light:text-blue-600" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white light:text-black mb-2">No analytics available yet</h3>
      <p className="text-sm text-slate-400 light:text-slate-500 max-w-sm mb-8 leading-relaxed">
        Add your first lead to start tracking business performance, conversion rates,
        and revenue trends in real-time.
      </p>

      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600
                   hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20
                   hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Lead
      </button>
    </div>
  );
};

export default React.memo(EmptyAnalyticsState);
