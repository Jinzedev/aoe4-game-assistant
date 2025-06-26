import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatsScreen } from './screens/StatsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AccountBinding } from './components/AccountBinding';
import { BottomNavigation } from './components/BottomNavigation';
import { SearchResult } from './types';
import StorageService from './services/storageService';
import UpdateService from './services/updateService';

import './global.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [boundPlayerData, setBoundPlayerData] = useState<SearchResult | undefined>(undefined);
  const [showBindingPage, setShowBindingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingPlayerData, setViewingPlayerData] = useState<SearchResult | undefined>(undefined);

  // 应用启动时加载保存的玩家数据
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🚀 应用启动 - 检查本地存储的玩家数据');
        const savedPlayer = await StorageService.getBoundPlayer();
        if (savedPlayer) {
          setBoundPlayerData(savedPlayer);
          console.log('✅ 自动恢复玩家数据:', savedPlayer.name);
        }
        
        // 检查是否启用自动更新，如果是则执行自动检查
        await checkAutoUpdate();
      } catch (error) {
        console.error('❌ 加载数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const checkAutoUpdate = async () => {
    try {
      // 检查自动更新设置
      const autoUpdateEnabled = await AsyncStorage.getItem('autoUpdateEnabled');
      if (autoUpdateEnabled !== 'true') {
        console.log('📱 自动更新检查已禁用');
        return;
      }

      // 执行自动更新检查（每次启动都检查）
      console.log('🔍 执行自动更新检查...');
      
      const updateInfo = await UpdateService.checkForUpdate();
      if (updateInfo && updateInfo.hasUpdate) {
        console.log('🎉 检测到新版本:', updateInfo.latestVersion);
        
        // 显示更新提示
        showUpdateNotification(updateInfo);
      } else {
        console.log('✅ 当前已是最新版本');
      }
    } catch (error) {
      console.log('❌ 自动检查更新失败:', error);
    }
  };

  const showUpdateNotification = (updateInfo: any) => {
    setTimeout(() => {
      Alert.alert(
        '🎉 发现新版本',
        `有新版本 ${updateInfo.latestVersion} 可用！\n\n点击立即下载或稍后在设置页面查看。`,
        [
          { text: '稍后下载', style: 'cancel' },
          {
            text: '立即查看',
            onPress: () => setActiveTab('settings')
          }
        ]
      );
    }, 2000); // 延迟2秒显示，让应用完全启动
  };

  const handleAccountBind = async (playerData: SearchResult) => {
    try {
      // 保存到本地存储
      await StorageService.saveBoundPlayer(playerData);
      setBoundPlayerData(playerData);
      setShowBindingPage(false);
      console.log('✅ 玩家绑定成功并已保存:', playerData.name);
    } catch (error) {
      console.error('❌ 保存玩家数据失败:', error);
      Alert.alert('保存失败', '绑定成功但保存到本地存储失败，下次启动应用需要重新绑定。');
      setBoundPlayerData(playerData);
      setShowBindingPage(false);
    }
  };

  const handleShowBinding = () => {
    setShowBindingPage(true);
  };

  const handleBackFromBinding = () => {
    setShowBindingPage(false);
  };

  const handleAccountUnbind = () => {
    Alert.alert(
      '退出登录',
      '确定要退出当前账户吗？退出后需要重新绑定才能查看数据。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '退出', 
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.removeBoundPlayer();
              setBoundPlayerData(undefined);
              console.log('✅ 玩家数据已清除');
            } catch (error) {
              console.error('❌ 清除玩家数据失败:', error);
              setBoundPlayerData(undefined); // 即使清除失败也要重置状态
            }
          }
        }
      ]
    );
  };

  const handleViewPlayerHistory = (player: SearchResult) => {
    setViewingPlayerData(player);
    setActiveTab('history');
  };

  const handleTabPress = (tab: string) => {
    // 当切换到非历史页面时，清除正在查看的玩家数据
    if (tab !== 'history') {
      setViewingPlayerData(undefined);
    }
    setActiveTab(tab);
  };

  // 应用启动加载状态
  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <StatusBar style="light" />
        {/* 这里可以放一个启动画面或加载指示器 */}
      </View>
    );
  }

  // 如果正在显示绑定页面
  if (showBindingPage) {
    return (
      <View className="flex-1 bg-slate-900">
        <StatusBar style="light" />
        <AccountBinding onBind={handleAccountBind} onBack={handleBackFromBinding} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />
      <View className="flex-1">
        {activeTab === 'home' && (
          <HomeScreen 
            boundPlayerData={boundPlayerData} 
            onShowBinding={handleShowBinding} 
            onUnbind={handleAccountUnbind} 
            onViewAllGames={() => setActiveTab('history')}
          />
        )}
        {activeTab === 'stats' && <StatsScreen />}
        {activeTab === 'search' && <SearchScreen onViewPlayerHistory={handleViewPlayerHistory} />}
        {activeTab === 'settings' && <SettingsScreen />}
        {activeTab === 'history' && <HistoryScreen boundPlayerData={viewingPlayerData || boundPlayerData} />}
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </View>
  );
}
