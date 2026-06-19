import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Briefcase, FileText, ArrowLeft, Camera } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'crm_profile_v1';
const defaultProfile = {
  firstName: 'Sarah',
  lastName: 'Jenkins',
  email: 'sarah.jenkins@accelerator.io',
  phone: '+1 (555) 234-5678',
  title: 'Founder & CEO',
  company: 'Startup Accelerator',
  bio: 'Entrepreneur and investor passionate about scaling early-stage ventures. Helping founders build the future of software, automation, and AI tooling.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
};

/**
 * Profile page component displaying and editing Sarah Jenkins' user info.
 * Uses custom Tailwind CSS v4 variables and classes for theme support.
 *
 * @returns {React.JSX.Element} The rendered Profile component.
 */
const Profile = () => {
  const navigate = useNavigate();
  
  // Load initial profile details from localStorage
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [errors, setErrors] = useState({});

  /**
   * Input value changer
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Submit validator
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Quick validation checks
    const newErrors = {};
    if (!profile.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!profile.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!profile.email.trim()) newErrors.email = 'Email is required';
    if (!profile.title.trim()) newErrors.title = 'Job title is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please correct the errors in the form.');
      return;
    }

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error('[Profile] Failed to save updates to storage:', err);
    }

    toast.success('Profile updated successfully!');
    // Simulation: redirect back to dashboard after a short delay
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
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

      {/* Main card */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md transition-colors duration-200">
        
        {/* Banner area */}
        <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-800 light:border-slate-200 mb-6 transition-colors">
          
          {/* Avatar frame */}
          <div className="relative group">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Sarah Jenkins Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-800 light:bg-slate-100 flex items-center justify-center border-2 border-slate-700 light:border-slate-300 text-slate-300 light:text-slate-600 text-2xl font-bold shadow-lg">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
            )}
            <button 
              type="button"
              onClick={() => toast.success('Avatar editing is simulated in this Lite version. Use the button to the right to toggle image presence.')}
              className="absolute bottom-0 right-0 p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full text-white shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
              title="Upload new avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core titles */}
          <div className="text-center md:text-left flex-1">
            <h3 className="text-xl font-extrabold text-white light:text-slate-800">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-xs text-blue-400 light:text-blue-600 font-bold mt-1 uppercase tracking-wider">{profile.title}</p>
            <p className="text-[11px] text-slate-500 light:text-slate-400 mt-0.5">{profile.company}</p>
            
            {/* Photo state modifier */}
            <div className="mt-2">
              {profile.avatar ? (
                <button
                  type="button"
                  onClick={() => setProfile((prev) => ({ ...prev, avatar: '' }))}
                  className="text-[10px] font-bold text-red-400 hover:text-red-300 light:text-red-550 light:hover:text-red-700 transition-colors cursor-pointer"
                >
                  Remove Photo (Make Blank)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setProfile((prev) => ({ ...prev, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' }))}
                  className="text-[10px] font-bold text-blue-400 hover:text-blue-300 light:text-blue-650 light:hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Restore Avatar Image
                </button>
              )}
            </div>
          </div>

          {/* Account status badge */}
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Owner Account
          </span>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* First Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-firstName" className="text-xs font-semibold text-slate-400 light:text-slate-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                First Name *
              </label>
              <input
                id="profile-firstName"
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl px-4 py-3 min-h-[44px] text-slate-100 light:text-slate-900 focus:outline-none focus:ring-1 transition-all duration-200 ${
                  errors.firstName
                    ? 'border-red-500/50 light:border-red-500/40 focus:ring-red-500 focus:border-red-500'
                    : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.firstName && <span className="text-[10px] text-red-400 light:text-red-550 font-semibold">{errors.firstName}</span>}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-lastName" className="text-xs font-semibold text-slate-400 light:text-slate-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Last Name *
              </label>
              <input
                id="profile-lastName"
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl px-4 py-3 min-h-[44px] text-slate-100 light:text-slate-900 focus:outline-none focus:ring-1 transition-all duration-200 ${
                  errors.lastName
                    ? 'border-red-500/50 light:border-red-500/40 focus:ring-red-500 focus:border-red-500'
                    : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.lastName && <span className="text-[10px] text-red-400 light:text-red-550 font-semibold">{errors.lastName}</span>}
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-email" className="text-xs font-semibold text-slate-400 light:text-slate-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Email Address *
              </label>
              <input
                id="profile-email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl px-4 py-3 min-h-[44px] text-slate-100 light:text-slate-900 focus:outline-none focus:ring-1 transition-all duration-200 ${
                  errors.email
                    ? 'border-red-500/50 light:border-red-500/40 focus:ring-red-500 focus:border-red-500'
                    : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.email && <span className="text-[10px] text-red-400 light:text-red-550 font-semibold">{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-phone" className="text-xs font-semibold text-slate-400 light:text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Phone Number
              </label>
              <input
                id="profile-phone"
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 light:text-slate-900 rounded-xl px-4 py-3 min-h-[44px] focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Job Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-title" className="text-xs font-semibold text-slate-400 light:text-slate-600 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                Job Title *
              </label>
              <input
                id="profile-title"
                type="text"
                name="title"
                value={profile.title}
                onChange={handleChange}
                className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl px-4 py-3 min-h-[44px] text-slate-100 light:text-slate-900 focus:outline-none focus:ring-1 transition-all duration-200 ${
                  errors.title
                    ? 'border-red-500/50 light:border-red-500/40 focus:ring-red-500 focus:border-red-500'
                    : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.title && <span className="text-[10px] text-red-400 light:text-red-550 font-semibold">{errors.title}</span>}
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-company" className="text-xs font-semibold text-slate-400 light:text-slate-600 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                Company
              </label>
              <input
                id="profile-company"
                type="text"
                name="company"
                value={profile.company}
                disabled
                className="w-full text-xs bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-slate-500 rounded-xl px-4 py-3 min-h-[44px] focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* Biography */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="profile-bio" className="text-xs font-semibold text-slate-400 light:text-slate-600 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Short Bio
              </label>
              <textarea
                id="profile-bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 light:text-slate-900 rounded-xl p-4 focus:outline-none transition-all duration-200 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800 light:border-slate-200 transition-colors duration-200">
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
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
export { Profile as ProfilePage };
