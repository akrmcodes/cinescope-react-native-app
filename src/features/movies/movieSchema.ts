import { z } from 'zod';

function formatZodError(context: string, error: z.ZodError): string {
  const details = error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      return `${path}: ${issue.message}`;
    })
    .join('; ');
  return `${context} parse failed: ${details}`;
}

function nullishStringToEmpty(value: unknown): string {
  if (value == null) {
    return '';
  }
  return String(value);
}

function nullishStringToUnknown(value: unknown): string {
  if (value == null || value === '') {
    return 'Unknown';
  }
  return String(value);
}

function nullishNumberToZero(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  return value;
}

function nullishGenreIds(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((id): id is number => typeof id === 'number' && !Number.isNaN(id));
}

/** Canonical app shape for list rows, watchlist, and watched entries. */
export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  posterPath: z.string(),
  rating: z.number(),
  releaseDate: z.string(),
  overview: z.string(),
  genreIds: z.array(z.number()),
});

export type Movie = z.infer<typeof movieSchema>;

/** Detail screen shape; extends list fields with backdrop, runtime, and genre names. */
export const movieDetailSchema = movieSchema.extend({
  backdropPath: z.string(),
  runtime: z.number(),
  genres: z.array(z.string()),
});

export type MovieDetail = z.infer<typeof movieDetailSchema>;

const tmdbListMovieSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    poster_path: z.preprocess(nullishStringToEmpty, z.string()),
    vote_average: z.preprocess(nullishNumberToZero, z.number()),
    release_date: z.preprocess(nullishStringToUnknown, z.string()),
    overview: z.preprocess(nullishStringToEmpty, z.string()),
    genre_ids: z.preprocess(nullishGenreIds, z.array(z.number())),
  })
  .transform((item) => ({
    id: item.id,
    title: item.title,
    posterPath: item.poster_path,
    rating: item.vote_average,
    releaseDate: item.release_date,
    overview: item.overview,
    genreIds: item.genre_ids,
  }));

const tmdbGenreSchema = z.object({
  name: z.string(),
});

const tmdbMovieDetailSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    poster_path: z.preprocess(nullishStringToEmpty, z.string()),
    backdrop_path: z.preprocess(nullishStringToEmpty, z.string()),
    vote_average: z.preprocess(nullishNumberToZero, z.number()),
    release_date: z.preprocess(nullishStringToUnknown, z.string()),
    overview: z.preprocess(nullishStringToEmpty, z.string()),
    runtime: z.preprocess(nullishNumberToZero, z.number()),
    genres: z.preprocess(
      (value: unknown) => (Array.isArray(value) ? value : []),
      z.array(tmdbGenreSchema),
    ),
  })
  .transform((item) => {
    const posterPath = item.poster_path;
    const backdropPath = item.backdrop_path || posterPath;

    return {
      id: item.id,
      title: item.title,
      posterPath,
      backdropPath,
      rating: item.vote_average,
      releaseDate: item.release_date,
      overview: item.overview,
      runtime: item.runtime,
      genreIds: [] as number[],
      genres: item.genres.map((genre) => genre.name),
    };
  });

/** Drops invalid TMDB list items instead of failing the whole response. */
export function parseMoviesFromList(items: unknown): Movie[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const movies: Movie[] = [];

  for (const item of items) {
    const parsed = tmdbListMovieSchema.safeParse(item);
    if (!parsed.success) {
      continue;
    }

    const validated = movieSchema.safeParse(parsed.data);
    if (validated.success) {
      movies.push(validated.data);
    }
  }

  return movies;
}

/** Fails the query when TMDB detail JSON is invalid; message is suitable for Retry UI. */
export function parseMovieDetail(raw: unknown): MovieDetail {
  const parsed = tmdbMovieDetailSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(formatZodError('Movie detail', parsed.error));
  }

  const validated = movieDetailSchema.safeParse(parsed.data);
  if (!validated.success) {
    throw new Error(formatZodError('Movie detail', validated.error));
  }

  return validated.data;
}
