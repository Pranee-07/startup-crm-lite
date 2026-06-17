/**
 * @typedef {Object} StatusBadgeProps
 * @property {string} status - Pipeline status name ('New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost').
 */

/**
 * StatusBadge component displays a pill-shaped colored badge mapping the lead status
 * to semantic colors.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @param {StatusBadgeProps} props - Component props.
 * @returns {React.JSX.Element} The rendered StatusBadge component.
 */
const StatusBadge = ({ status = 'New' }) => {
  /**
   * Helper function to match the status string to precise Tailwind classes
   *
   * @param {string} statusVal - Active status value
   * @returns {string} Tailwind color styling classes
   */
  const getBadgeStyle = (statusVal) => {
    switch (statusVal.toLowerCase()) {
      case 'new':
        return 'bg-slate-500/15 text-slate-400 border-slate-500/20';
      case 'contacted':
        return 'bg-primary/15 text-blue-400 border-blue-500/20';
      case 'meeting scheduled':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/20';
      case 'proposal sent':
        return 'bg-warning/15 text-warning border-warning/20';
      case 'won':
        return 'bg-success/15 text-success border-success/20';
      case 'lost':
        return 'bg-danger/15 text-danger border-danger/20';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <span
      className={`inline-block text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${getBadgeStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
