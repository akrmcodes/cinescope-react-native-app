import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import {
  getMovieDetail,
  getPopularMovies,
  getTrendingMovies,
  searchMovies,
} from '@/features/movies/movieApi';

export const movieQueryKeys = {
  all: ['movies'] as const,
  trending: () => [...movieQueryKeys.all, 'trending'] as const,
  popular: () => [...movieQueryKeys.all, 'popular'] as const,
  search: (query: string) => [...movieQueryKeys.all, 'search', query] as const,
  detail: (id: number) => [...movieQueryKeys.all, 'detail', id] as const,
};

const movieIdSchema = z.coerce.number().finite();

export function useTrendingMovies() {
  return useQuery({
    queryKey: movieQueryKeys.trending(),
    queryFn: getTrendingMovies,
  });
}

export function usePopularMovies() {
  return useQuery({
    queryKey: movieQueryKeys.popular(),
    queryFn: () => getPopularMovies(),
  });
}

/** `query` must already be debounced (500ms) in the search screen. */
export function useMovieSearch(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: movieQueryKeys.search(trimmed),
    queryFn: () => searchMovies(trimmed),
    enabled: trimmed.length > 0,
  });
}

export function useMovieDetail(id: number) {
  const parsedId = movieIdSchema.safeParse(id);

  return useQuery({
    queryKey: movieQueryKeys.detail(parsedId.success ? parsedId.data : -1),
    queryFn: () => {
      if (!parsedId.success) {
        throw new Error('Invalid movie id');
      }
      return getMovieDetail(parsedId.data);
    },
    enabled: parsedId.success,
  });
}
