import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The title/label of the metric.
 * @property {string|number} value - The main metric value to display.
 * @property {React.ComponentType<{className?: string}>} icon - The Lucide icon component to display.
 * @property {number} change - The percentage change vs last month (positive or negative).
 * @property {string} [color='primary'] - The color key for the icon container ('primary' | 'success' | 'warning' | 'danger' | 'blue' | 'indigo' | 'pink').
 */

/**
 * StatsCard component displays a single KPI metric with its icon, value, and monthly percentage change.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @param {StatsCardProps} props - Component props.
 * @returns {React.JSX.Element} The rendered StatsCard component.
 */
const StatsCard = ({ title, value, icon: Icon, change, color = 'primary' }) => {
  const isPositive = change >= 0;

  // Custom theme mapping based on index.css theme settings
  const colorMap = {
    primary: 'bg-primary/10 text-primary group-hover:bg-primary/20',
    success: 'bg-success/10 text-success group-hover:bg-success/20',
    warning: 'bg-warning/10 text-warning group-hover:bg-warning/20',
    danger: 'bg-danger/10 text-danger group-hover:bg-danger/20',
    blue: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20',
    red: 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20',
    pink: 'bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20',
  };

  const activeColorClass = colorMap[color] || colorMap.primary;

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md hover:border-slate-700 light:hover:border-slate-350 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 light:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-2 text-white light:text-black group-hover:text-primary transition-colors">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl transition-colors duration-300 ${activeColorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-4">
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg w-fit transition-all duration-300 ${
            isPositive
              ? 'text-success bg-success/10 border border-success/20'
              : 'text-danger bg-danger/10 border border-danger/20'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          <span>
            {isPositive ? '+' : ''}
            {change}%
          </span>
        </div>
        <span className="text-[10px] text-slate-500 light:text-slate-400 font-medium">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;
