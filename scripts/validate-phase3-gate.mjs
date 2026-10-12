/**
 * Phase 3 validation gate — simulates kill/reopen via persist rehydrate.
 * Run: node --import ./scripts/phase3-test-setup.mjs --experimental-strip-types scripts/validate-phase3-gate.mjs
 */

const memory = globalThis.__phase3TestMemory;

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function flushPersist() {
  await delay(150);
}

async function waitForPersistedKey(key, predicate) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const raw = memory.get(key);
    if (raw && predicate(raw)) {
      return;
    }
    await delay(100);
  }
  fail(`timed out waiting for persist key ${key}`);
}

/** Rehydrate from disk without writing `unknown` (which would wipe session storage). */
async function simulateColdStartRehydrate(...stores) {
  for (const store of stores) {
    await store.persist.rehydrate();
  }
  await flushPersist();
}

const fakeMovie = {
  id: 999_001,
  title: 'Phase 3 Gate Movie',
  posterPath: '/gate.jpg',
  rating: 7.5,
  releaseDate: '2026-01-01',
  overview: 'Persisted for Phase 3 validation only.',
  genreIds: [18],
};

async function main() {
  if (!memory) {
    fail('Run with: node --import ./scripts/phase3-test-setup.mjs --experimental-strip-types scripts/validate-phase3-gate.mjs');
  }

  const { useSessionStore } = await import('../src/features/session/sessionStore.ts');
  const { useThemeStore } = await import('../src/features/settings/themeStore.ts');
  const { useWatchlistStore } = await import('../src/features/watchlist/watchlistStore.ts');

  memory.clear();
  useSessionStore.setState({ status: 'unknown', hasHydrated: false });
  useThemeStore.setState({ isDarkMode: true });
  useWatchlistStore.setState({ movies: [] });

  useSessionStore.getState().signIn();
  await waitForPersistedKey('cinescope-session', (raw) => raw.includes('signedIn'));

  useSessionStore.setState({ hasHydrated: false });
  await simulateColdStartRehydrate(useSessionStore);

  const sessionAfterReopen = useSessionStore.getState();
  if (!sessionAfterReopen.hasHydrated || sessionAfterReopen.status !== 'signedIn') {
    fail(
      `session after reopen: expected signedIn + hydrated, got ${sessionAfterReopen.status} hydrated=${sessionAfterReopen.hasHydrated}`,
    );
  }
  pass('sign in survives kill/reopen (signedIn after hydration)');

  useThemeStore.getState().setDarkMode(false);
  await waitForPersistedKey('cinescope-theme', (raw) => raw.includes('false'));

  const themePersisted = JSON.parse(memory.get('cinescope-theme'));
  if (themePersisted.state?.isDarkMode !== false) {
    fail('theme storage: expected isDarkMode false after toggle');
  }
  if (useThemeStore.getState().isDarkMode !== false) {
    fail('theme state: expected light mode (isDarkMode false)');
  }
  await simulateColdStartRehydrate(useThemeStore);
  if (useThemeStore.getState().isDarkMode !== false) {
    fail('theme after rehydrate: expected light mode (isDarkMode false)');
  }
  pass('dark mode off survives kill/reopen (still light)');

  useWatchlistStore.getState().addMovie(fakeMovie);
  await waitForPersistedKey('cinescope-watchlist', (raw) => raw.includes(String(fakeMovie.id)));

  await simulateColdStartRehydrate(useWatchlistStore);

  const watchlistAfterReopen = useWatchlistStore.getState().movies;
  if (!watchlistAfterReopen.some((movie) => movie.id === fakeMovie.id)) {
    fail('watchlist after reopen: fake movie missing');
  }
  pass('fake watchlist movie survives kill/reopen');

  const watchlistBeforeSignOut = useWatchlistStore.getState().movies.length;
  useSessionStore.getState().signOut();
  await flushPersist();

  const watchlistAfterSignOut = useWatchlistStore.getState().movies.length;
  if (watchlistAfterSignOut !== watchlistBeforeSignOut) {
    fail('sign out emptied the in-memory watchlist');
  }

  const watchlistRaw = memory.get('cinescope-watchlist');
  if (!watchlistRaw || !watchlistRaw.includes(String(fakeMovie.id))) {
    fail('sign out removed watchlist data from storage');
  }

  const sessionRaw = memory.get('cinescope-session');
  if (!sessionRaw || !sessionRaw.includes('signedOut')) {
    fail('sign out did not persist signedOut session status');
  }
  pass('sign out does not empty the watchlist');

  console.log('\nPhase 3 validation gate script completed successfully.');
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
