import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LeadProvider } from './context/LeadContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* LeadProvider is the outermost data layer so any nested provider
        or component can consume the leads store without restriction. */}
    <LeadProvider>
      {/* ThemeProvider sits inside LeadProvider; it can read leads if ever
          needed for theme-aware logic, and supplies dark/light state globally. */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </LeadProvider>
  </StrictMode>,
)
