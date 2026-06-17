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
      <div className="flex items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs font-medium">
        No leads found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-950/40">
            <th className="py-4 px-6 font-semibold">Name</th>
            <th className="py-4 px-6 font-semibold">Company</th>
            <th className="py-4 px-6 font-semibold">Status</th>
            <th className="py-4 px-6 font-semibold">Email</th>
            <th className="py-4 px-6 font-semibold">Source</th>
            <th className="py-4 px-6 font-semibold">Date Added</th>
            <th className="py-4 px-6 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {leads.map((lead) => {
            const name = lead.name || lead.contactName || 'Unknown Contact';
            const status = lead.status || lead.stage || 'New';
            const email = lead.email || '';
            const source = lead.source || 'Other';
            const dateStr = lead.dateAdded || lead.createdAt || '';

            return (
              <tr key={lead.id} className="hover:bg-slate-850/40 transition-colors group">
                {/* Contact Name */}
                <td className="py-4 px-6 font-semibold text-slate-200 group-hover:text-primary transition-colors">
                  {name}
                </td>

                {/* Company Name */}
                <td className="py-4 px-6 text-slate-400 font-medium">{lead.company}</td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  <StatusBadge status={status} />
                </td>

                {/* Email Address */}
                <td className="py-4 px-6 text-slate-400 font-medium">
                  {email ? (
                    <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                      {email}
                    </a>
                  ) : (
                    <span className="text-slate-600 italic">No email</span>
                  )}
                </td>

                {/* Lead Source */}
                <td className="py-4 px-6 text-slate-400 font-medium">{source}</td>

                {/* Date Added */}
                <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                  {formatDate(dateStr)}
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Edit Trigger */}
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title={`Edit ${name}`}
                      aria-label={`Edit ${name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Trigger */}
                    <button
                      onClick={() => onDelete(lead.id)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                      title={`Delete ${name}`}
                      aria-label={`Delete ${name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
