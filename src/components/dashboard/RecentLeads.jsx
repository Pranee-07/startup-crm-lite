/**
 * @typedef {Object} Lead
 * @property {number|string} id - Unique identifier.
 * @property {string} company - Company name.
 * @property {string} contactName - Representative contact name.
 * @property {string} stage - Pipeline stage.
 * @property {string} dateAdded - Date representation when lead was added (e.g., '2026-06-15').
 * @property {string} value - Projected deal value.
 */

/**
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - List of leads in the CRM.
 */

/**
 * RecentLeads component displays the last 5 leads added to the system in a responsive table.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @param {RecentLeadsProps} props - Component props.
 * @returns {React.JSX.Element} The rendered RecentLeads component.
 */
const RecentLeads = ({ leads = [] }) => {
  // Sort leads by dateAdded descending and take top 5
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 5);

  /**
   * Helper function to return styling classes for pipeline stage badges
   *
   * @param {string} stage - Pipeline stage status
   * @returns {string} Tailwind CSS class classes
   */
  const getStageBadgeClass = (stage = '') => {
    switch (stage.toLowerCase()) {
      case 'new':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'contacted':
        return 'bg-primary/10 text-blue-400 border-blue-500/20';
      case 'proposal':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'negotiation':
        return 'bg-success/10 text-success border-success/20';
      case 'won':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'lost':
        return 'bg-danger/10 text-danger border-danger/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  /**
   * Helper function to format date strings for clean presentation
   *
   * @param {string} dateString - Date ISO string
   * @returns {string} Formatted output
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col h-full justify-between">
      <div>
        <h4 className="text-base font-bold text-white tracking-wide">Recent Leads</h4>
        <p className="text-xs text-slate-500 mt-1">
          Spotlight of the last 5 leads added to your CRM pipeline
        </p>
      </div>

      <div className="mt-6 flex-1">
        {recentLeads.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-xs text-slate-500 font-medium">
            No recent leads to display.
          </div>
        ) : (
          <>
            {/* Desktop and Tablet View Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 pb-2">
                    <th className="pb-3 pr-4 font-semibold">Name</th>
                    <th className="pb-3 px-4 font-semibold">Company</th>
                    <th className="pb-3 px-4 font-semibold">Stage</th>
                    <th className="pb-3 pl-4 font-semibold text-right">Date Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-850/40 transition-colors group">
                      <td className="py-3 pr-4 font-semibold text-slate-200 group-hover:text-primary transition-colors">
                        {lead.contactName}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-medium">{lead.company}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${getStageBadgeClass(
                            lead.stage
                          )}`}
                        >
                          {lead.stage}
                        </span>
                      </td>
                      <td className="py-3 pl-4 text-right text-slate-500 font-medium whitespace-nowrap">
                        {formatDate(lead.dateAdded)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Stack (hidden on screens larger than mobile) */}
            <div className="block sm:hidden space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-850/80 space-y-2.5 hover:border-slate-750 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{lead.contactName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lead.company}</p>
                    </div>
                    <span
                      className={`inline-block text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStageBadgeClass(
                        lead.stage
                      )}`}
                    >
                      {lead.stage}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] border-t border-slate-850/60 pt-2 text-slate-500">
                    <span>Date Added</span>
                    <span className="font-semibold text-slate-400">{formatDate(lead.dateAdded)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentLeads;
