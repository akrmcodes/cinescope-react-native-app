import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';

/** Minimal shell placeholder until the matching Phase 4 screen is built. */
export function PlaceholderScreen() {
  const { tokens } = useTheme();

  return <View style={[styles.container, { backgroundColor: tokens.background }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
