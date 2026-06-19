import { useState, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import { toast } from 'react-hot-toast';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Import custom subcomponents
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';

// Import new Search & Filter common components
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';



/**
 * Leads page component assembling the complete Lead CRUD system.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @returns {React.JSX.Element} The rendered Leads page.
 */
const Leads = () => {
  // ── Global lead state from context ─────────────────────────────────────
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const location = useLocation();

  // Helper to extract search queries from URL
  const getSearchQueryFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  };

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(getSearchQueryFromUrl());
  const [activeFilter, setActiveFilter] = useState('All');

  // Layout presentation toggle state ('table' | 'cards')
  const [viewMode, setViewMode] = useState('table');

  // Synchronize local search query state with URL query modifications
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(query);
  }, [location.search]);

  // Form modal display controller state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  /**
   * Action handler to open modal for creation
   */
  const handleAddLeadClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  /**
   * Action handler to open modal for editing
   *
   * @param {object} lead - Lead object selected for editing
   */
  const handleEditLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  /**
   * Action handler to dismiss modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  // Accessibility: Esc key listener to close modal automatically
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  /**
   * Delete lead handler — delegates to context's deleteLead.
   *
   * @param {string} id - Lead identifier
   */
  const handleDeleteLead = (id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    const leadName = leadToDelete ? leadToDelete.name : 'Lead';

    if (window.confirm(`Are you sure you want to permanently delete lead: ${leadName}?`)) {
      deleteLead(id);
      toast.error(`${leadName} deleted successfully.`, {
        icon: '🗑️',
      });
    }
  };

  /**
   * Form submit routing handler for both Create and Update.
   * Delegates persistence to the LeadContext CRUD operations.
   *
   * @param {object} formData - Form details collected from LeadForm
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Edit / Update mode — merge changed fields into existing lead
      updateLead(formData.id, {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        source: formData.source,
      });
      toast.success(`${formData.name} updated successfully.`);
    } else {
      // Create mode — addLead auto-generates id + createdAt
      addLead({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        source: formData.source,
      });
      toast.success(`${formData.name} created successfully.`);
    }
    handleCloseModal();
  };

  /**
   * Resets both search query and active filter back to defaults.
   * Passed down to EmptyState so the user can easily clear all filters.
   */
  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
  };

  const filteredLeads = leads
    .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
    .filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex flex-col gap-6">
      {/* ── Control Navigation Header Bar ───────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md transition-colors duration-200">

        {/* Row 1: Search + View Toggle + Add Lead button */}
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">

          {/* SearchBar (debounced, with clear button) */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Right Side Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
            {/* View Toggler button icons - only visible on tablet (md:flex lg:hidden) */}
            <div className="hidden md:flex lg:hidden items-center bg-slate-950 light:bg-slate-100 border border-slate-800 light:border-slate-200 rounded-xl p-1 shrink-0 transition-colors duration-200">
              <button
                onClick={() => setViewMode('table')}
                className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-slate-800 light:bg-white text-primary shadow-sm' : 'text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-700'
                }`}
                title="Table View"
                aria-label="Toggle Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`w-11 h-11 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-slate-800 light:bg-white text-primary shadow-sm' : 'text-slate-400 light:text-slate-500 hover:text-slate-200 light:hover:text-slate-700'
                }`}
                title="Grid Cards View"
                aria-label="Toggle Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Counter label */}
            <span className="text-xs text-slate-500 light:text-slate-400 whitespace-nowrap bg-slate-950 light:bg-slate-50 px-3.5 py-2.5 border border-slate-800 light:border-slate-200 rounded-xl transition-colors duration-200 min-h-[44px] flex items-center justify-center">
              Found: <strong className="text-slate-300 light:text-slate-700 font-semibold ml-1">{filteredLeads.length}</strong>
            </span>

            {/* Add New Lead button - touch-friendly height 44px on mobile */}
            <button
              onClick={handleAddLeadClick}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] md:min-h-[auto] text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              title="Create New Lead"
              aria-label="Add New Lead"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add Lead</span>
            </button>

          </div>
        </div>

        {/* Row 2: FilterBar with per-status counts */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          leads={leads}
        />

      </div>

      {/* ── Main Content Layout Viewer ───────────────────────────────────────── */}
      <div className="flex-1 transition-all duration-300">
        {/* Desktop view: Always full table layout (visible lg: and above) */}
        <div className="hidden lg:block">
          {filteredLeads.length === 0 ? (
            <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl shadow-md">
              <EmptyState
                totalLeads={leads.length}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                onClearFilters={handleClearFilters}
              />
            </div>
          ) : (
            <LeadTable
              leads={filteredLeads}
              onEdit={handleEditLeadClick}
              onDelete={handleDeleteLead}
            />
          )}
        </div>

        {/* Tablet view: hybrid toggle view (visible only on md: to lg: viewport sizes) */}
        <div className="hidden md:block lg:hidden">
          {filteredLeads.length === 0 ? (
            <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl shadow-md">
              <EmptyState
                totalLeads={leads.length}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                onClearFilters={handleClearFilters}
              />
            </div>
          ) : viewMode === 'table' ? (
            <LeadTable
              leads={filteredLeads}
              onEdit={handleEditLeadClick}
              onDelete={handleDeleteLead}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEditLeadClick}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile view: Always card layout (visible only on < md viewport sizes) */}
        <div className="block md:hidden">
          {filteredLeads.length === 0 ? (
            <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl shadow-md">
              <EmptyState
                totalLeads={leads.length}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                onClearFilters={handleClearFilters}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEditLeadClick}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Form Dialog Overlay ──────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 light:bg-slate-900/60 backdrop-blur-sm sm:p-4 overflow-y-auto"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          {/* Form wrapper container: full screen on Mobile (w-full h-full rounded-none), centered max-w-lg on Tablet+ */}
          <div
            className="relative bg-slate-900 light:bg-white border-0 sm:border border-slate-850 light:border-slate-200 p-6 rounded-none sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Stop click propagation to backdrop
          >
            <LeadForm
              key={selectedLead?.id || 'new'}
              initialData={selectedLead}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
