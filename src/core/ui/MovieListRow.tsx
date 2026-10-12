import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';
import {
  LIST_ROW_GAP,
  LIST_ROW_POSTER_HEIGHT,
  LIST_ROW_POSTER_RADIUS,
  LIST_ROW_POSTER_WIDTH,
} from '@/features/movies/listRowLayout';
import { releaseYear } from '@/features/movies/movieFormat';
import type { Movie } from '@/features/movies/movieSchema';

type MovieListRowProps = {
  movie: Movie;
  imageUrl: string;
  onPress: () => void;
  onMenuPress: () => void;
};

export function MovieListRow({
  movie,
  imageUrl,
  onPress,
  onMenuPress,
}: MovieListRowProps) {
  const { tokens } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const showPlaceholder = !imageUrl || imageFailed;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: tokens.surface,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {showPlaceholder ? (
        <View
          style={[
            styles.poster,
            { backgroundColor: tokens.background },
          ]}
        >
          <MaterialIcons color={tokens.textMuted} name="movie" size={28} />
        </View>
      ) : (
        <Image
          contentFit="cover"
          onError={() => setImageFailed(true)}
          source={{ uri: imageUrl }}
          style={[
            styles.poster,
            {
              borderRadius: LIST_ROW_POSTER_RADIUS,
              backgroundColor: tokens.background,
            },
          ]}
        />
      )}
      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.title, { color: tokens.text }]}>
          {movie.title}
        </Text>
        <Text style={[styles.year, { color: tokens.textMuted }]}>
          {releaseYear(movie.releaseDate)}
        </Text>
      </View>
      <Pressable
        accessibilityLabel="More options"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onMenuPress}
        style={styles.menuButton}
      >
        <MaterialIcons color={tokens.text} name="more-vert" size={24} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: LIST_ROW_GAP,
  },
  poster: {
    width: LIST_ROW_POSTER_WIDTH,
    height: LIST_ROW_POSTER_HEIGHT,
    borderRadius: LIST_ROW_POSTER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  copy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  year: {
    fontSize: 14,
  },
  menuButton: {
    padding: 4,
  },
});
