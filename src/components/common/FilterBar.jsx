/**
 * FilterBar — row of clickable pill-style status filter buttons.
 *
 * @param {object}   props
 * @param {string}   props.activeFilter    - Currently selected filter label
 * @param {Function} props.onFilterChange  - Called with new filter string on click
 * @param {Array}    props.leads           - Full leads array used to compute per-filter counts
 * @returns {React.JSX.Element}
 */

/** Ordered list of all filter options */
const FILTERS = [
  'All',
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];

const FilterBar = ({ activeFilter, onFilterChange, leads = [] }) => {
  /**
   * Compute the count of leads matching a given filter label.
   * 'All' returns the total lead count.
   *
   * @param {string} filter
   * @returns {number}
   */
  const getCount = (filter) => {
    if (filter === 'All') return leads.length;
    return leads.filter(
      (l) => (l.status || l.stage || '').toLowerCase() === filter.toLowerCase()
    ).length;
  };

  return (
    <div
      role="group"
      aria-label="Filter leads by status"
      className="flex flex-wrap items-center gap-2"
    >
      {FILTERS.map((filter) => {
        const count = getCount(filter);
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            aria-pressed={isActive}
            aria-label={`Filter by ${filter}, ${count} lead${count !== 1 ? 's' : ''}`}
            className={`
              inline-flex items-center px-3 py-1.5
              text-xs font-semibold rounded-xl whitespace-nowrap
              border transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
              cursor-pointer select-none
              ${
                isActive
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200 hover:bg-slate-900'
              }
            `}
          >
            {filter} ({count})
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
