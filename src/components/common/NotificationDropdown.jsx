import { UserPlus, Calendar, CheckCircle2 } from 'lucide-react';

// Mock list of active alerts
const mockNotifications = [
  {
    id: 1,
    title: 'New Lead Assigned',
    message: 'Marcus Vance from Apex Corp was assigned to you.',
    time: '5 mins ago',
    unread: true,
    icon: UserPlus,
    iconColor: 'text-blue-400 bg-blue-500/10 light:text-blue-650 light:bg-blue-100/60',
  },
  {
    id: 2,
    title: 'Meeting Scheduled',
    message: 'Product demo scheduled with Elena Rostova.',
    time: '15 mins ago',
    unread: true,
    icon: Calendar,
    iconColor: 'text-amber-400 bg-amber-500/10 light:text-amber-650 light:bg-amber-100/60',
  },
  {
    id: 3,
    title: 'Lead Converted!',
    message: 'Horizon Ventures proposal has been marked as Won.',
    time: '2 hours ago',
    unread: false,
    icon: CheckCircle2,
    iconColor: 'text-emerald-400 bg-emerald-500/10 light:text-emerald-650 light:bg-emerald-100/60',
  },
];

/**
 * NotificationDropdown renders a premium floating list of alerts.
 * Matches theme and styling with slide-in animation.
 *
 * @param {object} props - Component props.
 * @param {() => void} props.onClose - Callback to close/dismiss the dropdown.
 * @returns {React.JSX.Element} The rendered NotificationDropdown.
 */
const NotificationDropdown = ({ onClose }) => {
  return (
    <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
      
      {/* Header title */}
      <div className="p-4 border-b border-slate-800/80 light:border-slate-200/80 flex items-center justify-between transition-colors">
        <h4 className="font-bold text-xs text-white light:text-slate-800 tracking-wide uppercase">Notifications</h4>
        <span className="text-[10px] bg-blue-500/20 text-blue-400 light:bg-blue-100 light:text-blue-600 px-2.5 py-0.5 rounded-full font-bold">
          2 New
        </span>
      </div>

      {/* List items */}
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/40 light:divide-slate-200/40 transition-colors">
        {mockNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 flex gap-3 hover:bg-slate-850/50 light:hover:bg-slate-50 transition-colors cursor-pointer ${
              n.unread ? 'bg-blue-500/5 light:bg-blue-50/10' : ''
            }`}
          >
            <div className={`p-2 rounded-xl h-9 w-9 flex items-center justify-center shrink-0 ${n.iconColor}`}>
              <n.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-200 light:text-slate-800 truncate">{n.title}</p>
                <span className="text-[9px] text-slate-500 light:text-slate-400 whitespace-nowrap">{n.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 light:text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-slate-950/40 light:bg-slate-50 border-t border-slate-800/80 light:border-slate-200/80 text-center transition-colors">
        <button
          onClick={onClose}
          className="text-[11px] font-bold text-blue-400 hover:text-blue-300 light:text-blue-600 light:hover:text-blue-700 transition-colors cursor-pointer"
        >
          Dismiss All
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
