import { type Href, router } from 'expo-router';

export function signOutAndNavigateToLogin(signOut: () => void): void {
  signOut();
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.replace('/login' as Href);
}
