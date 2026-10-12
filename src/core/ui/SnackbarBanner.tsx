import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/core/theme/ThemeProvider';

const DISPLAY_MS = 2000;

type SnackbarBannerProps = {
  message: string | null;
  onDismiss: () => void;
};

export function SnackbarBanner({ message, onDismiss }: SnackbarBannerProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!message) {
      return;
    }

    const timerId = setTimeout(() => {
      onDismiss();
    }, DISPLAY_MS);

    return () => {
      clearTimeout(timerId);
    };
  }, [message, onDismiss]);

  if (!message) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={[styles.banner, { backgroundColor: tokens.surface }]}>
        <Text style={[styles.text, { color: tokens.text }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
  },
  banner: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
