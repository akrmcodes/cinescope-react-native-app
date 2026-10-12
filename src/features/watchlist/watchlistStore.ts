import asyncStorage from '@/core/storage/asyncStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Movie } from '@/features/movies/movieSchema';

type WatchlistState = {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      movies: [],
      addMovie: (movie) => {
        const exists = get().movies.some((item) => item.id === movie.id);
        if (exists) {
          return;
        }
        set({ movies: [...get().movies, movie] });
      },
      removeMovie: (id) => {
        set({ movies: get().movies.filter((movie) => movie.id !== id) });
      },
      isInWatchlist: (id) => get().movies.some((movie) => movie.id === id),
    }),
    {
      name: 'cinescope-watchlist',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({ movies: state.movies }),
    },
  ),
);
