import { type Href, router } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

import { useSessionStore } from '@/features/session/sessionStore';

/** Redirects to login when the tab shell is shown without a signed-in session. */
export function useProtectedAppShell(): void {
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const status = useSessionStore((state) => state.status);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    if (status !== 'signedIn') {
      router.replace('/login' as Href);
    }
  }, [hasHydrated, status]);
}

/** Keeps signed-in users off login and blocks Android back into the shell after sign-out. */
export function useLoginNavigationGuards(): void {
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const status = useSessionStore((state) => state.status);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    if (status === 'signedIn') {
      router.replace('/(app)');
    }
  }, [hasHydrated, status]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!hasHydrated) {
        return false;
      }
      if (status === 'signedOut') {
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, [hasHydrated, status]);
}
