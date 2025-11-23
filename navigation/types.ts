// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { SearchResult } from '../types';

// 1. 底部 Tab 的路由参数
export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
  Search: undefined;
  History: { targetPlayer?: SearchResult }; // 允许带参数跳转到历史页
  Settings: undefined;
};

// 2. 根 Stack (包含 Tab 和 全屏页面) 的路由参数
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>; // 嵌套的 Tab
  AccountBinding: undefined; // 绑定页 (模态)
  GameDetail: { gameId: number; profileId: number }; // 详情页
};