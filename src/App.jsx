import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter to enable HTML5 history API navigation routing
import { Toaster } from 'react-hot-toast'; // Import Toast notification component
import AppRoutes from './routes'; // Import our centralized route definition file containing the path mappings

// Define the root App component that wraps the application structure
function App() {
  return (
    // Wrap the entire application routing hierarchy inside BrowserRouter
    <BrowserRouter>
      {/* Global toast notification system container */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#0F172A',
            color: '#F8FAFC',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
      {/* Render the centralized route configuration component */}
      <AppRoutes />
      
    </BrowserRouter>
  );
}

export default App; // Export App component as default for main.jsx to mount
