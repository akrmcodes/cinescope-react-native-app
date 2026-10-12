import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { queryClient } from '@/core/api/queryClient';
import { ThemeProvider } from '@/core/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
