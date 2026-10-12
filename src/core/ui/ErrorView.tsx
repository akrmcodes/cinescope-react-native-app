import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';

type ErrorViewProps = {
  message?: string;
  onRetry: () => void;
};

export function ErrorView({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorViewProps) {
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: tokens.background }]}>
      <Text style={[styles.message, { color: tokens.textMuted }]}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={({ pressed }) => [
          styles.retryButton,
          { backgroundColor: tokens.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.retryLabel, { color: tokens.background }]}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  retryLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
