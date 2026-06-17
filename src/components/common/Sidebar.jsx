import React from 'react'; // Import React for component definition
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom for navigation with active states
// Import modern icons from lucide-react for CRM links and layouts
import { 
  LayoutDashboard, // Dashboard icon
  Users,           // Lead Management icon
  BarChart3,       // Analytics icon
  Settings,        // Settings placeholder icon
  Compass,         // Branding compass icon
  X                // Close icon for mobile menu
} from 'lucide-react';

// Sidebar component receives:
// - isOpen: boolean indicating if mobile sidebar is open
// - toggleSidebar: function to close the sidebar on mobile
const Sidebar = ({ isOpen, toggleSidebar }) => {
  
  // Array of navigation link definitions to keep code clean and modular
  const navItems = [
    {
      name: 'Dashboard', // Label for navigation item
      path: '/', // Path matching Dashboard page
      icon: LayoutDashboard // Icon component
    },
    {
      name: 'Leads', // Label for navigation item
      path: '/leads', // Path matching Lead Management page
      icon: Users // Icon component
    },
    {
      name: 'Analytics', // Label for navigation item
      path: '/analytics', // Path matching Analytics page
      icon: BarChart3 // Icon component
    }
  ];

  return (
    <>
      {/* Mobile Backdrop overlay: shown only when sidebar is open on mobile screens, clicks close the sidebar */}
      {isOpen && (
        <div 
          onClick={toggleSidebar} // Close sidebar on click
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300" // Styled overlay with backdrop blur
        ></div>
      )}

      {/* Main Sidebar Panel: slide-in from left on mobile, static on desktop */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-full bg-slate-900 border-r border-slate-800 text-slate-100 transform lg:static lg:translate-x-0 transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full' // Conditional translation class based on state
        }`}
      >
        {/* Header containing the CRM Logo and a close button for mobile viewports */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-blue-500/20">
              <Compass className="w-6 h-6 text-white animate-pulse" /> {/* Glowing branding icon */}
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                CRM LITE
              </span> {/* Logo Text */}
              <span className="block text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
                Startup Accelerator
              </span> {/* Subtitle */}
            </div>
          </div>
          
          {/* Close button: visible only on mobile layout to hide sidebar */}
          <button 
            onClick={toggleSidebar} // Invokes toggler to close menu
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 lg:hidden focus:outline-none transition-colors"
          >
            <X className="w-6 h-6" /> {/* Dismiss Icon */}
          </button>
        </div>

        {/* Navigation list area */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name} // Unique key for render efficiency
              to={item.path} // Target routing path
              onClick={() => {
                if (isOpen) toggleSidebar(); // Close sidebar on link click (mobile optimization)
              }}
              // Dynamic CSS based on routing active state
              className={({ isActive }) => 
                `flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 group relative overflow-hidden
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border-l-4 border-blue-500 shadow-inner' // Active style
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-l-4 border-transparent' // Inactive style
                }`
              }
            >
              {/* Dynamic Icon with hover-state scaling and group animation */}
              <item.icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.name}</span> {/* Item Name */}
              
              {/* Subtle background glow element for active links */}
              <span className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"></span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Area with user profile details / settings link */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer group">
            {/* User avatar container */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" // Unsplash avatar placeholder
                alt="Profile Avatar" 
                className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span> {/* Active online badge */}
            </div>
            {/* User credentials */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-blue-400 transition-colors">Sarah Jenkins</p>
              <p className="text-xs text-slate-500 truncate">Founder & CEO</p>
            </div>
            {/* Settings icon */}
            <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; // Export component as default
