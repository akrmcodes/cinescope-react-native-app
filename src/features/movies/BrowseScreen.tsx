import { type Href, router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { ErrorView } from '@/core/ui/ErrorView';
import { LoadingIndicator } from '@/core/ui/LoadingIndicator';
import { MovieCard } from '@/core/ui/MovieCard';
import { useTheme } from '@/core/theme/ThemeProvider';
import {
  BROWSE_GENRE_CHIPS,
  browseEmptyMessage,
  filterBrowseMovies,
  genreLabelForId,
  type BrowseSortMode,
} from '@/features/movies/filterBrowseMovies';
import {
  LIST_GAP,
  popularCardWidth,
  SECTION_HORIZONTAL_PADDING,
} from '@/features/movies/homeLayout';
import { posterUrl } from '@/features/movies/movieApi';
import { usePopularMovies } from '@/features/movies/movieQueries';
import type { Movie } from '@/features/movies/movieSchema';

function openMovieDetail(id: number) {
  router.push(`/movie/${id}` as Href);
}

type GenreChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function GenreChip({ label, selected, onPress }: GenreChipProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? tokens.primary : tokens.surface,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.chipLabel,
          { color: selected ? tokens.background : tokens.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type SortOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function SortOption({ label, selected, onPress }: SortOptionProps) {
  const { tokens } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.sortOption,
        {
          backgroundColor: selected ? tokens.primary : tokens.surface,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.sortOptionLabel,
          { color: selected ? tokens.background : tokens.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function BrowseScreen() {
  const { tokens } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const gridCardWidth = popularCardWidth(screenWidth);

  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [sort, setSort] = useState<BrowseSortMode>('popular');

  const popular = usePopularMovies();

  const displayed = useMemo(
    () => filterBrowseMovies(popular.data ?? [], selectedGenreId, sort),
    [popular.data, selectedGenreId, sort],
  );

  const emptyMessage = browseEmptyMessage(genreLabelForId(selectedGenreId));

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieCard
        imageUrl={posterUrl(item.posterPath)}
        onPress={() => openMovieDetail(item.id)}
        rating={item.rating}
        style={styles.gridCard}
        title={item.title}
        width={gridCardWidth}
      />
    ),
    [gridCardWidth],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.chipRow}
          showsHorizontalScrollIndicator={false}
        >
          {BROWSE_GENRE_CHIPS.map((chip) => (
            <GenreChip
              key={chip.label}
              label={chip.label}
              onPress={() => setSelectedGenreId(chip.genreId)}
              selected={selectedGenreId === chip.genreId}
            />
          ))}
        </ScrollView>
        <View style={styles.sortRow}>
          <Text style={[styles.sortLabel, { color: tokens.text }]}>Sort by</Text>
          <View style={styles.sortOptions}>
            <SortOption
              label="Popular"
              onPress={() => setSort('popular')}
              selected={sort === 'popular'}
            />
            <SortOption
              label="Top Rated"
              onPress={() => setSort('topRated')}
              selected={sort === 'topRated'}
            />
          </View>
        </View>
      </View>
    ),
    [selectedGenreId, sort, tokens.text],
  );

  if (popular.isLoading) {
    return <LoadingIndicator />;
  }

  if (popular.isError) {
    return <ErrorView onRetry={() => void popular.refetch()} />;
  }

  return (
    <FlatList
      columnWrapperStyle={styles.popularRow}
      contentContainerStyle={[
        styles.listContent,
        { backgroundColor: tokens.background },
      ]}
      data={displayed}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: tokens.textMuted }]}>
          {emptyMessage}
        </Text>
      }
      ListHeaderComponent={listHeader}
      numColumns={2}
      renderItem={renderItem}
      style={{ backgroundColor: tokens.background }}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: SECTION_HORIZONTAL_PADDING,
    paddingBottom: 24,
    flexGrow: 1,
  },
  header: {
    paddingTop: 8,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  popularRow: {
    gap: LIST_GAP,
    marginBottom: LIST_GAP,
  },
  gridCard: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 22,
  },
});
