import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SnackbarBanner } from '@/core/ui/SnackbarBanner';
import { ErrorView } from '@/core/ui/ErrorView';
import { LoadingIndicator } from '@/core/ui/LoadingIndicator';
import { useTheme } from '@/core/theme/ThemeProvider';
import {
  DETAIL_BACKDROP_HEIGHT,
  DETAIL_SECTION_TITLE_FONT_SIZE,
  SECTION_HORIZONTAL_PADDING,
} from '@/features/movies/detailLayout';
import { backdropUrl } from '@/features/movies/movieApi';
import {
  formatRating,
  movieFromDetail,
  releaseYear,
} from '@/features/movies/movieFormat';
import { parseMovieRouteId, useMovieDetail } from '@/features/movies/movieQueries';
import type { MovieDetail } from '@/features/movies/movieSchema';
import { useWatchedStore } from '@/features/watched/watchedStore';
import { useWatchlistStore } from '@/features/watchlist/watchlistStore';

type DetailHeaderActionsProps = {
  inWatchlist: boolean;
  isWatched: boolean;
  onToggleWatchlist: () => void;
  onToggleWatched: () => void;
};

function DetailHeaderActions({
  inWatchlist,
  isWatched,
  onToggleWatchlist,
  onToggleWatched,
}: DetailHeaderActionsProps) {
  const { tokens } = useTheme();

  return (
    <View style={styles.headerActions}>
      <Pressable
        accessibilityLabel={isWatched ? 'Remove from watched' : 'Mark as watched'}
        accessibilityRole="button"
        hitSlop={8}
        onPress={onToggleWatched}
        style={styles.headerIconButton}
      >
        <MaterialIcons
          color={tokens.text}
          name={isWatched ? 'check-circle' : 'check-circle-outline'}
          size={24}
        />
      </Pressable>
      <Pressable
        accessibilityLabel={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        accessibilityRole="button"
        hitSlop={8}
        onPress={onToggleWatchlist}
        style={styles.headerIconButton}
      >
        <MaterialIcons
          color={tokens.text}
          name={inWatchlist ? 'bookmark' : 'bookmark-border'}
          size={24}
        />
      </Pressable>
    </View>
  );
}

function DetailContent({ detail }: { detail: MovieDetail }) {
  const { tokens } = useTheme();
  const [backdropFailed, setBackdropFailed] = useState(false);

  const backdropUri = backdropUrl(detail.backdropPath);
  const showBackdrop = backdropUri && !backdropFailed;

  const metaLine = `${releaseYear(detail.releaseDate)} · ★ ${formatRating(detail.rating)} · ${detail.runtime} min`;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={{ backgroundColor: tokens.background }}
    >
      {showBackdrop ? (
        <Image
          contentFit="cover"
          onError={() => setBackdropFailed(true)}
          source={{ uri: backdropUri }}
          style={[
            styles.backdrop,
            { backgroundColor: tokens.surface },
          ]}
        />
      ) : (
        <View
          style={[
            styles.backdrop,
            { backgroundColor: tokens.surface },
          ]}
        />
      )}
      <View style={styles.body}>
        <Text style={[styles.title, { color: tokens.text }]}>{detail.title}</Text>
        <Text style={[styles.meta, { color: tokens.textMuted }]}>{metaLine}</Text>
        {detail.genres.length > 0 ? (
          <ScrollView
            horizontal
            contentContainerStyle={styles.genreRow}
            showsHorizontalScrollIndicator={false}
          >
            {detail.genres.map((genre) => (
              <View
                key={genre}
                style={[styles.genreChip, { backgroundColor: tokens.surface }]}
              >
                <Text style={[styles.genreLabel, { color: tokens.text }]}>{genre}</Text>
              </View>
            ))}
          </ScrollView>
        ) : null}
        <Text style={[styles.sectionTitle, { color: tokens.text }]}>Synopsis</Text>
        <Text style={[styles.overview, { color: tokens.textMuted }]}>{detail.overview}</Text>
      </View>
    </ScrollView>
  );
}

export function DetailScreen() {
  const navigation = useNavigation();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const parsedRoute = parseMovieRouteId(idParam);
  const movieId = parsedRoute.success ? parsedRoute.data : -1;

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const dismissSnackbar = useCallback(() => setSnackbarMessage(null), []);

  const detailQuery = useMovieDetail(movieId);

  const addWatchlist = useWatchlistStore((state) => state.addMovie);
  const removeWatchlist = useWatchlistStore((state) => state.removeMovie);
  const addWatched = useWatchedStore((state) => state.addMovie);
  const removeWatched = useWatchedStore((state) => state.removeMovie);
  const inWatchlist = useWatchlistStore((state) => state.isInWatchlist(movieId));
  const isWatched = useWatchedStore((state) => state.isWatched(movieId));

  const detail = detailQuery.data;

  const toggleWatchlist = useCallback(() => {
    if (!detail) {
      return;
    }
    const movie = movieFromDetail(detail);
    if (inWatchlist) {
      removeWatchlist(movie.id);
      setSnackbarMessage(`${detail.title} removed from watchlist`);
    } else {
      addWatchlist(movie);
      setSnackbarMessage(`${detail.title} added to watchlist`);
    }
  }, [addWatchlist, detail, inWatchlist, removeWatchlist]);

  const toggleWatched = useCallback(() => {
    if (!detail) {
      return;
    }
    const movie = movieFromDetail(detail);
    if (isWatched) {
      removeWatched(movie.id);
      setSnackbarMessage(`${detail.title} removed from watched`);
    } else {
      addWatched(movie);
      setSnackbarMessage(`${detail.title} marked as watched`);
    }
  }, [addWatched, detail, isWatched, removeWatched]);

  useLayoutEffect(() => {
    if (!detail) {
      navigation.setOptions({ headerRight: undefined });
      return;
    }

    navigation.setOptions({
      headerRight: () => (
        <DetailHeaderActions
          inWatchlist={inWatchlist}
          isWatched={isWatched}
          onToggleWatchlist={toggleWatchlist}
          onToggleWatched={toggleWatched}
        />
      ),
    });
  }, [detail, inWatchlist, isWatched, navigation, toggleWatchlist, toggleWatched]);

  if (!parsedRoute.success) {
    return (
      <ErrorView
        message="This movie link is invalid."
        onRetry={() => router.back()}
      />
    );
  }

  if (detailQuery.isPending) {
    return <LoadingIndicator />;
  }

  if (detailQuery.isError || !detail) {
    return (
      <ErrorView onRetry={() => void detailQuery.refetch()} />
    );
  }

  return (
    <View style={styles.screen}>
      <DetailContent detail={detail} />
      <SnackbarBanner message={snackbarMessage} onDismiss={dismissSnackbar} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  backdrop: {
    width: '100%',
    height: DETAIL_BACKDROP_HEIGHT,
  },
  body: {
    paddingHorizontal: SECTION_HORIZONTAL_PADDING,
    paddingTop: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  meta: {
    fontSize: 15,
    lineHeight: 22,
  },
  genreRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: DETAIL_SECTION_TITLE_FONT_SIZE,
    fontWeight: '700',
    marginTop: 4,
  },
  overview: {
    fontSize: 15,
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  headerIconButton: {
    paddingHorizontal: 6,
  },
});
