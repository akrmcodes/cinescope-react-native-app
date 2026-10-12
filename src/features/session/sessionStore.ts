import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SessionStatus = 'unknown' | 'signedIn' | 'signedOut';

type PersistedSessionStatus = 'signedIn' | 'signedOut';

type SessionState = {
  status: SessionStatus;
  hasHydrated: boolean;
  hydrate: (persistedStatus?: PersistedSessionStatus) => void;
  signIn: () => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      status: 'unknown',
      hasHydrated: false,
      hydrate: (persistedStatus) => {
        set({
          hasHydrated: true,
          status: persistedStatus === 'signedIn' ? 'signedIn' : 'signedOut',
        });
      },
      signIn: () => set({ status: 'signedIn' }),
      signOut: () => set({ status: 'signedOut' }),
    }),
    {
      name: 'cinescope-session',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        if (state.status === 'signedIn' || state.status === 'signedOut') {
          return { status: state.status };
        }
        return {};
      },
      onRehydrateStorage: () => (state) => {
        useSessionStore
          .getState()
          .hydrate(state?.status as PersistedSessionStatus | undefined);
      },
    },
  ),
);
