import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { darkTokens, lightTokens, type ThemeTokens } from '@/core/theme/tokens';

type ThemeContextValue = {
  tokens: ThemeTokens;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Phase 1: fixed dark theme. Phase 3 wires `themeStore`. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({
      tokens: darkTokens,
      isDarkMode: true,
    }),
    [],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function tokensForDarkMode(isDarkMode: boolean): ThemeTokens {
  return isDarkMode ? darkTokens : lightTokens;
}
