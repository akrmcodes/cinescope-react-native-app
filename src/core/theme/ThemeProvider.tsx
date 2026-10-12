import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { useThemeStore } from '@/features/settings/themeStore';

import { type ThemeTokens, tokensForDarkMode } from '@/core/theme/tokens';

type ThemeContextValue = {
  tokens: ThemeTokens;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const value = useMemo(
    () => ({
      tokens: tokensForDarkMode(isDarkMode),
      isDarkMode,
    }),
    [isDarkMode],
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
