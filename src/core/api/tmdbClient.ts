import { tmdbApiKey, tmdbBaseUrl } from '@/core/config/env';

const missingKeyMessage =
  'TMDB API key is missing. Copy .env.example to .env and set EXPO_PUBLIC_TMDB_API_KEY, then restart Metro.';

type TmdbQueryValue = string | number | boolean | undefined;

function buildTmdbUrl(path: string, query?: Record<string, TmdbQueryValue>): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = tmdbBaseUrl.endsWith('/') ? tmdbBaseUrl : `${tmdbBaseUrl}/`;
  const url = new URL(normalizedPath.slice(1), base);

  url.searchParams.set('api_key', tmdbApiKey);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/** Low-level TMDB GET; returns raw JSON for Zod parsing in feature APIs. */
export async function tmdbGet(
  path: string,
  query?: Record<string, TmdbQueryValue>,
): Promise<unknown> {
  if (!tmdbApiKey) {
    throw new Error(missingKeyMessage);
  }

  const url = buildTmdbUrl(path, query);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status} for ${path}`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error(`TMDB response was not valid JSON for ${path}`);
  }
}
