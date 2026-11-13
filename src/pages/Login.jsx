import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Login page component for user authentication in Startup CRM Lite.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email.trim(), formData.password);
      toast.success('Welcome back! Signed in successfully.');
      navigate('/');
    } catch (error) {
      const resData = error?.response?.data;
      let msg = resData?.message;
      if (resData?.errors) {
        if (Array.isArray(resData.errors)) {
          msg = resData.errors.map((e) => e.message || e.msg).join(', ');
        } else if (typeof resData.errors === 'object') {
          msg = Object.values(resData.errors).join(', ');
        }
      }
      msg = msg || error?.message || 'Authentication failed. Please verify your credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 light:bg-slate-50 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 mb-3 shadow-lg shadow-blue-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white light:text-slate-900">
            Startup CRM Lite
          </h1>
          <p className="text-xs text-slate-400 light:text-slate-500 mt-1">
            Sign in to manage your pipeline, deals, and customer contacts.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl transition-colors duration-200">
          <h2 className="text-lg font-semibold text-white light:text-slate-900 mb-6 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-blue-500" />
            Account Sign In
          </h2>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-slate-400 light:text-slate-600"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@startup.io"
                  disabled={isLoading}
                  className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-slate-400 light:text-slate-600"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium text-xs px-4 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to CRM</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Register */}
          <div className="mt-6 pt-5 border-t border-slate-800 light:border-slate-200 text-center">
            <p className="text-xs text-slate-400 light:text-slate-500">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-500 hover:text-blue-400 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

