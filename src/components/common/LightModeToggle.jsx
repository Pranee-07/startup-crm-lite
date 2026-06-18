import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * LightModeToggle component provides a beautiful, animated toggle switch
 * with a Sun icon (active in Dark Mode) and a Moon icon (active in Light Mode).
 * It shows the current theme state text and triggers the global theme transition.
 *
 * @returns {React.JSX.Element}
 */
const LightModeToggle = () => {
  const { isLightMode, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2.5">
      {/* Visual toggle pill container */}
      <button
        onClick={toggleTheme}
        type="button"
        aria-label={`Switch to ${isLightMode ? 'Dark' : 'Light'} Mode`}
        className="relative flex items-center justify-between w-14 h-7 p-1 bg-slate-950 light:bg-slate-200 border border-slate-800 light:border-slate-350 rounded-full cursor-pointer focus:outline-none transition-colors duration-200 select-none group"
      >
        {/* Sliding Indicator Ball */}
        <span
          className={`absolute top-0.5 bottom-0.5 left-0.5 w-5.5 h-5.5 rounded-full bg-blue-600 light:bg-indigo-600 transition-all duration-200 shadow-md ${
            isLightMode ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
        
        {/* Sun Icon (representing dark mode toggle status) */}
        <Sun 
          className={`w-3.5 h-3.5 z-10 transition-colors duration-200 ml-1 ${
            !isLightMode ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
          }`} 
        />
        
        {/* Moon Icon (representing light mode toggle status) */}
        <Moon 
          className={`w-3.5 h-3.5 z-10 transition-colors duration-200 mr-1 ${
            isLightMode ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'
          }`} 
        />
      </button>

      {/* Mode Status Label Text */}
      <span className="text-xs font-semibold text-slate-400 light:text-slate-600 min-w-[72px] select-none transition-colors duration-200">
        {isLightMode ? 'Light Mode' : 'Dark Mode'}
      </span>
    </div>
  );
};

export default LightModeToggle;
