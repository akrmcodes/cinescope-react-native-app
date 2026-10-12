import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';

const POSTER_RADIUS = 8;
const GRID_ASPECT_RATIO = 0.65;
const RATING_BADGE_BACKGROUND = 'rgba(0,0,0,0.54)';

type MovieCardProps = {
  title: string;
  rating: number;
  /** Full poster URL from `posterUrl()`; empty shows the surface placeholder. */
  imageUrl: string;
  onPress: () => void;
  width: number;
  /** Width / height; defaults to grid ratio `0.65`. */
  aspectRatio?: number;
  style?: StyleProp<ViewStyle>;
};

export function MovieCard({
  title,
  rating,
  imageUrl,
  onPress,
  width,
  aspectRatio = GRID_ASPECT_RATIO,
  style,
}: MovieCardProps) {
  const { tokens } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);

  const height = width / aspectRatio;
  const showPlaceholder = !imageUrl || imageFailed;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        { width, opacity: pressed ? 0.92 : 1 },
        style,
      ]}
    >
      <View style={[styles.posterFrame, { width, height, borderRadius: POSTER_RADIUS }]}>
        {showPlaceholder ? (
          <View
            style={[
              styles.placeholder,
              { backgroundColor: tokens.surface, borderRadius: POSTER_RADIUS },
            ]}
          >
            <MaterialIcons color={tokens.textMuted} name="movie" size={32} />
          </View>
        ) : (
          <Image
            contentFit="cover"
            onError={() => setImageFailed(true)}
            source={{ uri: imageUrl }}
            style={[styles.image, { borderRadius: POSTER_RADIUS }]}
          />
        )}

        <View style={styles.ratingBadge}>
          <Text style={[styles.ratingText, { color: tokens.primary }]}>
            {rating.toFixed(1)}
          </Text>
        </View>

        <View style={styles.titleGradient} pointerEvents="none">
          <Text
            numberOfLines={2}
            style={[styles.title, { color: tokens.text }]}
          >
            {title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
  },
  posterFrame: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  placeholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: RATING_BADGE_BACKGROUND,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  titleGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 6,
    paddingVertical: 8,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  title: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
  },
});
