import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { queryClient } from '@/core/api/queryClient';
import { ThemeProvider, useThemedHeaderOptions } from '@/core/theme/ThemeProvider';

function RootStack() {
  const headerOptions = useThemedHeaderOptions();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search" options={{ ...headerOptions, headerShown: true, title: 'Search' }} />
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
