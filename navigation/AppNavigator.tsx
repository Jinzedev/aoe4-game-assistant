// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { GameDetailScreen } from '../screens/GameDetailScreen';

// Components & Types
import { BottomNavigation } from '../components/BottomNavigation';
import { RootStackParamList, MainTabParamList } from './types';
import { AccountBinding } from 'components/home/AccountBinding';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// 1. 底部 Tab 导航器
function MainTabs() {
  return (
    <Tab.Navigator
      // 关键：使用你自定义的 BottomNavigation 组件
      tabBar={(props) => (
        <BottomNavigation 
          activeTab={props.state.routeNames[props.state.index].toLowerCase()} 
          onTabPress={(tabKey) => {
             // 映射 tabKey (例如 'home') 到路由名称 (例如 'Home')
             const routeName = tabKey.charAt(0).toUpperCase() + tabKey.slice(1);
             props.navigation.navigate(routeName as any);
          }} 
        />
      )}
      screenOptions={{ headerShown: false, lazy: true }} // lazy: true 只有点击时才渲染
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// 2. 根 Stack 导航器
export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 主界面 (Tabs) */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
      
      {/* 模态页面 / 详情页 */}
      <Stack.Screen 
        name="GameDetail" 
        component={GameDetailScreen} 
        options={{ presentation: 'card', animation: 'slide_from_right' }} 
      />
      <Stack.Screen 
        name="AccountBinding" 
        component={AccountBinding} 
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }} 
      />
    </Stack.Navigator>
  );
}