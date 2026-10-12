# CineScope React Native — project log

Newest entries first.

## 2026-10-13 — Phase 2 contracts and server state

**Phase:** Phase 2  
**Status:** Done

### What changed

- TMDB key via `EXPO_PUBLIC_TMDB_API_KEY` in gitignored `.env`; [`.env.example`](../.env.example) for clones (public GitHub).
- [`src/core/api/tmdbClient.ts`](../src/core/api/tmdbClient.ts) — `tmdbGet`, status errors, unknown JSON.
- [`src/features/movies/movieApi.ts`](../src/features/movies/movieApi.ts) — four TMDB functions + `posterUrl` / `backdropUrl`.
- [`src/features/recommendation/recommendationApi.ts`](../src/features/recommendation/recommendationApi.ts) — Staff Pick fetch + Zod parse.
- [`src/features/movies/movieQueries.ts`](../src/features/movies/movieQueries.ts) and [`recommendationQueries.ts`](../src/features/recommendation/recommendationQueries.ts) — hooks per §7.1.
- Validation: `node --env-file=.env scripts/validate-phase2.mjs` (all checks passed, including Staff Pick).
- Removed stale `src/app/` template routes.

### Experiment note

- Time spent: (fill after review)
- Comprehension (`movieQueries.ts` for a Next.js reader): ___ minutes
- Confusing part:

## 2026-10-13 — Phase 1 foundation

**Phase:** Phase 1  
**Status:** Done

### What changed

- Scaffold: Expo SDK **57.0.28**, React Native **0.86.3**, Node **v24.11.1**; Expo Go on device reports SDK **57** (client 57.0.9).
- Installed allowlist deps: `@tanstack/react-query`, `zustand`, `zod`, `expo-image`, `@react-native-async-storage/async-storage`.
- Replaced the default template (`src/app` welcome UI) with roadmap `app/` routes and `src/core` theme, env, and Query client.
- Splash route: centered **CineScope**, primary on background (navigation wired in Phase 4).
- Preserved `docs/`, `.cursor/`, and `AGENTS.md`.

### Experiment note

- Time spent: ~setup day (create-expo-app install ~8m, deps, first run on Samsung S21 FE Android 16).
- Comprehension: N/A for Phase 1.
- Confusing part: SDK 57 default template keeps routes under `src/app`; the roadmap expects root `app/`, so routes were moved to match the plan.
