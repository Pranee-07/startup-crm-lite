import { Pencil, Trash2, Mail, Phone, Globe } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * @typedef {Object} Lead
 * @property {number|string} id - Unique identifier.
 * @property {string} name - Lead representative name.
 * @property {string} [contactName] - Alternate field for representative name.
 * @property {string} company - Company name.
 * @property {string} email - Contact email.
 * @property {string} [phone] - Contact phone number.
 * @property {string} [status] - Pipeline stage status.
 * @property {string} [stage] - Alternate field for pipeline stage.
 * @property {string} [source] - Lead channel source.
 */

/**
 * @typedef {Object} LeadCardProps
 * @property {Lead} lead - The lead object.
 * @property {(lead: Lead) => void} onEdit - Callback when Edit button is clicked.
 * @property {(id: number|string) => void} onDelete - Callback when Delete button is clicked.
 */

/**
 * LeadCard component displays a detailed summary card of a lead,
 * featuring interactive edit, delete, call, and email actions.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @param {LeadCardProps} props - Component props.
 * @returns {React.JSX.Element} The rendered LeadCard component.
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  const name = lead.name || lead.contactName || 'Unknown Contact';
  const status = lead.status || lead.stage || 'New';
  const email = lead.email || '';
  const phone = lead.phone || 'No phone number';
  const source = lead.source || 'Other';

  return (
    <div className="p-5 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 hover:border-slate-750 light:hover:border-slate-350 transition-all duration-300 flex flex-col justify-between h-full space-y-4 shadow-md group">
      {/* Header section with Name, Company, and Status Badge */}
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h5 className="text-sm font-bold text-slate-200 light:text-black truncate group-hover:text-primary transition-colors">
            {name}
          </h5>
          <p className="text-xs text-slate-500 light:text-slate-400 font-medium truncate mt-0.5">{lead.company}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Middle section with Contact information & Source metadata */}
      <div className="py-3 px-4 rounded-xl bg-slate-950/80 light:bg-slate-50 border border-slate-850/60 light:border-slate-200 space-y-2 text-xs transition-colors duration-200">
        {email && (
          <div className="flex items-center gap-2 text-slate-300 light:text-slate-700 py-1">
            <Mail className="w-3.5 h-3.5 text-slate-500 light:text-slate-400 shrink-0" />
            <a href={`mailto:${email}`} className="truncate hover:text-primary transition-colors py-0.5">
              {email}
            </a>
          </div>
        )}
        <div className="flex items-center gap-2 text-slate-300 light:text-slate-700 py-1">
          <Phone className="w-3.5 h-3.5 text-slate-500 light:text-slate-400 shrink-0" />
          {phone !== 'No phone number' ? (
            <a href={`tel:${phone}`} className="hover:text-primary transition-colors py-0.5">
              {phone}
            </a>
          ) : (
            <span className="text-slate-500 light:text-slate-400 italic">{phone}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-400 light:text-slate-500 text-[10px] border-t border-slate-850/40 light:border-slate-200 pt-2 font-medium">
          <Globe className="w-3.5 h-3.5 text-slate-500 light:text-slate-400 shrink-0" />
          <span>Source:</span>
          <span className="text-slate-300 light:text-slate-700">{source}</span>
        </div>
      </div>

      {/* Footer controls: Edit & Delete buttons */}
      <div className="flex items-center gap-2 pt-2">
        {/* Edit Button - touch-friendly height 44px on mobile */}
        <button
          onClick={() => onEdit(lead)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 min-h-[44px] lg:min-h-[auto] lg:py-2 text-xs font-semibold bg-slate-950 light:bg-slate-50 hover:bg-slate-800 light:hover:bg-slate-100 text-slate-300 light:text-slate-600 hover:text-blue-400 light:hover:text-blue-600 border border-slate-850 light:border-slate-200 hover:border-blue-500/20 light:hover:border-blue-500/30 rounded-xl transition-colors cursor-pointer"
          title={`Edit details for ${name}`}
          aria-label={`Edit ${name}`}
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>

        {/* Delete Button - touch-friendly height 44px on mobile */}
        <button
          onClick={() => onDelete(lead.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 min-h-[44px] lg:min-h-[auto] lg:py-2 text-xs font-semibold bg-slate-950 light:bg-slate-50 hover:bg-red-950/20 light:hover:bg-red-50 text-slate-400 light:text-slate-550 hover:text-red-400 border border-slate-850 light:border-slate-200 hover:border-red-500/20 light:hover:border-red-500/30 rounded-xl transition-colors cursor-pointer"
          title={`Delete ${name}`}
          aria-label={`Delete ${name}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default LeadCard;
