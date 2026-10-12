import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { type Href, router, Tabs } from 'expo-router';
import { Pressable, type ColorValue } from 'react-native';

import { useTheme, useThemedHeaderOptions } from '@/core/theme/ThemeProvider';

type TabIconName = keyof typeof MaterialIcons.glyphMap;

function tabBarIcon(name: TabIconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <MaterialIcons color={color} name={name} size={size} />
  );
}

function HomeSearchButton() {
  const { tokens } = useTheme();

  return (
    <Pressable
      accessibilityLabel="Search"
      accessibilityRole="button"
      hitSlop={8}
      onPress={() => router.push('/search' as Href)}
      style={{ marginRight: 12 }}
    >
      <MaterialIcons color={tokens.text} name="search" size={24} />
    </Pressable>
  );
}

export default function AppTabLayout() {
  const { tokens } = useTheme();
  const headerOptions = useThemedHeaderOptions();

  return (
    <Tabs
      screenOptions={{
        ...headerOptions,
        headerShown: true,
        tabBarActiveTintColor: tokens.primary,
        tabBarInactiveTintColor: tokens.textMuted,
        tabBarStyle: {
          backgroundColor: tokens.surface,
          borderTopColor: tokens.textMuted,
        },
        sceneStyle: {
          backgroundColor: tokens.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'CineScope',
          tabBarLabel: 'Home',
          tabBarIcon: tabBarIcon('home'),
          headerRight: () => <HomeSearchButton />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarLabel: 'Browse',
          tabBarIcon: tabBarIcon('explore'),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'My Watchlist',
          tabBarLabel: 'Watchlist',
          tabBarIcon: tabBarIcon('bookmark'),
        }}
      />
      <Tabs.Screen
        name="watched"
        options={{
          title: 'Watched',
          tabBarLabel: 'Watched',
          tabBarIcon: tabBarIcon('check-circle'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: tabBarIcon('settings'),
        }}
      />
    </Tabs>
  );
}
