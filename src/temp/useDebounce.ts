// src/hooks/useDebounce.ts
import { useCallback, useRef } from "react";

/**
 * Returns a debounced version of the provided callback.
 * The callback is delayed by `delay` ms after the last invocation.
 *
 * Uses useRef to avoid recreating the timer on every render.
 */
export function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );
}
