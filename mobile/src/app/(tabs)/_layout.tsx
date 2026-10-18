import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { isLeaderboardMember, useStore } from '@/store/store';
import { Icon, type IconName } from '@/ui/Icon';
import { useColors } from '@/ui/theme';

const icon = (name: IconName) => {
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Icon name={name} color={color} strokeWidth={focused ? 2.2 : 1.8} />;
  }
  return TabIcon;
};

export default function TabLayout() {
  const c = useColors();
  const { state } = useStore();
  const member = isLeaderboardMember(state);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.ink,
        tabBarInactiveTintColor: c.ink2,
        tabBarStyle: { backgroundColor: c.ground, borderTopColor: c.rule },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
        sceneStyle: { backgroundColor: c.ground },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="mastery" options={{ title: 'Mastery', tabBarIcon: icon('medal') }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Leaderboard', tabBarIcon: icon('podium') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person') }} />
      <Tabs.Screen name="create" options={{ title: 'Create', tabBarIcon: icon('plussq'), href: member ? undefined : null }} />
    </Tabs>
  );
}
