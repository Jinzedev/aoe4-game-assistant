import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';

// 保持在组件外调用
SplashScreen.preventAutoHideAsync();

export function useAppResources() {
  const [fontsLoaded] = useFonts({
    ...FontAwesome5.font,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return {
    isReady: fontsLoaded,
    onLayoutRootView,
  };
}