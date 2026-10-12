import { ThemeProvider as NavigationThemeProvider, type Theme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { buildNavigationTheme } from '@/core/theme/navigationTheme';
import { type ThemeTokens, tokensForDarkMode } from '@/core/theme/tokens';
import { useThemeStore } from '@/features/settings/themeStore';

type ThemeContextValue = {
  tokens: ThemeTokens;
  isDarkMode: boolean;
  navigationTheme: Theme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const value = useMemo(() => {
    const tokens = tokensForDarkMode(isDarkMode);
    return {
      tokens,
      isDarkMode,
      navigationTheme: buildNavigationTheme(tokens, isDarkMode),
    };
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      <NavigationThemeProvider value={value.navigationTheme}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        {children}
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/** Stack / tab headers: surface background, token text color, elevation 0. */
export function useThemedHeaderOptions() {
  const { tokens, navigationTheme } = useTheme();

  return useMemo(
    () => ({
      headerStyle: {
        backgroundColor: tokens.surface,
      },
      headerTintColor: tokens.text,
      headerTitleStyle: {
        color: tokens.text,
      },
      headerShadowVisible: false,
      contentStyle: {
        backgroundColor: navigationTheme.colors.background,
      },
    }),
    [navigationTheme.colors.background, tokens.surface, tokens.text],
  );
}
