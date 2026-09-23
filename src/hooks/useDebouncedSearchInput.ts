// src/hooks/useDebouncedSearchInput.ts
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface UseDebouncedSearchInputOptions {
  /** The committed/external value — source of truth (usually the URL param) */
  value: string;
  /** Called (debounced) once the user pauses typing */
  onChange: (value: string) => void;
  /** ms to wait after the last keystroke. Default 400. */
  delay?: number;
}

/**
 * A search input that types instantly but reports changes debounced,
 * while staying in sync with an external reset (e.g. a "clear filters"
 * button, browser back/forward) — without useEffect.
 *
 * Why not useEffect: syncing local state FROM a prop THROUGH an effect
 * causes an extra render pass and is the exact pattern React's own
 * linter flags ("Avoid calling setState directly within an effect").
 * Adjusting state during render (comparing against the previous prop
 * value) is the documented alternative — one render, no cascade.
 *
 * Usage:
 *   const search = useDebouncedSearchInput({
 *     value: filters.query,
 *     onChange: (v) => setFilters({ query: v || null, page: null }),
 *   });
 *   <Input {...search} />
 */
export function useDebouncedSearchInput({
  value,
  onChange,
  delay = 400,
}: UseDebouncedSearchInputOptions) {
  const [localValue, setLocalValue] = useState(value);
  const [lastExternalValue, setLastExternalValue] = useState(value);

  // Adjusting state during render, not in an effect — see comment above.
  if (value !== lastExternalValue) {
    setLastExternalValue(value);
    setLocalValue(value);
  }

  const debouncedOnChange = useDebouncedCallback((next: string) => {
    onChange(next);
  }, delay);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setLocalValue(next); // instant visual feedback
    debouncedOnChange(next); // reported after the pause
  }

  return {
    value: localValue,
    onChange: handleChange,
  };
}