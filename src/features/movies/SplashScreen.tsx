import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';
import { useSessionStore } from '@/features/session/sessionStore';

const SPLASH_MIN_MS = 2000;

export function SplashScreen() {
  const { tokens } = useTheme();
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const status = useSessionStore((state) => state.status);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const didNavigate = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasHydrated || !minTimeElapsed || didNavigate.current) {
      return;
    }

    didNavigate.current = true;
    if (status === 'signedIn') {
      router.replace('/(app)');
    } else {
      router.replace('/login');
    }
  }, [hasHydrated, minTimeElapsed, status]);

  return (
    <View style={[styles.container, { backgroundColor: tokens.background }]}>
      <Text style={[styles.title, { color: tokens.primary }]}>CineScope</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
  },
});
