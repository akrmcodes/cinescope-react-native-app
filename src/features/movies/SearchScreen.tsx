import { type Href, router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorView } from '@/core/ui/ErrorView';
import { LoadingIndicator } from '@/core/ui/LoadingIndicator';
import { MovieCard } from '@/core/ui/MovieCard';
import { useTheme } from '@/core/theme/ThemeProvider';
import {
  LIST_GAP,
  popularCardWidth,
  SECTION_HORIZONTAL_PADDING,
} from '@/features/movies/homeLayout';
import { posterUrl } from '@/features/movies/movieApi';
import { useMovieSearch } from '@/features/movies/movieQueries';
import type { Movie } from '@/features/movies/movieSchema';
import { useDebouncedSearchText } from '@/features/movies/useDebouncedSearchText';

const SEARCH_HINT = 'Search for movies...';
const IDLE_COPY = 'Search for your favorite movies';
const EMPTY_RESULTS_COPY = 'No movies found';

function openMovieDetail(id: number) {
  router.push(`/movie/${id}` as Href);
}

export function SearchScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const gridCardWidth = popularCardWidth(screenWidth);

  const [text, setText] = useState('');
  const debounced = useDebouncedSearchText(text);
  const search = useMovieSearch(debounced);

  const trimmedText = text.trim();
  const isDebouncing = trimmedText.length > 0 && debounced !== trimmedText;

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

  const results = search.data ?? [];

  function renderContent() {
    if (debounced.length === 0) {
      return (
        <Text style={[styles.message, { color: tokens.textMuted }]}>{IDLE_COPY}</Text>
      );
    }

    if (isDebouncing || search.isPending) {
      return <LoadingIndicator fill={false} />;
    }

    if (search.isError) {
      return <ErrorView fill={false} onRetry={() => void search.refetch()} />;
    }

    if (results.length === 0) {
      return (
        <Text style={[styles.message, { color: tokens.textMuted }]}>
          {EMPTY_RESULTS_COPY}
        </Text>
      );
    }

    return (
      <FlatList
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        data={results}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  const keyboardVerticalOffset =
    Platform.OS === 'ios' ? insets.top + 44 : 0;

  return (
    <View style={[styles.screen, { backgroundColor: tokens.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.flex}
      >
        <TextInput
          autoCorrect={false}
          autoFocus
          onChangeText={setText}
          placeholder={SEARCH_HINT}
          placeholderTextColor={tokens.textMuted}
          returnKeyType="search"
          style={[
            styles.input,
            {
              backgroundColor: tokens.surface,
              color: tokens.text,
            },
          ]}
          value={text}
        />
        <View style={styles.content}>{renderContent()}</View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  input: {
    marginHorizontal: SECTION_HORIZONTAL_PADDING,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: SECTION_HORIZONTAL_PADDING,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  gridRow: {
    gap: LIST_GAP,
    marginBottom: LIST_GAP,
  },
  gridCard: {
    flexGrow: 1,
  },
});
