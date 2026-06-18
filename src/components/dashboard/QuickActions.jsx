import { Link } from 'react-router-dom';
import { Plus, Users, Download } from 'lucide-react';

/**
 * @typedef {Object} QuickActionsProps
 * @property {() => void} [onAddLead] - Callback triggered when the "Add New Lead" button is clicked.
 * @property {() => void} [onExport] - Callback triggered when the "Export Data" button is clicked.
 */

/**
 * QuickActions component displays shortcuts to perform crucial tasks such as creating new leads,
 * listing all leads, or exporting system pipeline records.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @param {QuickActionsProps} props - Component props.
 * @returns {React.JSX.Element} The rendered QuickActions component.
 */
const QuickActions = ({ onAddLead, onExport }) => {
  /**
   * Default fallback click handler for demonstration purposes
   *
   * @param {string} actionName - Name of the action triggered
   */
  const handleFallbackClick = (actionName) => {
    alert(`${actionName} triggered! (Feature integration coming in Phase 8)`);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col justify-between h-full transition-colors duration-200">
      <div>
        <h4 className="text-base font-bold text-white light:text-black tracking-wide">Quick Actions</h4>
        <p className="text-xs text-slate-500 light:text-slate-400 mt-1">
          Perform administrative pipeline routines instantly
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3.5">
        {/* Add New Lead Action CTA */}
        <button
          onClick={onAddLead || (() => handleFallbackClick('Add New Lead'))}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add New Lead</span>
        </button>

        {/* View All Leads Page Route redirection Link */}
        <Link
          to="/leads"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold bg-slate-950 light:bg-slate-50 hover:bg-slate-850 light:hover:bg-slate-100 text-slate-300 light:text-black border border-slate-850 light:border-slate-200 hover:border-slate-700 light:hover:border-slate-350 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
        >
          <Users className="w-4 h-4 shrink-0 text-slate-400 light:text-slate-500" />
          <span>View All Leads</span>
        </Link>

        {/* Export Data Action CTA */}
        <button
          onClick={onExport || (() => handleFallbackClick('Export Data'))}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold bg-slate-950 light:bg-slate-50 hover:bg-slate-850 light:hover:bg-slate-100 text-slate-300 light:text-black border border-slate-850 light:border-slate-200 hover:border-slate-700 light:hover:border-slate-350 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
        >
          <Download className="w-4 h-4 shrink-0 text-slate-400 light:text-slate-500" />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
