import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * @typedef {Object} Lead
 * @property {number|string} [id] - Unique identifier (present in edit mode).
 * @property {string} name - Contact name.
 * @property {string} [contactName] - Alternate name field.
 * @property {string} company - Company name.
 * @property {string} email - Contact email.
 * @property {string} [phone] - Contact phone.
 * @property {string} [status] - Lead status.
 * @property {string} [stage] - Alternate status field.
 * @property {string} [source] - Lead source channel.
 */

/**
 * @typedef {Object} LeadFormProps
 * @property {Lead} [initialData] - Prefilled data if editing an existing lead.
 * @property {(data: Omit<Lead, 'id'> & { id?: number|string }) => void} onSubmit - Form submit handler.
 * @property {() => void} onCancel - Form cancel/close handler.
 */

/**
 * LeadForm component handles adding a new lead or updating an existing lead.
 * Provides client-side validation with responsive screen-reader labels.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @param {LeadFormProps} props - Component props.
 * @returns {React.JSX.Element} The rendered LeadForm component.
 */
const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || initialData?.contactName || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    status: initialData?.status || initialData?.stage || 'New',
    source: initialData?.source || 'Website',
  });

  const [errors, setErrors] = useState({});

  const statusOptions = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sourceOptions = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

  /**
   * Handle changes in inputs and dynamically clear error messages
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Run validation routines against required input elements
   *
   * @returns {boolean} True if validation succeeds.
   */
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Contact name is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Form event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        id: initialData?.id, // include ID if editing
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="flex justify-between items-center pb-3 border-b border-slate-800 light:border-slate-200 transition-colors duration-200">
        <div>
          <h3 className="text-base font-bold text-white light:text-slate-800 tracking-wide">
            {isEditMode ? 'Modify Lead Details' : 'Add New Pipeline Lead'}
          </h3>
          <p className="text-[10px] text-slate-500 light:text-slate-400 font-medium mt-0.5">Fields with * are required</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="w-11 h-11 -mr-2 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-100 light:text-slate-500 light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grid containing input elements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-name" className="text-xs font-semibold text-slate-400 light:text-slate-600 transition-colors duration-200">
            Contact Name *
          </label>
          <input
            id="lead-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl px-4 py-3 min-h-[44px] text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 focus:outline-none focus:ring-1 transition-all duration-200 ${
              errors.name
                ? 'border-red-500/50 light:border-red-500/40 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.name && (
            <span className="text-[10px] text-red-400 light:text-red-550 font-semibold flex items-center gap-1 mt-0.5 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </span>
          )}
        </div>

        {/* Company input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-company" className="text-xs font-semibold text-slate-400 light:text-slate-600 transition-colors duration-200">
            Company Name *
          </label>
          <input
            id="lead-company"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Acme Corp"
            className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl px-4 py-3 min-h-[44px] text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 focus:outline-none focus:ring-1 transition-all duration-200 ${
              errors.company
                ? 'border-red-500/50 light:border-red-500/40 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.company && (
            <span className="text-[10px] text-red-400 light:text-red-550 font-semibold flex items-center gap-1 mt-0.5 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              {errors.company}
            </span>
          )}
        </div>

        {/* Email input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-email" className="text-xs font-semibold text-slate-400 light:text-slate-600 transition-colors duration-200">
            Email Address *
          </label>
          <input
            id="lead-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl px-4 py-3 min-h-[44px] text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 focus:outline-none focus:ring-1 transition-all duration-200 ${
              errors.email
                ? 'border-red-500/50 light:border-red-500/40 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.email && (
            <span className="text-[10px] text-red-400 light:text-red-550 font-semibold flex items-center gap-1 mt-0.5 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </span>
          )}
        </div>

        {/* Phone input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-phone" className="text-xs font-semibold text-slate-400 light:text-slate-600 transition-colors duration-200">
            Phone Number
          </label>
          <input
            id="lead-phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 rounded-xl px-4 py-3 min-h-[44px] focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Status dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-status" className="text-xs font-semibold text-slate-400 light:text-slate-600 transition-colors duration-200">
            Pipeline Status
          </label>
          <select
            id="lead-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 light:text-slate-900 rounded-xl px-4 py-3 min-h-[44px] focus:outline-none cursor-pointer transition-colors duration-200"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-slate-900 light:bg-white text-slate-100 light:text-slate-900">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Source dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-source" className="text-xs font-semibold text-slate-400 light:text-slate-600 transition-colors duration-200">
            Lead Source
          </label>
          <select
            id="lead-source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 light:text-slate-900 rounded-xl px-4 py-3 min-h-[44px] focus:outline-none cursor-pointer transition-colors duration-200"
          >
            {sourceOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-slate-900 light:bg-white text-slate-100 light:text-slate-900">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Button Row actions - touch-friendly minimum 44px height */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 light:border-slate-200 mt-2 transition-colors duration-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 min-h-[44px] flex items-center justify-center text-xs font-semibold bg-slate-950 light:bg-slate-100 hover:bg-slate-850 light:hover:bg-slate-200 text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900 border border-slate-850 light:border-slate-200 hover:border-slate-750 light:hover:border-slate-300 rounded-xl transition-all duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 min-h-[44px] flex items-center justify-center text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          {isEditMode ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
