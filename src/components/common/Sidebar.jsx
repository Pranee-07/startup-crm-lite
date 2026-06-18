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
          className="fixed inset-0 z-40 bg-slate-950/60 light:bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300" // Styled overlay with backdrop blur
        ></div>
      )}

      {/* Main Sidebar Panel: slide-in from left on mobile, static on tablet & desktop */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-slate-900 light:bg-white border-r border-slate-800 light:border-slate-200 text-slate-100 light:text-slate-800 transform md:static md:translate-x-0 transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:w-20 lg:w-64 w-64'
        }`}
      >
        {/* Header containing the CRM Logo and a close button for mobile viewports */}
        <div className="flex items-center justify-between h-20 px-4 lg:px-6 border-b border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-3 md:mx-auto lg:mx-0">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-blue-500/20 shrink-0">
              <Compass className="w-6 h-6 text-white animate-pulse" /> {/* Glowing branding icon */}
            </div>
            <div className="md:hidden lg:block">
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                CRM LITE
              </span> {/* Logo Text */}
              <span className="block text-[10px] text-slate-400 light:text-slate-500 font-semibold tracking-widest uppercase">
                Startup Accelerator
              </span> {/* Subtitle */}
            </div>
          </div>
          
          {/* Close button: visible only on mobile layout to hide sidebar, touch-friendly 44x44px target */}
          <button 
            onClick={toggleSidebar} // Invokes toggler to open menu
            className="w-11 h-11 rounded-lg hover:bg-slate-800 light:hover:bg-slate-100 text-slate-400 light:text-slate-550 hover:text-slate-100 light:hover:text-slate-900 md:hidden flex items-center justify-center focus:outline-none transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" /> {/* Dismiss Icon */}
          </button>
        </div>

        {/* Navigation list area */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name} // Unique key for render efficiency
              to={item.path} // Target routing path
              onClick={() => {
                if (isOpen) toggleSidebar(); // Close sidebar on link click (mobile optimization)
              }}
              // Dynamic CSS based on routing active state
              className={({ isActive }) => 
                `flex flex-row items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 group relative overflow-hidden
                md:flex-col md:items-center md:justify-center md:gap-1 md:px-1 md:py-3 md:text-[10px]
                lg:flex-row lg:items-center lg:gap-3.5 lg:px-4 lg:py-3.5 lg:text-sm
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 light:from-blue-100/30 light:to-indigo-50/20 text-blue-400 light:text-blue-600 border-l-4 border-blue-500 shadow-inner' // Active style
                  : 'text-slate-400 light:text-slate-600 hover:bg-slate-800/60 light:hover:bg-slate-100 hover:text-slate-200 light:hover:text-slate-900 border-l-4 border-transparent' // Inactive style
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
        <div className="p-3 border-t border-slate-800 light:border-slate-200 bg-slate-950/40 light:bg-slate-50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/40 light:hover:bg-slate-150/50 transition-colors cursor-pointer group">
            {/* User avatar container */}
            <div className="relative md:mx-auto lg:mx-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" // Unsplash avatar placeholder
                alt="Profile Avatar" 
                className="w-10 h-10 rounded-full object-cover border border-slate-700 light:border-slate-350 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 light:border-white rounded-full"></span> {/* Active online badge */}
            </div>
            {/* User credentials */}
            <div className="flex-1 min-w-0 md:hidden lg:block">
              <p className="text-sm font-semibold text-slate-200 light:text-slate-800 truncate group-hover:text-blue-400 light:group-hover:text-blue-600 transition-colors">Sarah Jenkins</p>
              <p className="text-xs text-slate-500 light:text-slate-400 truncate">Founder & CEO</p>
            </div>
            {/* Settings icon */}
            <Settings className="w-4 h-4 text-slate-500 light:text-slate-400 group-hover:text-slate-300 light:group-hover:text-slate-600 transition-colors md:hidden lg:block" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; // Export component as default
