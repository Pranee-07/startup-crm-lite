import { useMemo } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Import our custom modular dashboard components
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';

/**
 * Dashboard page assembling stats, pipeline summary, recent lead list,
 * quick action buttons, and analytical visual trends.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @returns {React.JSX.Element} The rendered Dashboard page.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  // ── Pull live leads, summary stats and user from global contexts ─────────
  const { leads, stats, monthlyStats, pagination } = useLeads();
  const { user } = useAuth();
  const { isLightMode } = useTheme();

  // Dynamic KPI Calculations synchronized with MongoDB Atlas
  const totalLeads = useMemo(() => {
    return stats?.totalLeads ?? pagination?.total ?? leads.length;
  }, [stats, pagination, leads]);

  const newLeadsCount = useMemo(() => {
    if (stats?.statusBreakdown && stats.statusBreakdown['New'] !== undefined) {
      return stats.statusBreakdown['New'];
    }
    return leads.filter((l) => (l.status || l.stage) === 'New').length;
  }, [stats, leads]);

  const totalRevenue = useMemo(() => {
    return leads.reduce((sum, lead) => {
      const rev = typeof lead.revenue === 'number'
        ? lead.revenue
        : typeof lead.revenue === 'string'
        ? parseFloat(lead.revenue.replace(/[^0-9.-]+/g, '')) || 0
        : typeof lead.value === 'number'
        ? lead.value
        : parseFloat(String(lead.value || 0).replace(/[^0-9.-]+/g, '')) || 0;
      return sum + rev;
    }, 0);
  }, [leads]);

  const pipelineValue = useMemo(() => {
    return leads
      .filter((l) => (l.status || l.stage) !== 'Lost')
      .reduce((sum, lead) => {
        const val = lead.revenue !== undefined ? lead.revenue : lead.value;
        const numericVal = typeof val === 'string'
          ? parseFloat(val.replace(/[^0-9.-]+/g, '')) || 0
          : parseFloat(val) || 0;
        return sum + numericVal;
      }, 0);
  }, [leads]);

  const conversionRate = useMemo(() => {
    if (stats?.conversionRate !== undefined) {
      return `${stats.conversionRate}%`;
    }
    if (totalLeads === 0) return '0%';
    const wonCount = leads.filter((l) => {
      const s = (l.status || l.stage || '').toLowerCase();
      return s === 'won' || s === 'converted';
    }).length;
    return `${((wonCount / totalLeads) * 100).toFixed(1)}%`;
  }, [stats, totalLeads, leads]);

  const avgSalesCycle = useMemo(() => {
    const wonLeads = leads.filter((l) => {
      const s = (l.status || l.stage || '').toLowerCase();
      return (s === 'won' || s === 'converted') && (l.wonAt || l.updatedAt) && l.createdAt;
    });
    if (wonLeads.length > 0) {
      const totalDays = wonLeads.reduce((sum, l) => {
        const start = new Date(l.createdAt);
        const end = new Date(l.wonAt || l.updatedAt);
        return sum + Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      }, 0);
      return `${Math.round(totalDays / wonLeads.length)} Days`;
    }
    if (leads.length > 0) {
      const dates = leads.map((l) => new Date(l.createdAt || l.dateAdded)).filter((d) => !isNaN(d.getTime()));
      if (dates.length > 1) {
        const span = Math.max(...dates) - Math.min(...dates);
        const days = Math.round(span / (1000 * 60 * 60 * 24));
        return `${Math.max(1, days)} Days`;
      }
      return '1 Day';
    }
    return '0 Days';
  }, [leads]);

  const chartData = useMemo(() => {
    if (Array.isArray(monthlyStats) && monthlyStats.length > 0) {
      return monthlyStats.map((item) => ({
        name: item.month || item.name || '',
        Leads: item.Leads ?? item.total ?? 0,
        Conversions: item.Conversions ?? item.won ?? 0,
      }));
    }
    // Fallback default months if no history exists yet
    const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return defaultMonths.map((m) => ({ name: m, Leads: 0, Conversions: 0 }));
  }, [monthlyStats]);

  const handleAddNewLead = () => {
    navigate('/leads/new');
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
      toast.error('Failed to export leads data.');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner section with welcome greeting and gradient glow background */}
      <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 light:from-white light:via-slate-50 light:to-blue-50 border border-slate-800 light:border-slate-200 overflow-hidden shadow-xl transition-all duration-200">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/10 light:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'User'}! 👋
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300 light:text-slate-600 font-medium">
            Your pipeline has <span className="text-primary font-bold">{totalLeads} {totalLeads === 1 ? 'lead' : 'leads'}</span> recorded. You have{' '}
            <span className="text-primary font-bold">{newLeadsCount} new {newLeadsCount === 1 ? 'lead' : 'leads'}</span> awaiting response.
          </p>
        </div>
      </div>

      {/* Grid of Key Performance Indicators (KPIs) - Responsive: 1 col on mobile, 2 on tablet, 3/5 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatsCard
          title="Total Leads"
          value={totalLeads.toLocaleString()}
          icon={Users}
          change={totalLeads > 0 ? 100 : 0}
          color="primary"
        />
        <StatsCard
          title="Revenue"
          value={`$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
          change={totalRevenue > 0 ? 12.5 : 0}
          color="success"
        />
        <StatsCard
          title="Pipeline Value"
          value={pipelineValue > 0 ? `$${pipelineValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '$0'}
          icon={DollarSign}
          change={pipelineValue > 0 ? 8.4 : 0}
          color="indigo"
        />
        <StatsCard
          title="Conversion Rate"
          value={conversionRate}
          icon={TrendingUp}
          change={parseFloat(conversionRate) > 0 ? parseFloat(conversionRate) : 0}
          color="blue"
        />
        <StatsCard
          title="Avg Sales Cycle"
          value={avgSalesCycle}
          icon={Clock}
          change={0}
          color="warning"
        />
      </div>

      {/* Main Charts & Widgets Grid - Responsive: Full-width charts on Mobile/Tablet, 2-column grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Overview */}
        <PipelineOverview leads={leads} />

        {/* Quick Actions */}
        <QuickActions onAddLead={handleAddNewLead} onExport={handleExportData} />

        {/* Performance Chart card container */}
        <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col justify-between transition-colors duration-200">
          <div>
            <h4 className="text-base font-bold text-white light:text-black tracking-wide">Monthly Conversion Funnel</h4>
            <p className="text-xs text-slate-500 light:text-slate-400 mt-1">
              Growth analysis comparing new incoming leads versus closed deals
            </p>
          </div>

          <div className="h-72 mt-6 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? '#E2E8F0' : '#1E293B'} vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLightMode ? '#FFFFFF' : '#0F172A',
                    borderColor: isLightMode ? '#E2E8F0' : '#1E293B',
                    borderRadius: '12px',
                    color: isLightMode ? '#0F172A' : '#F1F5F9',
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

        {/* Recent Leads list container */}
        <RecentLeads leads={leads} />
      </div>
    </div>
  );
};

export default Dashboard;
