import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, UserPlus, AlertCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Registration page component for creating new CRM accounts.
 */
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      toast.success('Account created successfully! Welcome to Startup CRM Lite.');
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
      msg = msg || error?.message || 'Registration failed. Please review your details and try again.';
      setServerError(msg);
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
            Create an account to streamline deals, leads, and customer analytics.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl transition-colors duration-200">
          <h2 className="text-lg font-semibold text-white light:text-slate-900 mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            Create Account
          </h2>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-xs font-semibold text-slate-400 light:text-slate-600"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Sarah Jenkins"
                  disabled={isLoading}
                  className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl pl-10 pr-4 py-3 text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 focus:outline-none focus:ring-1 transition-all duration-200 ${
                    errors.name
                      ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.name && (
                <span className="text-[11px] text-red-400 mt-0.5">{errors.name}</span>
              )}
            </div>

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
                  placeholder="sarah@accelerator.io"
                  disabled={isLoading}
                  className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl pl-10 pr-4 py-3 text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 focus:outline-none focus:ring-1 transition-all duration-200 ${
                    errors.email
                      ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-red-400 mt-0.5">{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-slate-400 light:text-slate-600"
              >
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl pl-10 pr-4 py-3 text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 focus:outline-none focus:ring-1 transition-all duration-200 ${
                    errors.password
                      ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.password && (
                <span className="text-[11px] text-red-400 mt-0.5">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-slate-400 light:text-slate-600"
              >
                Confirm Password
              </label>
              <div className="relative">
                <CheckCircle2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full text-xs bg-slate-950 light:bg-white border rounded-xl pl-10 pr-4 py-3 text-slate-100 light:text-slate-900 placeholder-slate-600 light:placeholder-slate-400 focus:outline-none focus:ring-1 transition-all duration-200 ${
                    errors.confirmPassword
                      ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-800 light:border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-[11px] text-red-400 mt-0.5">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 mt-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium text-xs px-4 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Login */}
          <div className="mt-6 pt-5 border-t border-slate-800 light:border-slate-200 text-center">
            <p className="text-xs text-slate-400 light:text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-500 hover:text-blue-400 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

