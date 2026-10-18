import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { StoreProvider, useStore } from '@/store/store';
import { DISPLAY_FONT, useColors } from '@/ui/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Root() {
  const { state } = useStore();
  const c = useColors();
  const scheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({ [DISPLAY_FONT]: require('../../assets/fonts/ArchivoCondensed-ExtraBold.ttf') });
  const ready = state.ready && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.ground } }}>
        <Stack.Protected guard={state.onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="recipe/[id]" />
          <Stack.Screen name="cook/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="post/[id]" />
          <Stack.Screen name="user/[id]" />
          <Stack.Screen name="messages/index" />
          <Stack.Screen name="messages/[id]" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="pins" options={{ presentation: 'modal' }} />
          <Stack.Screen name="search" />
        </Stack.Protected>
        <Stack.Protected guard={!state.onboarded}>
          <Stack.Screen name="welcome" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function Layout() {
  return (
    <StoreProvider>
      <Root />
    </StoreProvider>
  );
}
