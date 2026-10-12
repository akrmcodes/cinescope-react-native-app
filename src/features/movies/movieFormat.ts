import type { Movie, MovieDetail } from '@/features/movies/movieSchema';

/** §2.4 — first four characters when releaseDate is at least four chars. */
export function releaseYear(releaseDate: string): string {
  if (releaseDate.length >= 4) {
    return releaseDate.slice(0, 4);
  }
  return releaseDate;
}

/** §2.3 — poster badge uses one decimal. */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function movieFromDetail(detail: MovieDetail): Movie {
  return {
    id: detail.id,
    title: detail.title,
    posterPath: detail.posterPath,
    rating: detail.rating,
    releaseDate: detail.releaseDate,
    overview: detail.overview,
    genreIds: detail.genreIds,
  };
}
