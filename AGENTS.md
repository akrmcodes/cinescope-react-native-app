# CineScope React Native — Agent Instructions

Client-quality movie app with the same UI as the Flutter CineScope build.
Plan: `docs/roadmap.md`

## Priorities

1. Match the roadmap’s screens, copy, and TMDB calls
2. Use the production stack below — do not port Flutter Cubits
3. Log each finished phase in `docs/project_log.md`

## Stack

Expo (stable SDK) · TypeScript · Expo Router · TanStack Query · Zustand · Zod · `fetch` · `expo-image` · AsyncStorage

## Structure

```
app/                 # thin routes only
src/features/*       # screens, schemas, queries, stores
src/core/            # theme, TMDB client, shared UI
```

Server data stays in TanStack Query. Session, theme, watchlist, and watched stay in Zustand. No Firebase.

## Hard rules

- No packages beyond the roadmap allowlist
- No new screens or endpoints
- Sign-in is local. The button says **Sign in**
- Staff Pick hides itself on failure
- Android matrix (API 24, 29, 33, 36, plus one physical phone) is part of done

Cursor rules in `.cursor/rules/` expand these constraints.
