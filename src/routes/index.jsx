import React from 'react'; // Import React for defining the JSX component structure
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route components from react-router-dom to define paths
import Layout from '../components/common/Layout'; // Import the layout component that handles sidebar navigation and page frame

// Lazy load the Dashboard component dynamically to reduce the initial JS bundle size and boost performance
const Dashboard = React.lazy(() => import('../pages/Dashboard')); // Lazily imports the Dashboard component
// Lazy load the Leads (Lead Management) component dynamically
const Leads = React.lazy(() => import('../pages/Leads')); // Lazily imports the Leads component
// Lazy load the Analytics component dynamically
const Analytics = React.lazy(() => import('../pages/Analytics')); // Lazily imports the Analytics component
// Lazy load the CreateLead component dynamically
const CreateLead = React.lazy(() => import('../pages/CreateLead')); // Lazily imports the CreateLead page
// Lazy load the Profile component dynamically
const Profile = React.lazy(() => import('../pages/Profile')); // Lazily imports the Profile page
// Lazy load the Settings component dynamically
const Settings = React.lazy(() => import('../pages/Settings')); // Lazily imports the Settings page
// Lazy load the NotFound component to handle invalid/unknown routing endpoints
const NotFound = React.lazy(() => import('../pages/NotFound')); // Lazily imports the 404 page

// Main routing configuration component to be loaded in the application root (App.jsx)
const AppRoutes = () => {
  return (
    // Outer Routes container: groups and coordinates all route matches
    <Routes>
      
      {/* Root Layout Route: Matches '/' and serves as the layout shell wrapping child views */}
      <Route path="/" element={<Layout />}>
        
        {/* Index Route: Renders the Dashboard component by default when path is exactly '/' */}
        <Route index element={<Dashboard />} />
        
        {/* Leads Route: Renders the Lead Management page when URL is '/leads' */}
        <Route path="leads" element={<Leads />} />
        
        {/* Create Lead Route: Renders the Create Lead page when URL is '/leads/new' */}
        <Route path="leads/new" element={<CreateLead />} />
        
        {/* Profile Route: Renders the Admin Profile page when URL is '/profile' */}
        <Route path="profile" element={<Profile />} />
        
        {/* Settings Route: Renders the Settings page when URL is '/settings' */}
        <Route path="settings" element={<Settings />} />
        
        {/* Analytics Route: Renders the Performance Analytics page when URL is '/analytics' */}
        <Route path="analytics" element={<Analytics />} />
        
        {/* Catch-all Wildcard Route: Renders the NotFound component for any path that does not match the rules above */}
        <Route path="*" element={<NotFound />} />
        
      </Route>

    </Routes>
  );
};

export default AppRoutes; // Export the route configuration component for use in App.jsx
