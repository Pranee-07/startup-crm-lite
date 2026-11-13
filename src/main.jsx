import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LeadProvider } from './context/LeadContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider is the top-level security layer managing JWT sessions */}
    <AuthProvider>
      {/* LeadProvider manages backend leads API data for authenticated users */}
      <LeadProvider>
        {/* ThemeProvider manages light/dark UI themes globally */}
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </LeadProvider>
    </AuthProvider>
  </StrictMode>,
);
