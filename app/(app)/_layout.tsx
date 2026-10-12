import { Stack } from 'expo-router';

import { useThemedHeaderOptions } from '@/core/theme/ThemeProvider';

export default function AppShellLayout() {
  const screenOptions = useThemedHeaderOptions();

  return <Stack screenOptions={{ ...screenOptions, headerShown: false }} />;
}
