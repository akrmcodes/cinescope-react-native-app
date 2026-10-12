/** Set via `.env` as EXPO_PUBLIC_TMDB_API_KEY (see `.env.example`). Not committed to git. */
export const tmdbApiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? '';

export const tmdbBaseUrl = 'https://api.themoviedb.org/3';

export const imageBaseUrl = 'https://image.tmdb.org/t/p/';

export const posterSize = 'w500';

export const backdropSize = 'w780';

export const recommendationBaseUrl =
  'https://cinescope-backend-ya4b.onrender.com/api/recommendation';
