import asyncStorage from '@/core/storage/asyncStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeState = {
  isDarkMode: boolean;
  setDarkMode: (isDarkMode: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: true,
      setDarkMode: (isDarkMode) => set({ isDarkMode }),
    }),
    {
      name: 'cinescope-theme',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    },
  ),
);
