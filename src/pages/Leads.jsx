import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, LayoutGrid, List } from 'lucide-react';

// Import custom subcomponents
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';

// Import new Search & Filter common components
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';

// Initial prefilled mock leads with unified schemas
const initialMockLeads = [
  {
    id: 1,
    company: 'Apex Corp Solutions',
    name: 'Marcus Vance',
    email: 'marcus@apex.io',
    phone: '+1 (555) 234-5678',
    value: '$38,200',
    status: 'Negotiation',
    source: 'LinkedIn',
    dateAdded: '2026-06-15T14:30:00Z',
    owner: 'Sarah J.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 2,
    company: 'Siren Systems Ltd',
    name: 'Nadia Thorne',
    email: 'nadia@siren.co',
    phone: '+1 (555) 876-5432',
    value: '$24,500',
    status: 'Contacted',
    source: 'Website',
    dateAdded: '2026-06-14T09:15:00Z',
    owner: 'David K.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 3,
    company: 'Vortex Labs Inc',
    name: 'Julian Foster',
    email: 'julian@vortex.net',
    phone: '+1 (555) 987-6543',
    value: '$19,000',
    status: 'New',
    source: 'Email Campaign',
    dateAdded: '2026-06-16T10:00:00Z',
    owner: 'Sarah J.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 4,
    company: 'Horizon Ventures',
    name: 'Elena Rostova',
    email: 'elena@horizon.vc',
    phone: '+1 (555) 432-1098',
    value: '$52,000',
    status: 'Proposal Sent',
    source: 'LinkedIn',
    dateAdded: '2026-06-13T16:45:00Z',
    owner: 'Marcus L.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 5,
    company: 'Stellar Tech Corp',
    name: 'Kenji Sato',
    email: 'kenji@stellar.tech',
    phone: '+1 (555) 543-2109',
    value: '$125,000',
    status: 'Won',
    source: 'Referral',
    dateAdded: '2026-06-10T11:00:00Z',
    owner: 'David K.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
  },
  {
    id: 6,
    company: 'Alpha Builders',
    name: 'Robert Miller',
    email: 'robert@alphabuild.com',
    phone: '+1 (555) 654-3210',
    value: '$45,000',
    status: 'Lost',
    source: 'Cold Call',
    dateAdded: '2026-06-11T13:20:00Z',
    owner: 'Marcus L.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
  },
];

/**
 * Leads page component assembling the complete Lead CRUD system.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @returns {React.JSX.Element} The rendered Leads page.
 */
const Leads = () => {
  // Leads listing state
  const [leads, setLeads] = useState(initialMockLeads);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Layout presentation toggle state ('table' | 'cards')
  const [viewMode, setViewMode] = useState('table');

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
   * Delete lead handler with custom red hot-toast alert
   *
   * @param {number|string} id - Lead identifier
   */
  const handleDeleteLead = (id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    const leadName = leadToDelete ? leadToDelete.name || leadToDelete.contactName : 'Lead';

    if (window.confirm(`Are you sure you want to permanently delete lead: ${leadName}?`)) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.error(`${leadName} deleted successfully.`, {
        icon: '🗑️',
      });
    }
  };

  /**
   * Form submit routing handler for both Create and Update
   *
   * @param {object} formData - Form details collected from LeadForm
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Edit / Update mode
      setLeads((prev) =>
        prev.map((l) =>
          l.id === formData.id
            ? {
                ...l,
                name: formData.name,
                company: formData.company,
                email: formData.email,
                phone: formData.phone,
                status: formData.status,
                source: formData.source,
              }
            : l
        )
      );
      toast.success(`${formData.name} updated successfully.`);
    } else {
      // Create mode
      const newLead = {
        id: Date.now(),
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        source: formData.source,
        dateAdded: new Date().toISOString(),
        owner: 'Sarah J.',
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&q=80&w=100`,
      };
      setLeads((prev) => [newLead, ...prev]);
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
      <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">

        {/* Row 1: Search + View Toggle + Add Lead button */}
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">

          {/* SearchBar (debounced, with clear button) */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Right Side Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">

            {/* View Toggler button icons */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-slate-800 text-primary' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
                aria-label="Toggle Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'cards' ? 'bg-slate-800 text-primary' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid Cards View"
                aria-label="Toggle Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Counter label */}
            <span className="text-xs text-slate-500 whitespace-nowrap bg-slate-950 px-3.5 py-2.5 border border-slate-800 rounded-xl">
              Found: <strong className="text-slate-300 font-semibold">{filteredLeads.length}</strong>
            </span>

            {/* Add New Lead button */}
            <button
              onClick={handleAddLeadClick}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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
        {viewMode === 'table' ? (
          <>
            {/* Desktop table view */}
            <div className="hidden md:block">
              {filteredLeads.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl">
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

            {/* Mobile responsive card fallback */}
            <div className="block md:hidden">
              {filteredLeads.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl">
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
          </>
        ) : (
          /* Card view on all displays */
          filteredLeads.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl">
              <EmptyState
                totalLeads={leads.length}
                searchQuery={searchQuery}
                activeFilter={activeFilter}
                onClearFilters={handleClearFilters}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEditLeadClick}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* ── Add / Edit Form Dialog Overlay ──────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          {/* Form wrapper container */}
          <div
            className="relative bg-slate-900 border border-slate-850 p-6 rounded-3xl max-w-xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200"
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
