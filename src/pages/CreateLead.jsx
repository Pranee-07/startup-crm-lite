import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import LeadForm from '../components/leads/LeadForm';

/**
 * CreateLead page component allowing the user to create a new pipeline lead
 * in a dedicated full-screen layout.
 *
 * @returns {React.JSX.Element} The rendered CreateLead component.
 */
const CreateLead = () => {
  const navigate = useNavigate();
  const { addLead } = useLeads();

  /**
   * Delegates the form submission data to LeadContext.addLead,
   * triggers a success toast, and redirects back to the main Leads list.
   *
   * @param {object} formData - Form details collected from LeadForm.
   */
  const handleFormSubmit = (formData) => {
    addLead({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      source: formData.source,
    });
    toast.success(`${formData.name} created successfully.`);
    navigate('/leads');
  };

  /**
   * Action handler to cancel and navigate back to the main leads view.
   */
  const handleCancel = () => {
    navigate('/leads');
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Back navigation button */}
      <div className="flex items-center">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-100 light:text-slate-655 light:hover:text-slate-900 bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:-translate-x-0.5"
          title="Back to Leads"
          aria-label="Go back to Leads page"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leads</span>
        </button>
      </div>

      {/* Main card containing LeadForm */}
      <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md transition-colors duration-200">
        <LeadForm onSubmit={handleFormSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default CreateLead;
