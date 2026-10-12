import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

import type { ThemeTokens } from '@/core/theme/tokens';

/** React Navigation theme from CineScope tokens; headers use `card` (surface). */
export function buildNavigationTheme(tokens: ThemeTokens, isDarkMode: boolean): Theme {
  const base = isDarkMode ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: isDarkMode,
    colors: {
      ...base.colors,
      primary: tokens.primary,
      background: tokens.background,
      card: tokens.surface,
      text: tokens.text,
      border: tokens.textMuted,
      notification: tokens.primary,
    },
  };
}
