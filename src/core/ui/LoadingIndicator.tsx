import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';

type LoadingIndicatorProps = {
  /** When false, the indicator sizes to its content instead of filling the parent. */
  fill?: boolean;
};

export function LoadingIndicator({ fill = true }: LoadingIndicatorProps) {
  const { tokens } = useTheme();

  return (
    <View style={[fill ? styles.fill : styles.inline, { backgroundColor: tokens.background }]}>
      <ActivityIndicator color={tokens.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
});
