import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import './global.css';
import { PlayerProvider } from './context/PlayerContext';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {/* 1. 提供全局玩家数据 */}
      <PlayerProvider>
        {/* 2. 提供导航容器 */}
        <NavigationContainer>
          {/* 3. 渲染路由 */}
          <AppNavigator />
        </NavigationContainer>
      </PlayerProvider>
    </SafeAreaProvider>
  );
}