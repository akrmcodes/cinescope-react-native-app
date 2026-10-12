import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';

/** Phase 4.3 replaces this stub with the tab shell and HomeScreen. */
export default function HomePlaceholder() {
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: tokens.background }]}>
      <Text style={[styles.label, { color: tokens.textMuted }]}>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
  },
});
