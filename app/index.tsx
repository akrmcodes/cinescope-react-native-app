import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';

export default function SplashRoute() {
  const { tokens } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: tokens.background }]}>
      <Text style={[styles.title, { color: tokens.primary }]}>CineScope</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
  },
});
