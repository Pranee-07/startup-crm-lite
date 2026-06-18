import React from 'react'; // Import React to define the JSX component

// Define a functional component Loader that displays a clean, animated spinner
const Loader = () => {
  return (
    // Outer container: takes full viewport height and width, centering content vertically and horizontally with a sleek slate background
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 transition-colors duration-200">
      
      {/* Relative wrapper for the spinning loader circles to overlay them correctly */}
      <div className="relative w-20 h-20">
        
        {/* Outer ring: absolute positioning, full size, border width 4, blue/purple gradient color scheme, animated with a smooth spin */}
        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
        
        {/* Inner ring: absolute positioning, smaller inset, border width 4, opposite gradient, spinning counter-clockwise for visual depth */}
        <div className="absolute inset-2 border-4 border-t-transparent border-r-cyan-400 border-b-transparent border-l-pink-500 rounded-full animate-spin [animation-direction:reverse]"></div>
        
        {/* Central glow: subtle backdrop blur and radial gradient overlay for premium lighting feel */}
        <div className="absolute inset-4 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-sm"></div>
      </div>

      {/* Text container with margin-top for separation, rendering a stylized subtitle */}
      <div className="mt-6 text-center">
        {/* Heading with a glowing blue-to-pink gradient, semi-bold weight, and wide letter spacing */}
        <h3 className="text-lg font-semibold tracking-wider bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
          STARTUP CRM
        </h3>
        {/* Subtle loading text with light opacity and small font size, displaying a pulse animation */}
        <p className="text-xs text-slate-400 light:text-slate-500 mt-1 animate-pulse tracking-widest">
          LOADING RESOURCES...
        </p>
      </div>

    </div>
  );
};

export default Loader; // Export the Loader component as the default export
