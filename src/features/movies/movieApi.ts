import { backdropSize, imageBaseUrl, posterSize } from '@/core/config/env';
import { tmdbGet } from '@/core/api/tmdbClient';

import {
  parseMovieDetail,
  parseMoviesFromList,
  type Movie,
  type MovieDetail,
} from '@/features/movies/movieSchema';

function resultsFromEnvelope(json: unknown): unknown[] {
  if (!json || typeof json !== 'object' || !('results' in json)) {
    return [];
  }

  const results = (json as { results: unknown }).results;
  return Array.isArray(results) ? results : [];
}

export function posterUrl(path: string): string {
  if (!path) {
    return '';
  }
  return `${imageBaseUrl}${posterSize}${path}`;
}

export function backdropUrl(path: string): string {
  if (!path) {
    return '';
  }
  return `${imageBaseUrl}${backdropSize}${path}`;
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const json = await tmdbGet('/trending/movie/week');
  return parseMoviesFromList(resultsFromEnvelope(json));
}

export async function getPopularMovies(page = 1): Promise<Movie[]> {
  const json = await tmdbGet('/movie/popular', { page });
  return parseMoviesFromList(resultsFromEnvelope(json));
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const json = await tmdbGet('/search/movie', { query });
  return parseMoviesFromList(resultsFromEnvelope(json));
}

export async function getMovieDetail(id: number): Promise<MovieDetail> {
  const json = await tmdbGet(`/movie/${id}`);
  return parseMovieDetail(json);
}
