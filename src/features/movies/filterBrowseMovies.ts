import type { Movie } from '@/features/movies/movieSchema';

export type BrowseGenreChip = {
  label: string;
  genreId: number | null;
};

/** Roadmap §2.4 — client filter on popular list, no extra TMDB endpoint. */
export const BROWSE_GENRE_CHIPS: readonly BrowseGenreChip[] = [
  { label: 'All', genreId: null },
  { label: 'Action', genreId: 28 },
  { label: 'Comedy', genreId: 35 },
  { label: 'Drama', genreId: 18 },
  { label: 'Sci-Fi', genreId: 878 },
  { label: 'Horror', genreId: 27 },
];

export type BrowseSortMode = 'popular' | 'topRated';

export function filterBrowseMovies(
  movies: Movie[],
  genreId: number | null,
  sort: BrowseSortMode,
): Movie[] {
  const filtered =
    genreId == null
      ? movies
      : movies.filter((movie) => movie.genreIds.includes(genreId));

  if (sort === 'topRated') {
    return [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return filtered;
}

export function browseEmptyMessage(genreLabel: string): string {
  return `No ${genreLabel} movies found`;
}

export function genreLabelForId(genreId: number | null): string {
  const chip = BROWSE_GENRE_CHIPS.find((c) => c.genreId === genreId);
  return chip?.label ?? 'All';
}
