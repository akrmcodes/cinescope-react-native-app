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

const EMPTY_COPY = 'No watched movies yet';

function openMovieDetail(id: number) {
  router.push(`/movie/${id}` as Href);
}

export function WatchedScreen() {
  const { tokens } = useTheme();
  const movies = useWatchedStore((state) => state.movies);
  const removeFromWatched = useWatchedStore((state) => state.removeMovie);

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
        label: 'Remove from Watched',
        onPress: () => {
          removeFromWatched(movie.id);
          setSnackbarMessage(`${movie.title} removed from watched`);
        },
      },
    ];
  }, [menuMovie, removeFromWatched]);

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
