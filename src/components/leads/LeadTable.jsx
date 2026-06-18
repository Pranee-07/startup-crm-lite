import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * @typedef {Object} Lead
 * @property {number|string} id - Unique identifier.
 * @property {string} name - Contact name.
 * @property {string} [contactName] - Alternate contact name field.
 * @property {string} company - Company name.
 * @property {string} email - Contact email.
 * @property {string} [phone] - Contact phone.
 * @property {string} [status] - Pipeline status.
 * @property {string} [stage] - Alternate stage status field.
 * @property {string} [source] - Lead source channel.
 * @property {string} [dateAdded] - Date string representation.
 * @property {string} [createdAt] - Alternate date field.
 */

/**
 * @typedef {Object} LeadTableProps
 * @property {Lead[]} leads - List of leads to display.
 * @property {(lead: Lead) => void} onEdit - Callback when Edit action is triggered.
 * @property {(id: number|string) => void} onDelete - Callback when Delete action is triggered.
 */

/**
 * LeadTable component displays a tabular list of leads for large screen viewports.
 * Includes status badge formatting, date conversions, and CRUD triggers.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @param {LeadTableProps} props - Component props.
 * @returns {React.JSX.Element} The rendered LeadTable component.
 */
const LeadTable = ({ leads = [], onEdit, onDelete }) => {
  /**
   * Helper function to format date stamps cleanly
   *
   * @param {string} dateVal - Date ISO string or representation
   * @returns {string} Formatted output
   */
  const formatDate = (dateVal) => {
    if (!dateVal) return 'N/A';
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return dateVal;
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (leads.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl text-slate-500 light:text-slate-400 text-xs font-medium transition-colors duration-200">
        No leads found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md transition-colors duration-200">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 light:border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500 light:text-slate-400 bg-slate-950/40 light:bg-slate-50">
            <th className="py-4 px-6 font-semibold">Name</th>
            <th className="py-4 px-6 font-semibold">Company</th>
            <th className="py-4 px-6 font-semibold">Status</th>
            <th className="py-4 px-6 font-semibold hidden lg:table-cell">Email</th>
            <th className="py-4 px-6 font-semibold hidden lg:table-cell">Source</th>
            <th className="py-4 px-6 font-semibold hidden lg:table-cell">Date Added</th>
            <th className="py-4 px-6 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 light:divide-slate-200/80">
          {leads.map((lead) => {
            const name = lead.name || lead.contactName || 'Unknown Contact';
            const status = lead.status || lead.stage || 'New';
            const email = lead.email || '';
            const source = lead.source || 'Other';
            const dateStr = lead.dateAdded || lead.createdAt || '';

            return (
              <tr key={lead.id} className="hover:bg-slate-850/40 light:hover:bg-slate-50 transition-colors group">
                {/* Contact Name */}
                <td className="py-4 px-6 font-semibold text-slate-200 light:text-slate-800 group-hover:text-primary transition-colors">
                  {name}
                </td>

                {/* Company Name */}
                <td className="py-4 px-6 text-slate-400 light:text-slate-600 font-medium">{lead.company}</td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  <StatusBadge status={status} />
                </td>

                {/* Email Address */}
                <td className="py-4 px-6 text-slate-400 light:text-slate-600 font-medium hidden lg:table-cell">
                  {email ? (
                    <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                      {email}
                    </a>
                  ) : (
                    <span className="text-slate-600 light:text-slate-400 italic">No email</span>
                  )}
                </td>

                {/* Lead Source */}
                <td className="py-4 px-6 text-slate-400 light:text-slate-600 font-medium hidden lg:table-cell">{source}</td>

                {/* Date Added */}
                <td className="py-4 px-6 text-slate-500 light:text-slate-400 font-medium whitespace-nowrap hidden lg:table-cell">
                  {formatDate(dateStr)}
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Edit Trigger - touch-friendly 44x44px on tablet, w-8 h-8 on desktop */}
                    <button
                      onClick={() => onEdit(lead)}
                      className="w-11 h-11 lg:w-8 lg:h-8 flex items-center justify-center rounded-lg bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-550 hover:text-blue-400 hover:bg-slate-800 light:hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                      title={`Edit ${name}`}
                      aria-label={`Edit ${name}`}
                    >
                      <Pencil className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
                    </button>

                    {/* Delete Trigger - touch-friendly 44x44px on tablet, w-8 h-8 on desktop */}
                    <button
                      onClick={() => onDelete(lead.id)}
                      className="w-11 h-11 lg:w-8 lg:h-8 flex items-center justify-center rounded-lg bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-555 hover:text-red-400 hover:bg-red-950/20 light:hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                      title={`Delete ${name}`}
                      aria-label={`Delete ${name}`}
                    >
                      <Trash2 className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
