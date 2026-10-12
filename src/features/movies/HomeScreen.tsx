import { useFocusEffect } from 'expo-router';
import { type Href, router } from 'expo-router';
import { useCallback } from 'react';
import {
  FlatList,
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
  LIST_GAP,
  popularCardWidth,
  SECTION_HORIZONTAL_PADDING,
  SECTION_TITLE_FONT_SIZE,
  TRENDING_CARD_WIDTH,
  TRENDING_LIST_HEIGHT,
} from '@/features/movies/homeLayout';
import { posterUrl } from '@/features/movies/movieApi';
import { usePopularMovies, useTrendingMovies } from '@/features/movies/movieQueries';
import type { Movie } from '@/features/movies/movieSchema';
import { StaffPick } from '@/features/recommendation/StaffPick';
import { useRecommendation } from '@/features/recommendation/recommendationQueries';

function SectionTitle({ children }: { children: string }) {
  const { tokens } = useTheme();

  return (
    <Text style={[styles.sectionTitle, { color: tokens.text }]}>{children}</Text>
  );
}

function openMovieDetail(id: number) {
  router.push(`/movie/${id}` as Href);
}

export function HomeScreen() {
  const { tokens } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const gridCardWidth = popularCardWidth(screenWidth);

  const trending = useTrendingMovies();
  const popular = usePopularMovies();
  const recommendation = useRecommendation();

  useFocusEffect(
    useCallback(() => {
      void trending.refetch();
      void popular.refetch();
      void recommendation.refetch();
    }, [trending.refetch, popular.refetch, recommendation.refetch]),
  );

  const renderTrendingItem = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieCard
        imageUrl={posterUrl(item.posterPath)}
        onPress={() => openMovieDetail(item.id)}
        rating={item.rating}
        title={item.title}
        width={TRENDING_CARD_WIDTH}
      />
    ),
    [],
  );

  const renderPopularItem = useCallback(
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

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { backgroundColor: tokens.background },
      ]}
      style={{ backgroundColor: tokens.background }}
    >
      {recommendation.isSuccess && recommendation.data ? (
        <StaffPick recommendation={recommendation.data} />
      ) : null}

      <SectionTitle>Trending This Week</SectionTitle>
      {trending.isLoading ? (
        <LoadingIndicator fill={false} />
      ) : trending.isError ? (
        <ErrorView fill={false} onRetry={() => void trending.refetch()} />
      ) : (
        <FlatList
          horizontal
          data={trending.data ?? []}
          ItemSeparatorComponent={() => <View style={{ width: LIST_GAP }} />}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTrendingItem}
          showsHorizontalScrollIndicator={false}
          style={styles.trendingList}
        />
      )}

      <SectionTitle>Popular Movies</SectionTitle>
      {popular.isLoading ? (
        <LoadingIndicator fill={false} />
      ) : popular.isError ? (
        <ErrorView fill={false} onRetry={() => void popular.refetch()} />
      ) : (
        <FlatList
          columnWrapperStyle={styles.popularRow}
          data={popular.data ?? []}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          renderItem={renderPopularItem}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: SECTION_HORIZONTAL_PADDING,
    paddingBottom: 24,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: SECTION_TITLE_FONT_SIZE,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  trendingList: {
    height: TRENDING_LIST_HEIGHT,
    marginBottom: 8,
  },
  popularRow: {
    gap: LIST_GAP,
    marginBottom: LIST_GAP,
  },
  gridCard: {
    flexGrow: 1,
  },
});
