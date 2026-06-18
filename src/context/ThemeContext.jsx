import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * @typedef {Object} ThemeContextValue
 * @property {boolean}  isLightMode   - True when light mode is active
 * @property {() => void} toggleTheme - Flips between dark and light mode
 */

const THEME_STORAGE_KEY = 'isLightMode';

// ─── Context creation ────────────────────────────────────────────────────────

/** @type {React.Context<ThemeContextValue|null>} */
export const ThemeContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * ThemeProvider manages the application's light / dark mode preference.
 * It persists the choice to localStorage and applies (or removes) the
 * `light` class on `document.documentElement` so Tailwind's light-mode
 * utilities work globally.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element}
 */
export const ThemeProvider = ({ children }) => {
  /**
   * Initialise from localStorage on first render.
   * Defaults to `false` (dark mode) when no stored preference exists.
   *
   * @returns {boolean}
   */
  const [isLightMode, setIsLightMode] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  // Keep the DOM class and localStorage in sync whenever isLightMode changes
  useEffect(() => {
    const root = document.documentElement;
    if (isLightMode) {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isLightMode));
    } catch (err) {
      console.error('[ThemeContext] Failed to persist theme preference:', err);
    }
  }, [isLightMode]);

  /**
   * Flips the current light-mode state.
   * Stable reference guaranteed by useCallback.
   */
  const toggleTheme = useCallback(() => {
    setIsLightMode((prev) => !prev);
  }, []);

  /** @type {ThemeContextValue} */
  const value = { isLightMode, toggleTheme };

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
