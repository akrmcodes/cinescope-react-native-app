# CineScope — React Native Execution Roadmap

> **Date:** 13 October 2026  
> **Product:** CineScope — the same movie-discovery app as the Flutter build  
> **Kind of work:** Client delivery, used as a controlled technology experiment  
> **Audience:** A team that knows React and Next.js and has not shipped React Native  
> **Out of scope for this document:** Creating the app. This file is the plan. Implementation follows it phase by phase.

The visual result, copy, and movie data must match the running Flutter app in `cinescope/lib` as of 13 October 2026. The code does not copy Flutter’s Cubit folders, packages, or patterns. React Native is implemented with the current production stack so the team can see what the platform actually feels like, then measure whether React and Next.js experience makes that code readable.

---

## Roadmap Overview

```
Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4 ──▶ Phase 5 ──▶ Phase 6
Foundation   Server      Device      UI parity   Android     Decision
             state       state                   matrix
```

| Phase | Depends on | Delivers |
|---|---|---|
| **1** | None | Runnable Expo app, theme tokens, empty route map, project log |
| **2** | Phase 1 | Validated TMDB and Staff Pick contracts, query hooks |
| **3** | Phase 1 | Persisted session, theme, watchlist, and watched list |
| **4** | Phases 2 and 3 | Every screen matching the Flutter UI |
| **5** | Phase 4 | The same script passed on four Android versions plus one physical phone |
| **6** | Phase 5 | Written decision: React Native or PWA for the graduation project |

Do not start a phase until the previous validation gate is checked. After each phase, append `docs/project_log.md` and record the comprehension time from the experiment protocol.

---

## 1. Experiment Charter

### Question

Can this team ship a client-quality React Native app that matches CineScope, and can people who already know React and Next.js read that code quickly enough to choose React Native for the graduation project?

### Hypothesis

Expo Router, TanStack Query, and Zustand are close enough to Next.js App Router plus normal React data-fetching that a reader can explain a route, a query hook, and a store in under ten minutes each, after the app is finished.

### Controls (keep these identical)

- Same screens, copy, colors, spacing, and navigation outcomes as the Flutter app
- Same four TMDB endpoints and the same image sizes
- Same Staff Pick URL and the same “hide the card if it fails” behavior
- Same local outcomes: session remembered, theme remembered, watchlist and watched lists remembered after the app is killed

### Independent variable

The client platform and its production toolchain: Expo, TypeScript, Expo Router, TanStack Query, Zustand.

### Dependent variables

| Variable | How it is measured |
|---|---|
| UI parity | Phase 4 checklist, item by item |
| Device reliability | Phase 5 matrix, pass/fail per Android version |
| Comprehension | Minutes for a React/Next.js reader to explain three files, Phase 6 |
| Setup friction | Clock time recorded at the end of Phase 1 |

### What this experiment does not decide by itself

A high parity score with a low comprehension score means the platform can do the job and this team should not adopt it yet. Record that distinction in Phase 6. Do not let a pleasant UI hide an unreadable codebase.

---

## 2. Product Parity

The Flutter academic roadmap’s early checklist is not the target. That checklist still describes Google Sign-In, swipe-to-delete, and a Staff Pick fallback. The running app no longer does those things. Match the screens below.

### 2.1 Screens and copy

| Screen | What the user sees |
|---|---|
| Splash | Centered word **CineScope**, amber, weight bold, about 40px. After 2 seconds, replace with Login or the tab shell. |
| Login | Centered card. Title **CineScope** (amber, ~32px, bold). Tagline **Discover your next favorite movie**. One button. |
| Shell | Five tabs: Home, Browse, Watchlist, Watched, Settings. Header titles: **CineScope**, **Browse**, **My Watchlist**, **Watched**, **Settings**. A search icon appears only on Home. |
| Home | Staff Pick card, heading **Trending This Week**, horizontal posters, heading **Popular Movies**, two-column grid. |
| Browse | Chips: All, Action, Comedy, Drama, Sci-Fi, Horror. Label **Sort by**. Values **Popular** and **Top Rated**. Two-column grid. Empty copy: `No {Genre} movies found`. |
| Search | Own header **Search**, back control, field hint **Search for movies...**, autofocus. States: **Search for your favorite movies**, loading, grid, **No movies found**, error with Retry. |
| Detail | Collapsing backdrop, pinned bar, check icon, bookmark icon. Body: title, `{year} · ★ {rating} · {runtime} min`, genre chips, heading **Synopsis**, overview. |
| Watchlist | Rows: poster, title, year, overflow menu. Empty: **Your watchlist is empty**. Menu: **View Details**, **Remove from Watchlist**, **Mark as Watched**. |
| Watched | Same row layout. Empty: **No watched movies yet**. Menu: **Remove from Watched**. |
| Settings | **Dark mode** switch, default on. **Sign out** row. No TMDB footer. |

Snackbars, exact strings:

- `{title} added to watchlist`
- `{title} removed from watchlist`
- `{title} marked as watched`
- `{title} removed from watched`

Tapping a poster, a watchlist row, or a watched row opens Detail. The watchlist menu item **View Details** does the same. **Mark as Watched** adds the movie to the watched list and does not remove it from the watchlist. The two lists are independent.

### 2.2 Layout numbers

Taken from the Flutter views. Keep them.

| Element | Value |
|---|---|
| Screen padding on section titles | 16 |
| Trending row height | 220 |
| Trending card width | 130 |
| Horizontal card gap | 8 (4 on each side) |
| Grid columns | 2 |
| Grid card aspect ratio | 0.65 (width / height) |
| Grid gap | 8 |
| Detail backdrop height | 300, pinned |
| Staff Pick poster | 60 × 90, radius 8 |
| List-row poster | 50 × 75, radius 6 |
| Poster card radius | 8 |
| Login card padding | 32 inside, 24 outside |

### 2.3 Color tokens

Define these once in `src/core/theme/tokens.ts`. Screens read the active theme. Do not paste hex values into screens.

**Dark (default)**

| Token | Hex |
|---|---|
| primary | `#F5A623` |
| background | `#121212` |
| surface | `#1E1E1E` |
| text | `#F5F5F5` |
| textMuted | `#9E9E9E` |

**Light**

| Token | Hex |
|---|---|
| primary | `#F5A623` |
| background | `#F5F5F5` |
| surface | `#FFFFFF` |
| text | `#121212` |
| textMuted | `#616161` |

Poster rating badge: amber text on `rgba(0,0,0,0.54)`, 12px, bold, one decimal. Title sits on a bottom gradient, off-white, 13px, max two lines. Missing posters use the surface color and a simple movie glyph.

### 2.4 Movie API

| Item | Value |
|---|---|
| Base URL | `https://api.themoviedb.org/3` |
| Auth | Query parameter `api_key` |
| Image base | `https://image.tmdb.org/t/p/` |
| Poster size | `w500` |
| Backdrop size | `w780` |

| Call | Method | Path | Parsed from |
|---|---|---|---|
| Trending | GET | `/trending/movie/week` | `results` |
| Popular | GET | `/movie/popular` | `results` (`page` defaults to 1) |
| Search | GET | `/search/movie` | `results` (`query`) |
| Detail | GET | `/movie/{id}` | the response object |

Copy the existing v3 key from the Flutter project’s `lib/core/services/api_constants.dart` into `src/core/config/env.ts` at implementation time. Do not duplicate the key in this roadmap, in chat logs, or in a committed `.env` example that contains the real value. `env.ts` may export a placeholder constant for local development; keep the real key out of git if the repository becomes public.

**List movie fields**

| App field | JSON | If missing |
|---|---|---|
| id | `id` | invalid; Zod rejects the item |
| title | `title` | invalid; Zod rejects the item |
| posterPath | `poster_path` | `""` |
| rating | `vote_average` | `0` |
| releaseDate | `release_date` | `"Unknown"` |
| overview | `overview` | `""` |
| genreIds | `genre_ids` | `[]` |

**Detail fields**

| App field | JSON | If missing |
|---|---|---|
| id, title | same as list | reject |
| overview, posterPath | same as list | `""` |
| backdropPath | `backdrop_path`, else `poster_path` | `""` |
| rating | `vote_average` | `0` |
| releaseDate | `release_date` | `"Unknown"` |
| runtime | `runtime` | `0` |
| genres | `genres[].name` | `[]` |

Year display: the first four characters of `releaseDate` when the string is at least four characters; otherwise the whole string.

Browse genre ids, applied on the client to the popular list. No extra TMDB endpoint.

| Chip | TMDB id |
|---|---|
| All | no filter |
| Action | 28 |
| Comedy | 35 |
| Drama | 18 |
| Sci-Fi | 878 |
| Horror | 27 |

**Popular** keeps API order. **Top Rated** sorts that filtered list by `rating` descending.

### 2.5 Staff Pick

`GET https://cinescope-backend-ya4b.onrender.com/api/recommendation`

Response shape already deployed:

```json
{
  "recommendation": {
    "title": "Inception",
    "reason": "A mind-bending masterpiece by Christopher Nolan.",
    "movieId": 27205,
    "posterPath": "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    "rating": 8.4
  }
}
```

Show the card only when this request succeeds. Loading and failure render nothing in that slot. The rest of Home still renders. Do not add a hardcoded movie fallback. Do not create a new server. Render’s free tier can sleep; the first request may take about 30 seconds and then fail the query timeout. That failure must stay invisible.

---

## 3. The Only Product Substitution

Firebase, Google Sign-In, and Firestore are not part of this experiment.

| Flutter behavior | This app |
|---|---|
| Google account | Local session. Button label is **Sign in**. No network call. |
| Firestore watchlist | JSON list in AsyncStorage, same movie fields as section 2.4 |
| SharedPreferences login and theme | The same AsyncStorage, through Zustand persist |
| Watched list in SharedPreferences | Same list, same storage mechanism |

Sign out sets the session to signed-out and leaves theme, watchlist, and watched data in place. That matches the Flutter app, which clears the login flag and keeps the theme.

There is no user id. Watchlist methods do not take one.

---

## 4. Architecture Decision

### Standards this choice comes from

- React Native’s own setup guide recommends Expo as the production framework: [Environment setup](https://reactnative.dev/docs/environment-setup).
- From Expo SDK 55 and React Native 0.82, the New Architecture is the only architecture. SDK 57 (React Native 0.86) is the stable line to target on 13 October 2026. Android minimum is 7 (API 24). Compile and target SDK are API 36.
- Expo Router is Expo’s file-based router. Route files map to URLs the way Next.js `app/` routes do. That similarity is intentional: it is the main transfer test.
- Production apps split state. TanStack Query owns server cache (fetch, retry, stale data, errors). Zustand owns client state (session, theme, lists the user edited). Putting TMDB arrays into Zustand duplicates a job Query already does.
- Zod parses untrusted JSON once. TypeScript types are inferred from those schemas so the UI cannot invent fields.

### Chosen stack

| Concern | Choice | Why this one |
|---|---|---|
| Framework | Expo, stable SDK, TypeScript | Official recommendation. New Architecture included. |
| Navigation | Expo Router | Same mental model as Next.js App Router. Typed routes. |
| Server state | TanStack Query | Cache and retry for TMDB and Staff Pick. |
| Client state | Zustand + persist | Session, theme, watchlist, watched. No provider boilerplate. |
| Validation | Zod | One parse at the network boundary. |
| HTTP | `fetch` | Enough for four GET calls. The API key is appended in one function. |
| Images | `expo-image` | Disk cache and placeholders, the usual production choice. |
| Persistence | `@react-native-async-storage/async-storage` | Zustand’s persist adapter. Direct equivalent of SharedPreferences for this data size. |
| Styling | `StyleSheet` + `tokens.ts` | The palette is fixed. A second styling language is not required to match it. |

### Considered and rejected

| Option | Why it is not in this experiment |
|---|---|
| Flutter-shaped Cubits and `useReducer` | Hides React Native behind a port. The point is to learn the platform. |
| React Native CLI without Expo | More native-project maintenance, same UI. Expo is the supported starting point. |
| Expo Router replaced by a hand-built navigator | Legal, and still maintained, but it throws away the Next.js parallel this team can use. |
| Redux Toolkit | More ceremony than this client state needs. |
| Axios | Four GET requests do not need a second HTTP library. |
| NativeWind or a UI kit | The target UI is already specified in tokens and layout numbers. |
| Firebase, Google Sign-In | Excluded by the experiment brief. |
| A new Express server | The Staff Pick service is already deployed. |
| New screens or endpoints | The product surface is frozen. |

### Dependency direction

```
app route file  →  feature screen  →  query hook or Zustand store  →  API client or storage
```

- A file in `app/` exports a screen. It does not fetch, and it does not contain layout markup beyond a redirect.
- A screen does not call `fetch`, does not import Zod, and does not read AsyncStorage.
- Query hooks call the API client. The API client parses with Zod and returns typed data.
- Zustand stores read and write AsyncStorage only through the persist middleware.

---

## 5. Folder Structure

```
app/
├── _layout.tsx                         # Providers, theme, splash-aware stack
├── index.tsx                           # Splash route
├── login.tsx                           # Re-exports LoginScreen
├── search.tsx                          # Re-exports SearchScreen
├── movie/[id].tsx                      # Re-exports DetailScreen
└── (app)/
    ├── _layout.tsx                     # Five tabs
    ├── index.tsx                       # Home
    ├── browse.tsx
    ├── watchlist.tsx
    ├── watched.tsx
    └── settings.tsx

src/
├── core/
│   ├── config/env.ts                   # base URLs, image sizes, api key slot
│   ├── theme/tokens.ts                 # dark and light tokens
│   ├── theme/ThemeProvider.tsx         # reads the theme store, provides tokens
│   ├── api/tmdbClient.ts               # fetch + api_key
│   ├── api/queryClient.ts              # QueryClient defaults
│   └── ui/
│       ├── MovieCard.tsx
│       ├── LoadingIndicator.tsx
│       └── ErrorView.tsx
└── features/
    ├── session/
    │   ├── sessionStore.ts
    │   └── LoginScreen.tsx
    ├── settings/
    │   ├── themeStore.ts
    │   └── SettingsScreen.tsx
    ├── movies/
    │   ├── movieSchema.ts              # Zod: Movie, MovieDetail
    │   ├── movieApi.ts                 # four TMDB functions
    │   ├── movieQueries.ts             # query keys + hooks
    │   ├── HomeScreen.tsx
    │   ├── BrowseScreen.tsx
    │   ├── SearchScreen.tsx
    │   ├── DetailScreen.tsx
    │   └── SplashScreen.tsx
    ├── watchlist/
    │   ├── watchlistStore.ts
    │   └── WatchlistScreen.tsx
    ├── watched/
    │   ├── watchedStore.ts
    │   └── WatchedScreen.tsx
    └── recommendation/
        ├── recommendationSchema.ts
        ├── recommendationApi.ts
        ├── recommendationQueries.ts
        └── StaffPick.tsx
```

Route groups use parentheses, `(app)`, so the URL stays `/` for Home and the group name is not part of the path. That is an Expo Router rule, and it is the same idea as a Next.js route group.

`SplashScreen.tsx` lives under `movies` only because it is a one-file redirect with no domain of its own. If that feels wrong while building, put it in `src/features/session/` instead. Do not create a third place.

---

## 6. Route Map

```
index (Splash)
  ├─ replace → /login          when session is signed out
  └─ replace → /(app)          when session is signed in

(app) tabs
  ├─ Home     search icon → /search
  ├─ Browse
  ├─ Watchlist
  ├─ Watched
  └─ Settings   Sign out → replace to /login, stack cleared

/search                          back returns to the previous tab
/movie/[id]                      opened from posters and list rows
```

Search and Detail are stack screens beside the tabs, not extra tabs. Pushing them covers the tab bar, which is what the Flutter `Navigator.push` does today.

Use `router.replace` for Splash → Login, Splash → shell, Login → shell, and Sign out → Login. Use `router.push` for Search and Detail. Detail’s param is a numeric movie id. Parse it with Zod before calling the query. A bad id renders `ErrorView`, not a crash.

---

## 7. State Contracts

### 7.1 TanStack Query

Default client:

- `staleTime`: 60 seconds
- `retry`: 2
- `refetchOnWindowFocus`: false (mobile has no window focus in the web sense)

| Hook | Query key | Notes |
|---|---|---|
| `useTrendingMovies` | `['movies', 'trending']` | Home row |
| `usePopularMovies` | `['movies', 'popular']` | Home grid and Browse source |
| `useMovieSearch(query)` | `['movies', 'search', query]` | `enabled` only when `query` is non-empty |
| `useMovieDetail(id)` | `['movies', 'detail', id]` | `enabled` when `id` is a finite number |
| `useRecommendation` | `['recommendation']` | `retry: 1`. UI treats error as “render null” |

Search debounce is inside `SearchScreen` or a `useDebouncedValue` hook in that feature: 500ms, timer cleared on change and on unmount. The query itself does not debounce. Empty text does not hit the network and shows the initial sentence.

Browse does not have its own endpoint. It reads `usePopularMovies`, then filters and sorts in the screen (or a pure function `filterBrowseMovies` next to the screen). Changing the chip or the sort must not refetch.

Home loads trending, popular, and recommendation together. A failure of trending or popular shows `ErrorView` with Retry for that section’s queries. A failure of recommendation hides Staff Pick only.

### 7.2 Zustand stores

Each store is one file. Persist key names:

| Store | Persist key | State | Actions |
|---|---|---|---|
| `sessionStore` | `cinescope-session` | `status: 'unknown' \| 'signedIn' \| 'signedOut'` | `hydrate`, `signIn`, `signOut` |
| `themeStore` | `cinescope-theme` | `isDarkMode: boolean` (default `true`) | `setDarkMode` |
| `watchlistStore` | `cinescope-watchlist` | `movies: Movie[]` | `addMovie`, `removeMovie`, `isInWatchlist` |
| `watchedStore` | `cinescope-watched` | `movies: Movie[]` | `addMovie`, `removeMovie`, `isWatched` |

`addMovie` ignores a second insert of the same `id`. `signIn` only flips status to `signedIn`. `signOut` only flips status to `signedOut`. It must not call `removeItem` on the theme, watchlist, or watched keys.

Splash waits until both of these are true: 2 seconds have elapsed, and session persist has finished rehydrating. Navigating before rehydration sends a returning user to Login for one frame.

### 7.3 Shared UI

- `LoadingIndicator`: centered activity indicator, primary color.
- `ErrorView`: short message, **Retry** button, calls the function passed in.
- `MovieCard`: pressable poster, rating badge, title. `onPress` is the only behavior. The card does not navigate by itself.

Lists of posters use `FlatList` (horizontal trending) and `FlatList` with `numColumns={2}` (grids). Do not map a thousand movies into a bare `ScrollView`. For a two-column grid inside Home’s vertical scroll, use a `FlatList` with `scrollEnabled={false}` and a fixed aspect ratio, or compute the grid outside the parent scroll. The parent Home scroll is one vertical list: Staff Pick, trending header, trending list, popular header, popular grid.

---

## Phase 1: Foundation

**Goal:** A stable Expo app boots to a themed splash route. Folders exist. No movie features yet.

**Prerequisite:** None.

### 1.1 Toolchain check

- [ ] Node.js is 22.13 or newer (`node -v`). SDK 57 requires it.
- [ ] Run `npm view expo version`. The result is a stable version (no `-beta`, `-rc`, `-preview`, or `next` tag).
- [ ] If that version is SDK 58 or newer and the phone’s Expo Go matches it, use it and record the number in the project log. If Expo Go is still on SDK 57, create the app with the SDK 57 package line instead of a newer beta.
- [ ] Do not install from the `next` dist-tag.
- [ ] Confirm Expo Go on the test phone shows the same SDK major version. On a physical iPhone, Expo Go and the CLI must use the same Expo account (Expo’s rule since September 2026). Android emulators are the required lab; a mismatched Expo Go is a failed gate, not a warning.

### 1.2 Scaffold without wiping this folder

This directory already contains `docs/`, `.cursor/`, and `AGENTS.md`. `create-expo-app .` refuses a non-empty directory.

- [ ] Scaffold outside this folder:

```bash
npx create-expo-app@latest /tmp/cinescope-rn-scaffold --template default
```

The default template is Expo Router + TypeScript. That is the correct template. Do not pass the React Navigation template.

- [ ] Copy the scaffold into `/Users/aq/Work/01_Projects/02_Mobile/00_Learn/cinescope-react-native`.
- [ ] Do not overwrite `docs/`, `.cursor/`, or `AGENTS.md`.
- [ ] Delete the template’s sample routes after the copy, except `app/_layout.tsx`, which you will replace in 1.4.
- [ ] Record the resolved `expo` and `react-native` versions from `package.json` in `docs/project_log.md`.

### 1.3 Dependencies

Install with `npx expo install` so versions match the SDK:

- [ ] `@tanstack/react-query`
- [ ] `zustand`
- [ ] `zod`
- [ ] `expo-image`
- [ ] `@react-native-async-storage/async-storage`

Do not install Firebase, Axios, NativeWind, Redux, React Navigation as a direct app dependency, or a component library.

`tsconfig.json` stays strict. `strict` is true. Do not set `noImplicitAny` to false.

### 1.4 App shell

- [ ] Create the folders in section 5. Empty feature files can wait until their phase.
- [ ] `src/core/theme/tokens.ts` exports `darkTokens` and `lightTokens` with the hex values in section 2.3.
- [ ] `src/core/config/env.ts` exports `tmdbBaseUrl`, `imageBaseUrl`, `posterSize`, `backdropSize`, `recommendationBaseUrl`, and `tmdbApiKey`.
- [ ] `app/_layout.tsx` wraps the tree in `QueryClientProvider` and `ThemeProvider`.
- [ ] `app/index.tsx` renders the splash word **CineScope** in the primary color on the background color. Navigation is wired in Phase 4; for this gate, the route just renders.
- [ ] Create `docs/project_log.md` with a one-line header: a running log, newest entries first. Append the Phase 1 entry.

### 1.5 Boot

- [ ] `npx expo start` opens the app in Expo Go on at least one Android emulator.
- [ ] The splash word is visible, amber on charcoal.
- [ ] `npx tsc --noEmit` exits 0.

### Phase 1 validation gate

- [ ] Stable Expo SDK recorded, and it matches Expo Go
- [ ] `docs/`, `.cursor/`, and `AGENTS.md` still present after the copy
- [ ] Only the allowed dependencies were added
- [ ] Theme tokens exist once
- [ ] Typecheck is clean
- [ ] App boots on an Android emulator
- [ ] Project log has a Phase 1 entry with clock time spent and one sentence on what was confusing

---

## Phase 2: Contracts and Server State

**Goal:** Every network call is typed, parsed, and available as a query hook. No screen design yet beyond a temporary debug render if you need one. Remove debug renders before the gate.

**Prerequisite:** Phase 1 gate.

### 2.1 Schemas

- [ ] `movieSchema.ts` exports `movieSchema`, `movieDetailSchema`, and the inferred types `Movie` and `MovieDetail`.
- [ ] Defaults match section 2.4. Use Zod’s default / preprocess for null poster paths, ratings, dates, overviews, and genre id arrays.
- [ ] A list parser drops invalid items instead of failing the whole page, and a detail parser fails the query if the object is invalid. Log the parse issue in the thrown error message so Retry is explainable.
- [ ] `recommendationSchema.ts` parses `{ recommendation: { title, reason, movieId, posterPath, rating } }`. `posterPath` and `reason` may be empty strings. `title` is required.

### 2.2 TMDB client

- [ ] `tmdbClient.ts` exposes one function, `tmdbGet(path, query)`.
- [ ] It builds the URL from `tmdbBaseUrl`, always sets `api_key`, and `fetch`es.
- [ ] Non-2xx responses throw an `Error` whose message includes the status code.
- [ ] It returns unknown JSON. Callers parse with Zod. The client does not know about movies.

### 2.3 API functions

- [ ] `getTrendingMovies(): Promise<Movie[]>`
- [ ] `getPopularMovies(page = 1): Promise<Movie[]>`
- [ ] `searchMovies(query: string): Promise<Movie[]>`
- [ ] `getMovieDetail(id: number): Promise<MovieDetail>`
- [ ] `getRecommendation(): Promise<Recommendation>`

Image URL helper, used by UI later: `posterUrl(path)` and `backdropUrl(path)` return `""` when `path` is empty, so `expo-image` is not given a broken URL.

### 2.4 Query hooks

- [ ] Implement the hooks and keys in section 7.1.
- [ ] `useMovieSearch` accepts the already-debounced string.
- [ ] Recommendation query uses `retry: 1` and does not throw into an error boundary. The screen reads `isError` and returns null.

### Phase 2 validation gate

- [ ] A one-off call (temporary button or a unit-free manual fetch from a dev screen that you then delete) returns trending movies with posters paths
- [ ] Search with `q=inception` returns a non-empty list
- [ ] Detail for id `27205` returns runtime, genres, and a backdrop path
- [ ] An unknown id surfaces an error state, not an uncaught exception
- [ ] Recommendation either returns Inception’s payload or an error the UI can ignore
- [ ] `npx tsc --noEmit` exits 0
- [ ] No screen file calls `fetch`
- [ ] Project log updated, with comprehension time: how long to explain `movieQueries.ts` using only a Next.js background

---

## Phase 3: Device State

**Goal:** Session, theme, watchlist, and watched survive an app restart. No pixel-perfect screens yet.

**Prerequisite:** Phase 1 gate. Can proceed in parallel with Phase 2 after Phase 1, and must be finished before Phase 4.

### 3.1 Stores

- [ ] Implement the four stores in section 7.2 with `persist` and the AsyncStorage storage adapter.
- [ ] `partialize` so only the data fields are stored, not function identities.
- [ ] `onRehydrateStorage` (or the persist `hasHydrated` API) exposes a boolean the splash can await. Session status stays `unknown` until hydration finishes, then becomes `signedIn` or `signedOut`.
- [ ] Watchlist and watched `addMovie` / `removeMovie` are synchronous updates to the array. Persist writes through the middleware. Duplicate ids are ignored.
- [ ] `isInWatchlist` and `isWatched` are plain selectors.

### 3.2 Sign-out rule

- [ ] `signOut` changes session status only.
- [ ] After sign-out, theme is still whatever the user chose, and both movie lists are still present on the next sign-in.

### Phase 3 validation gate

- [ ] Sign in, kill the app, reopen: status is `signedIn` after hydration
- [ ] Toggle dark mode off, kill, reopen: still light
- [ ] Add a fake `Movie` in a temporary dev call, kill, reopen: it is still in the watchlist. Remove the dev call before Phase 4.
- [ ] Sign out does not empty the watchlist
- [ ] `npx tsc --noEmit` exits 0
- [ ] Project log updated

---

## Phase 4: UI Parity

**Goal:** A person who knows the Flutter app cannot tell the screens apart, except the login button says **Sign in**.

**Prerequisite:** Phase 2 and Phase 3 gates.

Work in this order. Each step is demoable.

### 4.1 Shared components

- [ ] `MovieCard` matches section 2.2 and 2.3: radius 8, rating badge, two-line title, surface placeholder, movie glyph on error.
- [ ] `LoadingIndicator` and `ErrorView`.
- [ ] `ThemeProvider` applies status bar style and a navigation theme built from tokens (background, surface, primary, text). Headers use the surface color, elevation 0.

### 4.2 Splash and login

- [ ] Splash shows **CineScope** and, after 2 seconds and hydration, `router.replace` to `/login` or `/(app)`.
- [ ] Login card matches the copy in section 2.1. Pressing **Sign in** sets the session and replaces to `/(app)`.
- [ ] The button shows the activity indicator while the status flips. This is local, so the spinner may be brief. Still handle it so the pattern is visible.
- [ ] There is no Google logo and no Google wording.

### 4.3 Tab shell

- [ ] Five tabs, labels and header titles from section 2.1.
- [ ] Icons: home, explore/compass, bookmark, check-circle, settings. Use `@expo/vector-icons` (already in the Expo template). Do not add an icon package.
- [ ] Search icon on the Home header only. It pushes `/search`.

### 4.4 Home

- [ ] On focus, the three queries run.
- [ ] Staff Pick is a horizontal card: 60×90 poster, label **Staff Pick** in primary, title, reason max two lines. Hidden unless the recommendation query is successful.
- [ ] Trending: horizontal `FlatList`, height 220, card width 130.
- [ ] Popular: two columns, aspect 0.65, gap 8.
- [ ] Section titles 18px, bold.
- [ ] If trending or popular fails, `ErrorView` with Retry. Staff Pick failure does not replace the page.

### 4.5 Browse

- [ ] Horizontal chips. Selected chip uses the primary color.
- [ ] Sort control with **Popular** and **Top Rated**.
- [ ] Data is the popular query, passed through `filterBrowseMovies`.
- [ ] Empty genre uses the sentence in section 2.1.
- [ ] Chip and sort changes do not refetch.

### 4.6 Search

- [ ] Header **Search**, autofocus, hint **Search for movies...**.
- [ ] Debounce 500ms. Clearing the field returns to **Search for your favorite movies** and cancels the pending timer.
- [ ] Non-empty query: loading, then a two-column grid, or **No movies found**, or `ErrorView`.
- [ ] Retry repeats the current text.

### 4.7 Detail

- [ ] Route `movie/[id]` parses the id.
- [ ] Backdrop height 300, pinned header, cover image, surface fallback.
- [ ] Header actions: check icon (watched), bookmark icon (watchlist). Filled when active, outline when not.
- [ ] Meta line, genre chips, **Synopsis**, overview.
- [ ] Toggles call the stores and show the snackbar strings from section 2.1. Use a small in-app banner or React Native’s compatible snackbar pattern that does not add a dependency. A 2-second absolute banner at the bottom is acceptable if it shows the same sentence.
- [ ] Loading and error states fill the screen. Error has a back header and Retry.

### 4.8 Watchlist and watched

- [ ] Rows match section 2.2. Card surface, poster 50×75, title one line, subtitle year.
- [ ] Watchlist menu: View Details, Remove from Watchlist, Mark as Watched.
- [ ] Watched menu: Remove from Watched.
- [ ] Row press opens detail.
- [ ] Empty sentences from section 2.1.
- [ ] No swipe-to-delete.

### 4.9 Settings

- [ ] **Dark mode** switch bound to `themeStore`. The whole app, including headers and tabs, switches immediately.
- [ ] **Sign out** calls `signOut` and `router.replace('/login')` with the history cleared so Android back does not return to the shell.
- [ ] Light theme uses the light tokens, not a washed-out dark theme.

### 4.10 Navigation pass

- [ ] Cold start, signed out → Splash → Login
- [ ] Cold start, signed in → Splash → Home
- [ ] Login → Home
- [ ] Home → Search → Detail → back → back
- [ ] Browse, Watchlist, and Watched → Detail → back lands on the same tab
- [ ] Settings → Sign out → Login, and the Android back button does not reopen the shell

### Phase 4 validation gate

- [ ] Every row in section 2.1 exists with the same copy
- [ ] Layout numbers in section 2.2 are in the styles, not approximate one-off values scattered around
- [ ] No hex colors outside `tokens.ts`
- [ ] `npx tsc --noEmit` exits 0
- [ ] Walk the Flutter app and this app side by side on one emulator and note any mismatch in the project log
- [ ] Project log updated, with comprehension time for `app/(app)/_layout.tsx` and `HomeScreen.tsx`

---

## Phase 5: Android Version Matrix

**Goal:** Prove the same binary behavior on the oldest Android this SDK supports, on versions still common in the field, and on the current target. A single emulator pass is not this phase.

**Prerequisite:** Phase 4 gate.

### 5.1 Lab setup

Expo SDK 57 supports Android 7 and newer and compiles against API 36. Install Android Studio, SDK Platform 36 (required to compile), and the four system images below. Create one phone-sized AVD per image. Pixel-class devices are enough. Do not add tablets; CineScope is a phone UI.

| Slot | Android | API | Why this one | Form |
|---|---|---|---|---|
| A | 7.0 | 24 | SDK minimum. Oldest system UI, software navigation keys. | Emulator |
| B | 10 | 29 | Still widely installed. Gesture nav optional. | Emulator |
| C | 13 | 33 | Gesture navigation, modern display cutouts. | Emulator |
| D | 16 | 36 | Current compile/target. | Emulator |
| E | record the real version | record the real API | A physical phone the team already has. If nobody has one, write that down and do not pretend. | Device |

Expo Go on each emulator must match the project SDK. Install it from the Expo CLI onto the emulator (`npx expo start`, then press `a`, or the documented `eas go` / Expo CLI path for that SDK). A Play Store Expo Go build from an older SDK is a mismatch and fails the slot.

If Phase 1 resolved to an SDK newer than 57, keep slots A and D as that SDK’s minimum and its compile target. Slots B and C stay at API 29 and API 33 unless the new minimum is higher than 29. Record the substitution in the project log.

### 5.2 Script

Run this script from a killed app on every slot. One row per slot in the results table. Use Pass or Fail. A Fail gets one sentence on what broke.

| ID | Step | Pass condition |
|---|---|---|
| D-01 | Cold start, signed out | Splash, then Login, button readable, card on the background |
| D-02 | Sign in | Lands on Home. Tab bar not covered by the system nav bar. |
| D-03 | Trending and popular | Posters visible, not stretched, rating badge readable |
| D-04 | Staff Pick | Card visible, or absent with the rest of Home intact if Render is asleep |
| D-05 | Search | Keyboard opens, does not cover the field permanently, debounce still feels like ~500ms |
| D-06 | Detail | Backdrop, chips, both icons, snackbar fully on screen |
| D-07 | Watchlist and watched | Add, mark watched, remove. Overflow menu opens on the first tap. |
| D-08 | Theme | Switch to light and back. Status bar icons stay visible on both. |
| D-09 | Kill and reopen | Session, theme, and both lists restored |
| D-10 | Airplane mode on Home | Error view and Retry. Turning the network back on, Retry loads posters. |
| D-11 | System back | Detail → previous tab. Search → Home. Signed-out Login does not reveal the shell. |
| D-12 | Safe area | API 33 and 36, and the physical phone: no header under the status bar, no tab under the gesture bar. API 24: three-button nav does not cover the tab labels. |

### 5.3 How to run a slot

- [ ] Cold boot the AVD so you are not reusing a warm system image from another API level.
- [ ] `adb shell getprop ro.build.version.release` and `adb shell getprop ro.build.version.sdk` — write both numbers next to the slot before testing.
- [ ] Start Expo against that device only. Do not claim a pass from a screenshot of a different emulator.
- [ ] After D-10, leave airplane mode off before the next slot.

### 5.4 Defect rule

A fail on slot A or D blocks Phase 6. Those are the supported floor and the compile target. A fail on B, C, or E is still recorded. Fix it if it is a layout or storage bug in app code. If it is an emulator image bug you can reproduce only there, document the evidence (prop dump, steps) and do not hide it.

### Phase 5 validation gate

- [ ] Five rows exist, or four plus an explicit “no physical device” note
- [ ] Each tested row has API level, Android version, and D-01 through D-12
- [ ] Slots A and D have no open fails
- [ ] Project log lists remaining fails

---

## Phase 6: Comprehension Experiment and Decision

**Goal:** Decide whether this team can carry React Native into the graduation project. The decision is written by the team. This roadmap does not pick the winner.

**Prerequisite:** Phase 5 gate.

### 6.1 Comprehension protocol

Do this after the code is finished, not during it. One reader who knows React and Next.js and who did not write the file sits down cold.

| Task | File | Time box | Pass |
|---|---|---|---|
| C-01 | `app/(app)/_layout.tsx` | 10 min | Explains where the five tabs come from and how Search is not a tab |
| C-02 | `src/features/movies/movieQueries.ts` | 10 min | Explains who fetches, what the query key is for, and what `enabled` does on search |
| C-03 | `src/features/watchlist/watchlistStore.ts` | 10 min | Explains what is persisted, and why sign-out does not clear it |
| C-04 | `src/features/movies/DetailScreen.tsx` | 10 min | Points to the query for the movie and the stores for the two icons, without confusing them |

Rules:

- The reader may open imports. They may not ask the author until the timer ends.
- Record minutes to a correct explanation, or “failed” at 10.
- A correct explanation can be said out loud in a few sentences. It does not require naming internal library types.

### 6.2 Scores

Score each 1 to 5. Write the number and one sentence of evidence.

| Score | 5 | 3 | 1 |
|---|---|---|---|
| UI parity | Side-by-side, no copy or layout misses | Small spacing misses, all features present | A screen missing or a different flow |
| Android matrix | A–D pass, physical device pass or honestly absent | A and D pass, one mid-version fail open | Floor or target fails |
| Comprehension | All four tasks pass, median under 5 min | Three pass, or median over 5 min | Two or more fail |
| Setup friction | Phase 1 in half a day | Phase 1 in a day | Phase 1 took more than two days or never booted |

### 6.3 Decision record

Append this block to the project log and fill it in. Do not delete the scores to make the conclusion look cleaner.

```
Decision date:
UI parity:
Android matrix:
Comprehension:
Setup friction:

Choose for the graduation project: React Native / PWA / undecided

Evidence (five lines maximum):

What we would still need to learn before a client deadline:

What this experiment did not test (iOS, store release, offline sync, auth provider):
```

Guidance, not a verdict:

- Parity ≥ 4 and comprehension ≥ 4: React Native is a credible choice for this team.
- Parity ≥ 4 and comprehension ≤ 2: the platform worked; the team is not ready to own it. Prefer the stack they can already explain, or budget a longer RN practice before the graduation build.
- Android floor or target failing: do not choose React Native until those slots pass. A PWA comparison is premature if the native app does not boot on its own minimum OS.

### 6.4 Hygiene before anyone treats this as a client drop

- [ ] `npx tsc --noEmit` exits 0
- [ ] No `any`, no `ts-ignore`, no leftover debug buttons
- [ ] `env.ts` does not contain a key you are about to push to a public remote. If the key is present for a private school repo, say so in the log.
- [ ] README is optional for the experiment. If you add one, keep it to: what the app is, the stack list, how to start Expo, and the Android matrix summary. Do not invent features.

### Phase 6 validation gate

- [ ] C-01 through C-04 have times or failures
- [ ] Four scores are filled in
- [ ] The decision block is filled in, including “undecided” if that is the honest answer
- [ ] Project log contains that block

---

## Appendix A: File List

| Path | Role |
|---|---|
| `app/_layout.tsx` | Query client, theme, root stack |
| `app/index.tsx` | Splash route |
| `app/login.tsx` | Login route |
| `app/search.tsx` | Search route |
| `app/movie/[id].tsx` | Detail route |
| `app/(app)/_layout.tsx` | Five tabs |
| `app/(app)/index.tsx` | Home route |
| `app/(app)/browse.tsx` | Browse route |
| `app/(app)/watchlist.tsx` | Watchlist route |
| `app/(app)/watched.tsx` | Watched route |
| `app/(app)/settings.tsx` | Settings route |
| `src/core/config/env.ts` | URLs and API key slot |
| `src/core/theme/tokens.ts` | Color tokens |
| `src/core/theme/ThemeProvider.tsx` | Active theme |
| `src/core/api/tmdbClient.ts` | `fetch` + `api_key` |
| `src/core/api/queryClient.ts` | Query defaults |
| `src/core/ui/MovieCard.tsx` | Poster card |
| `src/core/ui/LoadingIndicator.tsx` | Loading |
| `src/core/ui/ErrorView.tsx` | Error + Retry |
| `src/features/movies/movieSchema.ts` | Zod movies |
| `src/features/movies/movieApi.ts` | Four TMDB calls |
| `src/features/movies/movieQueries.ts` | Query hooks |
| `src/features/movies/SplashScreen.tsx` | Splash |
| `src/features/movies/HomeScreen.tsx` | Home |
| `src/features/movies/BrowseScreen.tsx` | Browse |
| `src/features/movies/SearchScreen.tsx` | Search |
| `src/features/movies/DetailScreen.tsx` | Detail |
| `src/features/session/sessionStore.ts` | Local session |
| `src/features/session/LoginScreen.tsx` | Login |
| `src/features/settings/themeStore.ts` | Theme |
| `src/features/settings/SettingsScreen.tsx` | Settings |
| `src/features/watchlist/watchlistStore.ts` | Watchlist |
| `src/features/watchlist/WatchlistScreen.tsx` | Watchlist UI |
| `src/features/watched/watchedStore.ts` | Watched |
| `src/features/watched/WatchedScreen.tsx` | Watched UI |
| `src/features/recommendation/recommendationSchema.ts` | Staff Pick schema |
| `src/features/recommendation/recommendationApi.ts` | Staff Pick fetch |
| `src/features/recommendation/recommendationQueries.ts` | Staff Pick query |
| `src/features/recommendation/StaffPick.tsx` | Staff Pick card |

Route files stay thin: import the screen and export it. Business logic does not live in `app/`.

---

## Appendix B: Package Allowlist

Install these with `npx expo install` after the template exists:

```
@tanstack/react-query
zustand
zod
expo-image
@react-native-async-storage/async-storage
```

The Expo template already provides `expo`, `expo-router`, `react`, `react-native`, and `@expo/vector-icons`. Do not pin them by hand ahead of `create-expo-app`. Record whatever versions the template resolves.

### Do not add

- `firebase`, `@react-native-google-signin`, any auth provider SDK
- `axios`, `redux`, `@reduxjs/toolkit`, `nativewind`, `styled-components`
- `@react-navigation/*` as a direct dependency (Expo Router brings the navigation runtime it needs)
- UI kits, animation libraries, state machines, or code generators
- Extra TMDB endpoints, a new backend, or screens that are not in section 2.1

A package may be added only when a validation gate is blocked without it. Write the reason in the project log before installing it.

---

## Appendix C: Project Log Format

Create `docs/project_log.md` in Phase 1. Newest entry on top.

```markdown
## YYYY-MM-DD — Short title

**Phase:** Phase N
**Status:** Done

### What changed
- Concrete outcomes

### Experiment note
- Time spent:
- Comprehension (if this phase asks for it):
- Confusing part:
```

---

> **End of roadmap.** Execute the phases in order. The product is CineScope. The code is production React Native. The last page of the work is a written decision, not an assumption that the experiment succeeded.
