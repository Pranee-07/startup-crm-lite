import React, { useState, Suspense } from 'react'; // Import React, state hook, and Suspense for lazy loading fallback handling
import { Outlet, useLocation, NavLink } from 'react-router-dom'; // Import Outlet, useLocation, and NavLink
import Sidebar from './Sidebar'; // Import the custom Sidebar component
import Loader from './Loader'; // Import the custom fallback Loader component
import LightModeToggle from './LightModeToggle'; // Import the new theme toggle component
// Import modern utility icons from lucide-react
import { 
  Menu,    // Menu toggle icon for mobile layout
  Bell,    // Notification bell icon
  Search,  // Search bar glass icon
  Plus,     // Add resource quick-action button icon
  LayoutDashboard, // Dashboard icon
  Users,           // Leads icon
  BarChart3        // Analytics icon
} from 'lucide-react';

// Main Layout shell that wraps all dashboard sub-views
const Layout = () => {
  // State to manage whether the mobile drawer sidebar is currently visible
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Get location details from the router to dynamically set page header titles
  const location = useLocation();

  // Helper function to switch the sidebar visibility state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggles true/false state
  };

  // Helper function to determine the visual page title based on current browser path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard Overview'; // Title for root path
      case '/leads':
        return 'Lead Pipeline'; // Title for leads path
      case '/analytics':
        return 'Performance Analytics'; // Title for analytics path
      default:
        return 'Not Found'; // Fallback title
    }
  };

  return (
    // Outer shell: full width/height layout with slate dark background for a premium look
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 font-sans transition-colors duration-200">
      
      {/* Renders Sidebar and passes visibility state and toggle callback */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area Container: fills remaining horizontal space and spans vertically */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        
        {/* Top Header Bar: Handles desktop titles, quick actions, search, and mobile navigation toggling */}
        <header className="flex items-center justify-between h-20 px-6 bg-slate-900 light:bg-white border-b border-slate-800 light:border-slate-200 shrink-0 transition-colors duration-200">
          
          {/* Left section: mobile hamburger trigger and page title */}
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger: visible only below lg breakpoint */}
            {/* Mobile menu trigger: visible only below md breakpoint, touch-friendly 44x44px target */}
            <button 
              onClick={toggleSidebar} // Invokes toggler to open menu drawer
              className="w-11 h-11 -ml-2 rounded-lg text-slate-400 light:text-slate-600 hover:text-slate-100 light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-100 md:hidden flex items-center justify-center focus:outline-none transition-colors duration-200"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" /> {/* Hamburger Menu Icon */}
            </button>
            {/* Location-aware Header Title with gradient text styling */}
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 light:from-slate-800 light:via-slate-700 light:to-slate-900 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right section: Search bar, notification alerts, CTA button */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Search input: hidden on smaller mobile devices */}
            <div className="relative hidden md:block w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400 light:text-slate-500" /> {/* Search Icon indicator */}
              </span>
              <input 
                type="text" 
                placeholder="Search CRM..." // Placeholder prompt
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 transition-all duration-200"
              />
            </div>

            {/* Theme Toggle Component */}
            <LightModeToggle />

            {/* Quick action: Create New Lead button */}
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> {/* Plus Icon */}
              <span className="hidden sm:inline">Add Lead</span> {/* Responsive label display */}
            </button>

            {/* Notification alert bell */}
            <button className="relative p-2 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-slate-400 light:text-slate-600 hover:text-slate-100 light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
              <Bell className="w-4 h-4" /> {/* Notification bell icon */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> {/* Pulsing green badge indicator */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span> {/* Core badge indicator */}
            </button>

          </div>
        </header>

        {/* Content viewport: Houses the active routed view */}
        {/* pb-24 adds bottom padding on mobile to clear the bottom navigation bar */}
        <main className="flex-1 overflow-y-auto bg-slate-950/20 light:bg-slate-100/30 p-6 pb-24 md:pb-8 md:p-8 transition-colors duration-200">
          
          {/* Suspense element wraps nested Route outlets, showing Loader while dynamic imports load */}
          <Suspense fallback={<Loader />}>
            <Outlet /> {/* Target viewport matching active child route */}
          </Suspense>
          
        </main>

        {/* Mobile Bottom Navigation Bar (Icons only, touch-friendly 44x44px targets, visible only on mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 light:bg-white border-t border-slate-800 light:border-slate-200 flex items-center justify-around z-30 px-4 transition-colors duration-200">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `w-12 h-12 flex items-center justify-center rounded-xl transition-colors
              ${isActive ? 'text-blue-500 bg-blue-500/10' : 'text-slate-400 light:text-slate-600 hover:bg-slate-800 light:hover:bg-slate-100'}`
            }
            aria-label="Dashboard"
          >
            <LayoutDashboard className="w-6 h-6" />
          </NavLink>
          <NavLink
            to="/leads"
            className={({ isActive }) => 
              `w-12 h-12 flex items-center justify-center rounded-xl transition-colors
              ${isActive ? 'text-blue-500 bg-blue-500/10' : 'text-slate-400 light:text-slate-600 hover:bg-slate-800 light:hover:bg-slate-100'}`
            }
            aria-label="Leads"
          >
            <Users className="w-6 h-6" />
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => 
              `w-12 h-12 flex items-center justify-center rounded-xl transition-colors
              ${isActive ? 'text-blue-500 bg-blue-500/10' : 'text-slate-400 light:text-slate-600 hover:bg-slate-800 light:hover:bg-slate-100'}`
            }
            aria-label="Analytics"
          >
            <BarChart3 className="w-6 h-6" />
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Layout; // Export layout wrapper
