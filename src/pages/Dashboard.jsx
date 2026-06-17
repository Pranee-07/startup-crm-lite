// Import Recharts components for beautiful, interactive graphical data visualization
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
// Import sleek icons from lucide-react to represent stats and headers
import { Users, TrendingUp, DollarSign, Clock } from 'lucide-react';

// Import our custom modular dashboard components
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';

// Mock performance data mapping monthly leads and successful conversions
const monthlyPerformanceData = [
  { name: 'Jan', Leads: 180, Conversions: 42 },
  { name: 'Feb', Leads: 250, Conversions: 68 },
  { name: 'Mar', Leads: 320, Conversions: 95 },
  { name: 'Apr', Leads: 410, Conversions: 128 },
  { name: 'May', Leads: 560, Conversions: 184 },
  { name: 'Jun', Leads: 780, Conversions: 248 },
];

// Mock leads list with dates and stage info
const sampleLeads = [
  {
    id: 1,
    company: 'Apex Corp Solutions',
    contactName: 'Marcus Vance',
    stage: 'Negotiation',
    value: '$38,200',
    dateAdded: '2026-06-15T14:30:00Z',
    email: 'marcus@apex.io',
    phone: '+1 (555) 234-5678',
    owner: 'Sarah J.',
  },
  {
    id: 2,
    company: 'Siren Systems Ltd',
    contactName: 'Nadia Thorne',
    stage: 'Contacted',
    value: '$24,500',
    dateAdded: '2026-06-14T09:15:00Z',
    email: 'nadia@siren.co',
    phone: '+1 (555) 876-5432',
    owner: 'David K.',
  },
  {
    id: 3,
    company: 'Vortex Labs Inc',
    contactName: 'Julian Foster',
    stage: 'New',
    value: '$19,000',
    dateAdded: '2026-06-16T10:00:00Z',
    email: 'julian@vortex.net',
    phone: '+1 (555) 987-6543',
    owner: 'Sarah J.',
  },
  {
    id: 4,
    company: 'Horizon Ventures',
    contactName: 'Elena Rostova',
    stage: 'Proposal',
    value: '$52,000',
    dateAdded: '2026-06-13T16:45:00Z',
    email: 'elena@horizon.vc',
    phone: '+1 (555) 432-1098',
    owner: 'Marcus L.',
  },
  {
    id: 5,
    company: 'Stellar Tech Corp',
    contactName: 'Kenji Sato',
    stage: 'Won',
    value: '$125,000',
    dateAdded: '2026-06-10T11:00:00Z',
    email: 'kenji@stellar.tech',
    phone: '+1 (555) 543-2109',
    owner: 'David K.',
  },
  {
    id: 6,
    company: 'Alpha Builders',
    contactName: 'Robert Miller',
    stage: 'Lost',
    value: '$45,000',
    dateAdded: '2026-06-11T13:20:00Z',
    email: 'robert@alphabuild.com',
    phone: '+1 (555) 654-3210',
    owner: 'Marcus L.',
  },
  {
    id: 7,
    company: 'Quantum Dynamics',
    contactName: 'Chloe Henderson',
    stage: 'Proposal',
    value: '$68,000',
    dateAdded: '2026-06-16T08:30:00Z',
    email: 'chloe@quantum.dyn',
    phone: '+1 (555) 345-6789',
    owner: 'Sarah J.',
  },
  {
    id: 8,
    company: 'Nova Marketing',
    contactName: "Liam O'Connor",
    stage: 'New',
    value: '$15,500',
    dateAdded: '2026-06-16T09:45:00Z',
    email: 'liam@novamktg.com',
    phone: '+1 (555) 765-4321',
    owner: 'Marcus L.',
  },
];

/**
 * Dashboard page assembling stats, pipeline summary, recent lead list,
 * quick action buttons, and analytical visual trends.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @returns {React.JSX.Element} The rendered Dashboard page.
 */
const Dashboard = () => {
  /**
   * Action handler for adding a new lead placeholder
   */
  const handleAddNewLead = () => {
    alert('Add Lead form modal trigger. (Feature integration coming in Phase 8)');
  };

  /**
   * Action handler to compile and export lead records to CSV format
   */
  const handleExportData = () => {
    try {
      const headers = ['Company', 'Contact Name', 'Stage', 'Value', 'Date Added', 'Email', 'Phone', 'Owner'];
      const rows = sampleLeads.map((lead) => [
        `"${lead.company}"`,
        `"${lead.contactName}"`,
        `"${lead.stage}"`,
        `"${lead.value}"`,
        `"${lead.dateAdded}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.owner}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `crm_leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export leads data.');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner section with welcome greeting and gradient glow background */}
      <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, Sarah! 👋
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300 font-medium">
            Your pipeline value has grown by <span className="text-success font-bold">+8.4%</span> this week. You have <span className="text-primary font-bold">3 new leads</span> awaiting response.
          </p>
        </div>
      </div>

      {/* Grid of Key Performance Indicators (KPIs) - Responsive: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value="1,482"
          icon={Users}
          change={14.2}
          color="primary"
        />
        <StatsCard
          title="Pipeline Value"
          value="$383,700"
          icon={DollarSign}
          change={8.4}
          color="indigo"
        />
        <StatsCard
          title="Conversion Rate"
          value="31.8%"
          icon={TrendingUp}
          change={2.3}
          color="success"
        />
        <StatsCard
          title="Avg Sales Cycle"
          value="14 Days"
          icon={Clock}
          change={-12.5}
          color="warning"
        />
      </div>

      {/* Middle Grid: Pipeline bar overview and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineOverview leads={sampleLeads} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions onAddLead={handleAddNewLead} onExport={handleExportData} />
        </div>
      </div>

      {/* Bottom Grid: Recharts Funnel visualization and Recent Leads list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart card container (Takes up 2 columns out of 3 on desktop) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white tracking-wide">Monthly Conversion Funnel</h4>
            <p className="text-xs text-slate-500 mt-1">
              Growth analysis comparing new incoming leads versus closed deals
            </p>
          </div>

          <div className="h-72 mt-6 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F1F5F9',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Leads"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#leadsGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="Conversions"
                  stroke="#22C55E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#convGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Leads list container (Takes up 1 column out of 3 on desktop) */}
        <div className="lg:col-span-1">
          <RecentLeads leads={sampleLeads} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
