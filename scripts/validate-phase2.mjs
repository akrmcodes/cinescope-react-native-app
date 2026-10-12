/**
 * Phase 2 validation gate — run from repo root:
 *   node --env-file=.env scripts/validate-phase2.mjs
 */

const TMDB_BASE = 'https://api.themoviedb.org/3';
const RECOMMENDATION_URL =
  'https://cinescope-backend-ya4b.onrender.com/api/recommendation';
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

async function tmdbGet(path, query = {}) {
  if (!API_KEY) {
    fail('EXPO_PUBLIC_TMDB_API_KEY is not set (use --env-file=.env)');
  }

  const url = new URL(path.replace(/^\//, ''), `${TMDB_BASE}/`);
  url.searchParams.set('api_key', API_KEY);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`TMDB ${path} returned status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function main() {
  const trending = await tmdbGet('/trending/movie/week');
  const trendingResults = Array.isArray(trending.results) ? trending.results : [];
  const withPoster = trendingResults.some(
    (item) => item && typeof item.poster_path === 'string' && item.poster_path.length > 0,
  );
  if (!withPoster) {
    fail('trending: no movie with a poster path');
  }
  pass('trending returns movies with poster paths');

  const search = await tmdbGet('/search/movie', { query: 'inception' });
  const searchResults = Array.isArray(search.results) ? search.results : [];
  if (searchResults.length === 0) {
    fail('search: inception returned an empty list');
  }
  pass('search for inception returns a non-empty list');

  const detail = await tmdbGet('/movie/27205');
  if (!(detail.runtime > 0)) {
    fail('detail 27205: missing runtime');
  }
  if (!Array.isArray(detail.genres) || detail.genres.length === 0) {
    fail('detail 27205: missing genres');
  }
  const backdrop = detail.backdrop_path || detail.poster_path;
  if (!backdrop || typeof backdrop !== 'string') {
    fail('detail 27205: missing backdrop/poster path');
  }
  pass('detail 27205 has runtime, genres, and backdrop path');

  try {
    await tmdbGet('/movie/999999999');
    fail('invalid id: expected TMDB error, got success');
  } catch (error) {
    const status = error?.status;
    if (status !== 404 && status !== 401) {
      fail(`invalid id: expected 404, got ${status ?? error.message}`);
    }
    pass('invalid movie id surfaces an HTTP error (not a silent success)');
  }

  try {
    const recResponse = await fetch(RECOMMENDATION_URL);
    if (!recResponse.ok) {
      pass(`recommendation returned status ${recResponse.status} (UI may hide Staff Pick)`);
    } else {
      const recJson = await recResponse.json();
      if (!recJson?.recommendation?.title) {
        fail('recommendation: success response missing recommendation.title');
      }
      pass(`recommendation returned title "${recJson.recommendation.title}"`);
    }
  } catch {
    pass('recommendation request failed (UI may hide Staff Pick)');
  }

  console.log('\nPhase 2 validation script completed successfully.');
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
