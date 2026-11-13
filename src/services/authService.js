import api from './api';

/**
 * Authentication Service Module.
 * Encapsulates HTTP client interactions with the Express.js auth endpoints.
 * Unwraps Axios response and returns payload `response.data`.
 */

/**
 * Registers a new account.
 * 
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password (min 6 characters)
 * @returns {Promise<{ success: boolean, message: string, token: string, user: Object }>}
 */
export const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

/**
 * Authenticates user credentials with backend.
 * 
 * @param {string} email - Account email
 * @param {string} password - Account password
 * @returns {Promise<{ success: boolean, message: string, token: string, user: Object }>}
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};

/**
 * Logs out the active user session.
 * Removes token from localStorage and notifies the backend.
 */
export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch {
    // Ignore server error on logout; client token removal is the source of truth
  } finally {
    localStorage.removeItem('crm-token');
  }
};

/**
 * Fetches the currently authenticated user's profile details.
 * 
 * @returns {Promise<{ success: boolean, user: Object }>}
 */
export const getProfile = async () => {
  const response = await api.get('/api/auth/profile');
  return response.data;
};

/**
 * Updates profile attributes (e.g. name, password).
 * 
 * @param {Object} data - Update payload { name?, currentPassword?, newPassword? }
 * @returns {Promise<{ success: boolean, message: string, user: Object }>}
 */
export const updateProfile = async (data) => {
  const response = await api.put('/api/auth/profile', data);
  return response.data;
};

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};
