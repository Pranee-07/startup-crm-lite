import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

/**
 * Authentication Context definition.
 */
export const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the app and manages authentication state.
 * 
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('crm-token') || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On initial mount, verifies existing localStorage token by calling getProfile().
   * Restores user state if valid; otherwise purges invalid token.
   */
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem('crm-token');
      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await authService.getProfile();
        if (isMounted && response.success && response.user) {
          setUser(response.user);
          setToken(storedToken);
        }
      } catch (error) {
        console.warn('[AuthContext] Session restoration failed:', error?.message);
        localStorage.removeItem('crm-token');
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Authenticates user with email and password.
   * Persists JWT to localStorage and initializes user state.
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.token && response.user) {
        localStorage.setItem('crm-token', response.token);
        setToken(response.token);
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Registers a new user account with name, email, and password.
   * Automatically signs in and stores session JWT on success.
   */
  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.register(name, email, password);
      if (response.token && response.user) {
        localStorage.setItem('crm-token', response.token);
        setToken(response.token);
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logs out the user, removes token from localStorage, and clears authentication state.
   */
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to consume the AuthContext safely.
 * 
 * @returns {NonNullable<React.ContextType<typeof AuthContext>>}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('[useAuth] must be used within an <AuthProvider>');
  }
  return context;
};

export default AuthContext;

