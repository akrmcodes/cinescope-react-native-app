import { Image } from 'expo-image';
import { type Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';
import { posterUrl } from '@/features/movies/movieApi';
import {
  STAFF_PICK_POSTER_HEIGHT,
  STAFF_PICK_POSTER_RADIUS,
  STAFF_PICK_POSTER_WIDTH,
} from '@/features/movies/homeLayout';
import type { Recommendation } from '@/features/recommendation/recommendationSchema';

type StaffPickProps = {
  recommendation: Recommendation;
};

export function StaffPick({ recommendation }: StaffPickProps) {
  const { tokens } = useTheme();
  const imageUrl = posterUrl(recommendation.posterPath);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/movie/${recommendation.movieId}` as Href)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: tokens.surface,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <Image
        contentFit="cover"
        source={imageUrl ? { uri: imageUrl } : null}
        style={[
          styles.poster,
          {
            borderRadius: STAFF_PICK_POSTER_RADIUS,
            backgroundColor: tokens.surface,
          },
        ]}
      />
      <View style={styles.copy}>
        <Text style={[styles.label, { color: tokens.primary }]}>Staff Pick</Text>
        <Text numberOfLines={2} style={[styles.title, { color: tokens.text }]}>
          {recommendation.title}
        </Text>
        <Text numberOfLines={2} style={[styles.reason, { color: tokens.textMuted }]}>
          {recommendation.reason}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  poster: {
    width: STAFF_PICK_POSTER_WIDTH,
    height: STAFF_PICK_POSTER_HEIGHT,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  reason: {
    fontSize: 14,
    lineHeight: 18,
  },
});
