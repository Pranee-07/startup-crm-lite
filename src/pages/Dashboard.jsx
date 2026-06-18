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
import { useLeads } from '../context/LeadContext';

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



/**
 * Dashboard page assembling stats, pipeline summary, recent lead list,
 * quick action buttons, and analytical visual trends.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @returns {React.JSX.Element} The rendered Dashboard page.
 */
const Dashboard = () => {
  // ── Pull live leads from global context ─────────────────────────────────
  const { leads } = useLeads();

  const handleAddNewLead = () => {
    alert('Add Lead form modal trigger. (Feature integration coming in Phase 8)');
  };

  /**
   * Action handler to compile and export all lead records to CSV format.
   * Uses the live leads array from LeadContext.
   */
  const handleExportData = () => {
    try {
      const headers = ['Company', 'Name', 'Status', 'Source', 'Created At', 'Email', 'Phone'];
      const rows = leads.map((lead) => [
        `"${lead.company}"`,
        `"${lead.name}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${lead.createdAt}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
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
          <PipelineOverview leads={leads} />
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
          <RecentLeads leads={leads} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
