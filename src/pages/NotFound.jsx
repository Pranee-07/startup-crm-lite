import React from 'react'; // Import React for rendering JSX
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for SPA navigation without full refreshes
// Import modern icons from lucide-react to augment layout styling
import { 
  Home,        // Home icon for redirect CTA button
  ShieldAlert, // Warning warning icon
  ArrowLeft    // Return back symbol
} from 'lucide-react';

const NotFound = () => {
  return (
    // Fullscreen flex container centering page content with mode-specific colors
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-slate-100 light:text-slate-800 px-4 select-none relative transition-colors duration-200">
      
      {/* Decorative gradient glow orb in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-blue-600/10 light:from-blue-600/5 via-purple-600/10 to-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main glassmorphic container box */}
      <div className="relative z-10 text-center max-w-lg p-8 rounded-3xl bg-slate-900/60 light:bg-white border border-slate-800 light:border-slate-200 backdrop-blur-md shadow-2xl transition-colors duration-200">
        
        {/* Glow indicator icon header */}
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-400 light:text-rose-600 rounded-2xl mb-6 shadow-inner animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Large 404 Error Header with blue-to-purple glowing gradient */}
        <h1 className="text-7xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-blue-400 light:from-blue-600 via-indigo-400 light:via-indigo-500 to-purple-400 light:to-purple-600 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
          404
        </h1>

        {/* Text warning label */}
        <h3 className="text-lg md:text-xl font-bold text-slate-200 light:text-slate-800 mt-4 tracking-wide">
          Resource Out of Reach
        </h3>

        {/* Detailed page context explanation */}
        <p className="text-xs md:text-sm text-slate-400 light:text-slate-500 mt-2 leading-relaxed font-medium">
          The dashboard link or database file you are trying to retrieve doesn't exist, has been moved, or resides in another workspace directory.
        </p>

        {/* Button container for redirection back to active dashboard */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-8">
          
          {/* Link component wraps button for router handling */}
          <Link 
            to="/" // Target home path
            className="flex items-center gap-2 px-5 py-3 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto justify-center cursor-pointer"
          >
            <Home className="w-4 h-4" /> {/* Home Icon */}
            <span>Return to Dashboard</span> {/* Redirect Label */}
          </Link>
          
        </div>

      </div>

    </div>
  );
};

export default NotFound; // Export NotFound component
