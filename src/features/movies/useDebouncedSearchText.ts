import { useEffect, useState } from 'react';

const DEFAULT_DELAY_MS = 500;

/**
 * Debounces search input for TMDB. Clears immediately when trim is empty (cancels pending timer).
 */
export function useDebouncedSearchText(text: string, delayMs = DEFAULT_DELAY_MS): string {
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const trimmed = text.trim();

    if (trimmed.length === 0) {
      setDebounced('');
      return;
    }

    const timerId = setTimeout(() => {
      setDebounced(trimmed);
    }, delayMs);

    return () => {
      clearTimeout(timerId);
    };
  }, [text, delayMs]);

  return debounced;
}
