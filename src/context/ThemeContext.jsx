import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * @typedef {Object} ThemeContextValue
 * @property {boolean}  isDarkMode   - True when dark mode is active
 * @property {() => void} toggleTheme - Flips between dark and light mode
 */

const THEME_STORAGE_KEY = 'crm_theme_dark';

// ─── Context creation ────────────────────────────────────────────────────────

/** @type {React.Context<ThemeContextValue|null>} */
export const ThemeContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * ThemeProvider manages the application's dark / light mode preference.
 * It persists the choice to localStorage and applies (or removes) the
 * `dark` class on `document.documentElement` so Tailwind's dark-mode
 * utilities work globally.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element}
 */
export const ThemeProvider = ({ children }) => {
  /**
   * Initialise from localStorage on first render.
   * Defaults to `false` (light mode) when no stored preference exists.
   *
   * @returns {boolean}
   */
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  // Keep the DOM class and localStorage in sync whenever isDarkMode changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
    } catch (err) {
      console.error('[ThemeContext] Failed to persist theme preference:', err);
    }
  }, [isDarkMode]);

  /**
   * Flips the current dark-mode state.
   * Stable reference guaranteed by useCallback.
   */
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  /** @type {ThemeContextValue} */
  const value = { isDarkMode, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ─── Custom hook ─────────────────────────────────────────────────────────────

/**
 * Convenience hook that returns the full ThemeContext value.
 * Throws a descriptive error when called outside of <ThemeProvider>.
 *
 * @returns {ThemeContextValue}
 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error(
      '[useTheme] must be used inside a <ThemeProvider>. ' +
      'Make sure <ThemeProvider> wraps your component tree in main.jsx.'
    );
  }
  return ctx;
};
