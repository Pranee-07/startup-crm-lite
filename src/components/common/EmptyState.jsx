import { SearchX, Inbox } from 'lucide-react';

/**
 * EmptyState — displayed when the leads list is empty (either globally or after filtering).
 *
 * Renders two distinct messages:
 *  - "No leads yet" — when the total leads array is completely empty
 *  - "No results" — when filtering/searching produces zero matches
 *
 * @param {object}   props
 * @param {number}   props.totalLeads      - Total count of leads before any filtering
 * @param {string}   props.searchQuery     - Current search string (may be empty)
 * @param {string}   props.activeFilter    - Current active status filter label
 * @param {Function} props.onClearFilters  - Callback to reset search + filter
 * @returns {React.JSX.Element}
 */
const EmptyState = ({ totalLeads, searchQuery, activeFilter, onClearFilters }) => {
  /** True when there are leads in the system but none match current query/filter */
  const isFiltered = totalLeads > 0;
  const hasSearch = Boolean(searchQuery);
  const hasFilter = activeFilter && activeFilter !== 'All';

  if (isFiltered) {
    // --- Filtered / Searched empty state ---
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-in fade-in duration-300">
        {/* Icon bubble */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mb-5 shadow-inner">
          <SearchX className="w-7 h-7 text-slate-500" />
        </div>

        {/* Headline */}
        <h3 className="text-base font-bold text-slate-200 mb-2">No leads found</h3>

        {/* Context-aware subtitle */}
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-1">
          {hasSearch && hasFilter && (
            <>
              No results for{' '}
              <span className="text-slate-300 font-medium">"{searchQuery}"</span> in the{' '}
              <span className="text-blue-400 font-medium">{activeFilter}</span> filter.
            </>
          )}
          {hasSearch && !hasFilter && (
            <>
              No leads match{' '}
              <span className="text-slate-300 font-medium">"{searchQuery}"</span>.
            </>
          )}
          {!hasSearch && hasFilter && (
            <>
              No leads with status{' '}
              <span className="text-blue-400 font-medium">{activeFilter}</span>.
            </>
          )}
          {!hasSearch && !hasFilter && 'No leads match your current filters.'}
        </p>

        <p className="text-xs text-slate-600 mb-6">
          Try adjusting your search terms or clearing the active filters.
        </p>

        {/* Clear filters CTA */}
        <button
          onClick={onClearFilters}
          className="
            inline-flex items-center gap-2 px-4 py-2.5
            text-xs font-semibold rounded-xl
            bg-blue-600 hover:bg-blue-500 text-white
            border border-blue-500 hover:border-blue-400
            shadow-md shadow-blue-500/20 hover:shadow-blue-500/30
            transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
            cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
          "
        >
          Clear Filters
        </button>
      </div>
    );
  }

  // --- Completely empty state (no leads in the system at all) ---
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-in fade-in duration-300">
      {/* Icon bubble */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mb-5 shadow-inner">
        <Inbox className="w-7 h-7 text-slate-500" />
      </div>

      {/* Headline */}
      <h3 className="text-base font-bold text-slate-200 mb-2">No leads yet</h3>

      {/* Subtitle */}
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
        Get started by adding your first lead. Click{' '}
        <span className="text-blue-400 font-medium">Add Lead</span> above to create one.
      </p>
    </div>
  );
};

export default EmptyState;
