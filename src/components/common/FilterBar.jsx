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
      className="flex flex-row lg:flex-wrap items-center gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none -mx-5 px-5 lg:mx-0 lg:px-0 scroll-smooth flex-nowrap"
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
              inline-flex items-center px-4 py-2.5
              min-h-[44px] lg:min-h-[auto] lg:px-3 lg:py-1.5
              text-xs font-semibold rounded-xl whitespace-nowrap
              border transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 light:focus-visible:ring-offset-white
              cursor-pointer select-none
              ${
                isActive
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-slate-950 light:bg-white border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-600 hover:border-slate-600 light:hover:border-slate-350 hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-900 light:hover:bg-slate-50'
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
