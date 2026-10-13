import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { queryClient } from '@/core/api/queryClient';
import { ThemeProvider, useThemedHeaderOptions } from '@/core/theme/ThemeProvider';

/** Splash stays the cold-start screen. Search must not be the first stack screen. */
export const unstable_settings = {
  initialRouteName: 'index',
};

function RootStack() {
  const headerOptions = useThemedHeaderOptions();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(app)" />
      <Stack.Screen
        name="search"
        options={{ ...headerOptions, headerShown: true, title: 'Search' }}
      />
      <Stack.Screen
        name="movie/[id]"
        options={{ ...headerOptions, headerShown: true, title: '' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
