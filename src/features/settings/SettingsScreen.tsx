import { type Href, router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';
import { SECTION_HORIZONTAL_PADDING } from '@/features/movies/homeLayout';
import { useSessionStore } from '@/features/session/sessionStore';
import { useThemeStore } from '@/features/settings/themeStore';

export function SettingsScreen() {
  const { tokens } = useTheme();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setDarkMode = useThemeStore((state) => state.setDarkMode);
  const signOut = useSessionStore((state) => state.signOut);

  const handleSignOut = useCallback(() => {
    signOut();
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/login' as Href);
  }, [signOut]);

  return (
    <View style={[styles.screen, { backgroundColor: tokens.background }]}>
      <View style={[styles.row, { backgroundColor: tokens.surface }]}>
        <Text style={[styles.rowLabel, { color: tokens.text }]}>Dark mode</Text>
        <Switch
          accessibilityLabel="Dark mode"
          onValueChange={setDarkMode}
          thumbColor={tokens.surface}
          trackColor={{ false: tokens.textMuted, true: tokens.primary }}
          value={isDarkMode}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={handleSignOut}
        style={({ pressed }) => [
          styles.signOutRow,
          { backgroundColor: tokens.surface, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <Text style={[styles.signOutLabel, { color: tokens.text }]}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: SECTION_HORIZONTAL_PADDING,
    paddingTop: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  signOutRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
  },
  signOutLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
