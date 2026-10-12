import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';
import { useLoginNavigationGuards } from '@/features/session/useAuthNavigationGuards';
import { useSessionStore } from '@/features/session/sessionStore';

function waitForSignInUi(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 300);
    });
  });
}

export function LoginScreen() {
  const { tokens } = useTheme();
  useLoginNavigationGuards();
  const signIn = useSessionStore((state) => state.signIn);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (isSigningIn) {
      return;
    }

    setIsSigningIn(true);
    signIn();
    await waitForSignInUi();
    router.replace('/(app)');
  }, [isSigningIn, signIn]);

  return (
    <View style={[styles.screen, { backgroundColor: tokens.background }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: tokens.surface,
            marginHorizontal: 24,
          },
        ]}
      >
        <Text style={[styles.brandTitle, { color: tokens.primary }]}>CineScope</Text>
        <Text style={[styles.tagline, { color: tokens.textMuted }]}>
          Discover your next favorite movie
        </Text>

        <Pressable
          accessibilityRole="button"
          disabled={isSigningIn}
          onPress={handleSignIn}
          style={({ pressed }) => [
            styles.signInButton,
            {
              backgroundColor: tokens.primary,
              opacity: pressed && !isSigningIn ? 0.9 : 1,
            },
          ]}
        >
          {isSigningIn ? (
            <ActivityIndicator color={tokens.background} />
          ) : (
            <Text style={[styles.signInLabel, { color: tokens.background }]}>Sign in</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  signInButton: {
    alignSelf: 'stretch',
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  signInLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
