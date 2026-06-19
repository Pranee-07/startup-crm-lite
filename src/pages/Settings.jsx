import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Bell, 
  Sun, 
  Moon, 
  Lock, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';

/**
 * Settings page component presenting general config preferences.
 * Integrates theme context for light/dark mode triggers.
 *
 * @returns {React.JSX.Element} The rendered Settings component.
 */
const Settings = () => {
  const navigate = useNavigate();
  const { isLightMode, toggleTheme } = useTheme();

  // General settings state configuration
  const [general, setGeneral] = useState({
    companyName: 'Startup Accelerator',
    currency: 'USD',
    timezone: 'UTC-5 (EST)',
    language: 'English',
  });

  // Notification toggles state configuration
  const [notifications, setNotifications] = useState({
    newLeads: true,
    weeklyReport: true,
    reminders: false,
    systemUpdates: true,
  });

  // Security preferences state
  const [twoFactor, setTwoFactor] = useState(false);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneral((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
    setTimeout(() => {
      navigate('/');
    }, 850);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header controls with a back button */}
      <div className="flex items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-100 light:text-slate-655 light:hover:text-slate-900 bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:-translate-x-0.5"
          title="Back to Dashboard"
          aria-label="Go back to Dashboard overview"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column Settings Navigation Categories */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md">
              <h3 className="font-extrabold text-sm text-white light:text-slate-800 pb-3 border-b border-slate-800 light:border-slate-200 mb-3 flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 text-blue-500" />
                Settings Menu
              </h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <a href="#general" className="block px-3 py-2.5 rounded-xl font-semibold text-blue-400 light:text-blue-650 bg-blue-500/10 light:bg-blue-50/50">
                    General Preferences
                  </a>
                </li>
                <li>
                  <a href="#appearance" className="block px-3 py-2.5 rounded-xl font-medium text-slate-400 light:text-slate-600 hover:bg-slate-850 light:hover:bg-slate-100 transition-colors">
                    Theme & Appearance
                  </a>
                </li>
                <li>
                  <a href="#notifications" className="block px-3 py-2.5 rounded-xl font-medium text-slate-400 light:text-slate-600 hover:bg-slate-850 light:hover:bg-slate-100 transition-colors">
                    Notifications Setup
                  </a>
                </li>
                <li>
                  <a href="#security" className="block px-3 py-2.5 rounded-xl font-medium text-slate-400 light:text-slate-600 hover:bg-slate-850 light:hover:bg-slate-100 transition-colors">
                    Security & Access
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column Settings Fields */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Preferences section */}
            <div id="general" className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md transition-colors">
              <h4 className="font-bold text-sm text-white light:text-slate-800 pb-3 border-b border-slate-800 light:border-slate-200 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                General Preferences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="settings-company" className="text-xs font-semibold text-slate-400 light:text-slate-600">Company Name</label>
                  <input
                    id="settings-company"
                    type="text"
                    name="companyName"
                    value={general.companyName}
                    onChange={handleGeneralChange}
                    className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 light:text-slate-900 rounded-xl px-4 py-3 min-h-[44px] focus:outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="settings-currency" className="text-xs font-semibold text-slate-400 light:text-slate-600">Base Currency</label>
                  <select
                    id="settings-currency"
                    name="currency"
                    value={general.currency}
                    onChange={handleGeneralChange}
                    className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 light:text-slate-900 rounded-xl px-4 py-3 min-h-[44px] focus:outline-none cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="settings-timezone" className="text-xs font-semibold text-slate-400 light:text-slate-600">Timezone</label>
                  <input
                    id="settings-timezone"
                    type="text"
                    name="timezone"
                    value={general.timezone}
                    onChange={handleGeneralChange}
                    className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 light:text-slate-900 rounded-xl px-4 py-3 min-h-[44px] focus:outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="settings-language" className="text-xs font-semibold text-slate-400 light:text-slate-600">Language</label>
                  <select
                    id="settings-language"
                    name="language"
                    value={general.language}
                    onChange={handleGeneralChange}
                    className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 light:text-slate-900 rounded-xl px-4 py-3 min-h-[44px] focus:outline-none cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="Hindi">हिन्दी</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Theme & Appearance section */}
            <div id="appearance" className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md transition-colors">
              <h4 className="font-bold text-sm text-white light:text-slate-800 pb-3 border-b border-slate-800 light:border-slate-200 mb-4 flex items-center gap-2">
                {isLightMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-400" />}
                Theme & Appearance
              </h4>
              <div className="flex items-center justify-between gap-4 p-4 bg-slate-950 light:bg-slate-50 border border-slate-850 light:border-slate-150 rounded-2xl transition-colors">
                <div>
                  <h5 className="text-xs font-bold text-slate-200 light:text-slate-800">Application Mode</h5>
                  <p className="text-[10px] text-slate-500 light:text-slate-400 mt-0.5">Toggle between dark and light appearance modes.</p>
                </div>
                
                {/* Responsive toggle container */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 p-1 bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl cursor-pointer"
                >
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${!isLightMode ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-950'}`}>
                    <Moon className="w-3 h-3" />
                    Dark
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${isLightMode ? 'bg-slate-100 text-slate-850 shadow' : 'text-slate-400 hover:text-slate-100'}`}>
                    <Sun className="w-3 h-3" />
                    Light
                  </span>
                </button>
              </div>
            </div>

            {/* Notifications settings section */}
            <div id="notifications" className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md transition-colors">
              <h4 className="font-bold text-sm text-white light:text-slate-800 pb-3 border-b border-slate-800 light:border-slate-200 mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                Notification Alerts
              </h4>
              <div className="space-y-4">
                {[
                  { key: 'newLeads', title: 'New lead assignments', desc: 'Notify when a new pipeline lead is allocated.' },
                  { key: 'weeklyReport', title: 'Weekly pipeline digest', desc: 'Receive automated summaries of lead metrics.' },
                  { key: 'reminders', title: 'Task follow-up alerts', desc: 'Remind when scheduled meetings or proposals are pending.' },
                  { key: 'systemUpdates', title: 'Product notifications', desc: 'Get updates on system changes and alerts.' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-bold text-slate-200 light:text-slate-800">{item.title}</h5>
                      <p className="text-[10px] text-slate-500 light:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    {/* Toggle Slider Switch */}
                    <button
                      type="button"
                      onClick={() => handleNotificationToggle(item.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        notifications[item.key] ? 'bg-blue-600' : 'bg-slate-850 light:bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security preferences section */}
            <div id="security" className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md transition-colors">
              <h4 className="font-bold text-sm text-white light:text-slate-800 pb-3 border-b border-slate-800 light:border-slate-200 mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-violet-400" />
                Security & Access
              </h4>
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200 light:text-slate-800 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      Two-Factor Authentication (2FA)
                    </h5>
                    <p className="text-[10px] text-slate-500 light:text-slate-400 mt-0.5">Secure your owner account with mobile authenticator codes.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      twoFactor ? 'bg-blue-600' : 'bg-slate-850 light:bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        twoFactor ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex flex-col gap-2 pt-3 border-t border-slate-800/50 light:border-slate-200/50">
                  <h5 className="text-xs font-bold text-slate-200 light:text-slate-800">Password Configuration</h5>
                  <p className="text-[10px] text-slate-500 light:text-slate-400">Request a secure password reset link to your owner email.</p>
                  <button
                    type="button"
                    onClick={() => toast.success('Password reset link sent to your registered email.')}
                    className="self-start px-4 py-2 text-[10px] font-bold bg-slate-950 light:bg-slate-100 hover:bg-slate-850 light:hover:bg-slate-200 text-slate-300 light:text-slate-800 border border-slate-850 light:border-slate-200 rounded-xl transition-all cursor-pointer"
                  >
                    Request Password Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-850 light:border-slate-150">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 min-h-[44px] flex items-center justify-center text-xs font-semibold bg-slate-950 light:bg-slate-100 hover:bg-slate-850 light:hover:bg-slate-200 text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900 border border-slate-850 light:border-slate-200 hover:border-slate-750 light:hover:border-slate-300 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 min-h-[44px] flex items-center justify-center text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Save Settings
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
export { Settings as SettingsPage };
