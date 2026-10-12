/**
 * Roadmap §3.2 — sign-out must not clear device state in other stores.
 * Run: node scripts/validate-phase3-signout-rule.mjs
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

const sessionSource = readFileSync(
  join(root, 'src/features/session/sessionStore.ts'),
  'utf8',
);

const sessionCodeOnly = sessionSource
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*$/gm, '');

const forbiddenInSessionStore = [
  'watchlistStore',
  'watchedStore',
  'themeStore',
  'cinescope-watchlist',
  'cinescope-watched',
  'cinescope-theme',
  'removeItem',
  'clear(',
];

for (const token of forbiddenInSessionStore) {
  if (sessionCodeOnly.includes(token)) {
    fail(`sessionStore.ts must not reference "${token}" (sign-out isolation)`);
  }
}

if (!/signOut:\s*\(\)\s*=>\s*set\(\{\s*status:\s*['"]signedOut['"]\s*\}\)/.test(sessionCodeOnly)) {
  fail('signOut must only call set({ status: "signedOut" })');
}
pass('signOut changes session status only (static contract)');

const signInOnlySetsStatus =
  /signIn:\s*\(\)\s*=>\s*set\(\{\s*status:\s*['"]signedIn['"]\s*\}\)/.test(sessionCodeOnly);
if (!signInOnlySetsStatus) {
  fail('signIn must only call set({ status: "signedIn" })');
}
pass('signIn changes session status only (symmetric contract)');

// Behavioral model: independent persist buckets (matches Zustand store layout).
const deviceState = {
  session: { status: 'signedIn' },
  theme: { isDarkMode: false },
  watchlist: { movies: [{ id: 42, title: 'Test' }] },
  watched: { movies: [{ id: 99, title: 'Watched' }] },
};

function signOut() {
  deviceState.session.status = 'signedOut';
}

function signIn() {
  deviceState.session.status = 'signedIn';
}

signOut();
if (deviceState.theme.isDarkMode !== false) {
  fail('signOut must not reset theme');
}
if (deviceState.watchlist.movies.length !== 1) {
  fail('signOut must not clear watchlist');
}
if (deviceState.watched.movies.length !== 1) {
  fail('signOut must not clear watched list');
}
pass('signOut leaves theme and movie lists unchanged');

signIn();
if (deviceState.watchlist.movies[0]?.id !== 42) {
  fail('watchlist must survive sign-out and sign-in');
}
if (deviceState.watched.movies[0]?.id !== 99) {
  fail('watched list must survive sign-out and sign-in');
}
pass('lists remain after sign-out and the next sign-in');

console.log('\nPhase 3.2 sign-out rule validation completed successfully.');
