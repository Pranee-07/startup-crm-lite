import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Normalizes the API base URL.
 * Supports both VITE_API_BASE_URL and VITE_API_URL.
 * The standard base URL for local development is http://localhost:5000/api.
 */
const rawBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const baseURL = rawBaseURL.replace(/\/+$/, '');

/**
 * Pre-configured Axios instance for communicating with the Startup CRM Lite Express backend.
 */
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second request timeout
});

/**
 * Request Interceptor:
 * 1. Intelligently prevents double /api/api path prefixing regardless of baseURL configuration.
 * 2. Extracts JWT token from localStorage and attaches Bearer authorization header.
 */
api.interceptors.request.use(
  (config) => {
    // If baseURL ends with /api and endpoint url also starts with /api/, strip leading /api to avoid /api/api
    if (
      config.baseURL &&
      config.baseURL.replace(/\/+$/, '').endsWith('/api') &&
      config.url &&
      config.url.startsWith('/api/')
    ) {
      config.url = config.url.replace(/^\/api/, '');
    }

    // If baseURL does not end with /api and url lacks /api, prepend /api
    if (
      config.baseURL &&
      !config.baseURL.replace(/\/+$/, '').endsWith('/api') &&
      config.url &&
      !config.url.startsWith('/api/') &&
      !config.url.startsWith('http')
    ) {
      config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
    }

    // Fallback: sanitize any residual /api/api/ occurrences
    if (config.url && config.url.startsWith('/api/api/')) {
      config.url = config.url.replace('/api/api/', '/api/');
    }

    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * - On 401 Unauthorized: Clears stored session credentials and redirects to /login.
 * - On Network Error: Displays user-facing diagnostic toast.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Network connectivity failure (server unreachable, DNS fail, CORS, etc.)
    if (!error.response) {
      toast.error('Cannot connect to server. Check your connection.', {
        id: 'network-error-toast', // Prevent duplicate toast cascades
      });
      return Promise.reject(error);
    }

    // 401 Unauthorized response from backend
    if (error.response.status === 401) {
      localStorage.removeItem('crm-token');
      // Redirect to login unless already navigating authentication screens
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
