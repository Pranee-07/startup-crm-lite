import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Debounced search bar component with clear button.
 *
 * @param {object}   props
 * @param {string}   props.value      - Controlled input value (debounced output)
 * @param {Function} props.onChange   - Called with the debounced search string
 * @returns {React.JSX.Element}
 */
const SearchBar = ({ value, onChange }) => {
  // Internal instant value drives the input display; debounced value propagates up
  const [inputValue, setInputValue] = useState(value ?? '');
  const debounceTimer = useRef(null);

  // Sync internal state if the parent resets the value externally (e.g., clear filters)
  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  /**
   * Handle raw input changes — update local state instantly, debounce parent callback
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = (e) => {
    const raw = e.target.value;
    setInputValue(raw);

    // Clear any pending debounce timer
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // Schedule parent callback 300 ms after user stops typing
    debounceTimer.current = setTimeout(() => {
      onChange(raw);
    }, 300);
  };

  /**
   * Instantly clear the search — both internal and parent state
   */
  const handleClear = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setInputValue('');
    onChange('');
  };

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  return (
    <div className="relative w-full xl:w-80 group">
      {/* Magnifying glass icon */}
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
        <Search
          className={`w-4 h-4 transition-colors duration-200 ${
            inputValue ? 'text-blue-400' : 'text-slate-500 light:text-slate-400'
          }`}
        />
      </span>

      {/* Controlled text input */}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search by name, company, or email..."
        aria-label="Search leads by name, company, or email"
        className="
          w-full pl-9 pr-9 py-2.5 text-xs
          bg-slate-950 light:bg-white border border-slate-800 light:border-slate-200 rounded-xl
          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          text-slate-200 light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400
          transition-all duration-200
          hover:border-slate-700 light:hover:border-slate-300
        "
      />

      {/* Clear (×) button — only visible when there is text */}
      {inputValue && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="
            absolute inset-y-0 right-0 flex items-center pr-3
            text-slate-500 hover:text-slate-200 light:hover:text-slate-700
            transition-colors duration-150
            focus:outline-none
            cursor-pointer
          "
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
