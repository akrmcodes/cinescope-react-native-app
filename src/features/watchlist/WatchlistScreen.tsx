import { type Href, router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { MovieListRow } from '@/core/ui/MovieListRow';
import { RowOverflowMenu } from '@/core/ui/RowOverflowMenu';
import { SnackbarBanner } from '@/core/ui/SnackbarBanner';
import { useTheme } from '@/core/theme/ThemeProvider';
import {
  LIST_ROW_SEPARATOR,
  SECTION_HORIZONTAL_PADDING,
} from '@/features/movies/listRowLayout';
import { posterUrl } from '@/features/movies/movieApi';
import type { Movie } from '@/features/movies/movieSchema';
import { useWatchedStore } from '@/features/watched/watchedStore';
import { useWatchlistStore } from '@/features/watchlist/watchlistStore';

const EMPTY_COPY = 'Your watchlist is empty';

function openMovieDetail(id: number) {
  router.push(`/movie/${id}` as Href);
}

export function WatchlistScreen() {
  const { tokens } = useTheme();
  const movies = useWatchlistStore((state) => state.movies);
  const removeFromWatchlist = useWatchlistStore((state) => state.removeMovie);
  const addToWatched = useWatchedStore((state) => state.addMovie);

  const [menuMovie, setMenuMovie] = useState<Movie | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const dismissSnackbar = useCallback(() => setSnackbarMessage(null), []);

  const menuItems = useMemo(() => {
    if (!menuMovie) {
      return [];
    }
    const movie = menuMovie;
    return [
      {
        label: 'View Details',
        onPress: () => openMovieDetail(movie.id),
      },
      {
        label: 'Remove from Watchlist',
        onPress: () => {
          removeFromWatchlist(movie.id);
          setSnackbarMessage(`${movie.title} removed from watchlist`);
        },
      },
      {
        label: 'Mark as Watched',
        onPress: () => {
          addToWatched(movie);
          setSnackbarMessage(`${movie.title} marked as watched`);
        },
      },
    ];
  }, [addToWatched, menuMovie, removeFromWatchlist]);

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieListRow
        imageUrl={posterUrl(item.posterPath)}
        movie={item}
        onMenuPress={() => setMenuMovie(item)}
        onPress={() => openMovieDetail(item.id)}
      />
    ),
    [],
  );

  return (
    <View style={[styles.screen, { backgroundColor: tokens.background }]}>
      <FlatList
        contentContainerStyle={[
          styles.listContent,
          movies.length === 0 && styles.listContentEmpty,
        ]}
        data={movies}
        ItemSeparatorComponent={() => <View style={{ height: LIST_ROW_SEPARATOR }} />}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: tokens.textMuted }]}>{EMPTY_COPY}</Text>
        }
        renderItem={renderItem}
      />
      <RowOverflowMenu
        items={menuItems}
        onClose={() => setMenuMovie(null)}
        visible={menuMovie !== null}
      />
      <SnackbarBanner message={snackbarMessage} onDismiss={dismissSnackbar} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SECTION_HORIZONTAL_PADDING,
    paddingTop: 8,
    paddingBottom: 24,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
