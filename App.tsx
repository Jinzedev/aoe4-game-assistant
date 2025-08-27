import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StatsScreen } from './components/StatsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SearchScreen } from './components/SearchScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { HomeScreen } from './components/HomeScreen';
import { AccountBinding } from './components/AccountBinding';
import { BottomNavigation } from './components/BottomNavigation';
import { GameDetailScreen } from './components/GameDetailScreen';

import { SearchResult } from './types';
import StorageService from './services/storageService';
import { apiService } from './services/apiService';

import './global.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [boundPlayerData, setBoundPlayerData] = useState<SearchResult | undefined>(undefined);
  const [showBindingPage, setShowBindingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingPlayerData, setViewingPlayerData] = useState<SearchResult | undefined>(undefined);
  const [showGameDetail, setShowGameDetail] = useState(false);
  const [gameDetailData, setGameDetailData] = useState<{gameId: number, profileId: number} | null>(null);

  // 应用启动时加载保存的玩家ID并获取最新数据
  useEffect(() => {
    const loadBoundPlayer = async () => {
      try {
        console.log('🚀 应用启动 - 检查本地存储的玩家ID');
        const savedPlayerId = await StorageService.getBoundPlayerId();
        
        if (savedPlayerId) {
          console.log('🔄 根据ID获取最新玩家数据:', savedPlayerId);
          
          // 根据ID获取最新的玩家数据
          const latestPlayerData = await apiService.getPlayer(savedPlayerId);
          
          // 构建 SearchResult 对象
          const playerData: SearchResult = {
            profile_id: latestPlayerData.profile_id,
            name: latestPlayerData.name,
            country: latestPlayerData.country,
            avatars: latestPlayerData.avatars,
            leaderboards: latestPlayerData.leaderboards,
            last_game_at: latestPlayerData.last_game_at
          };
          
          setBoundPlayerData(playerData);
          console.log('✅ 自动恢复并更新玩家数据:', playerData.name);
        } else {
          console.log('📝 没有保存的玩家ID');
        }
      } catch (error) {
        console.error('❌ 加载保存的玩家数据失败:', error);
        // 如果获取失败，可能是网络问题或玩家不存在，清除无效ID
        await StorageService.removeBoundPlayer();
      } finally {
        setIsLoading(false);
      }
    };

    loadBoundPlayer();
  }, []);

  // ✨ 刷新用户基本信息
  const refreshPlayerData = async (): Promise<SearchResult | null> => {
    if (!boundPlayerData) {
      console.log('⚠️ 没有绑定的玩家数据，无法刷新');
      return null;
    }

    try {
      console.log('🔄 开始刷新用户基本信息:', boundPlayerData.name);
      
      // 通过profile_id获取最新的玩家信息
      const latestPlayerData = await apiService.getPlayer(boundPlayerData.profile_id);
      
      // 构建更新后的SearchResult对象
      const updatedPlayerData: SearchResult = {
        profile_id: latestPlayerData.profile_id,
        name: latestPlayerData.name,
        country: latestPlayerData.country,
        avatars: latestPlayerData.avatars,
        leaderboards: latestPlayerData.leaderboards,
        last_game_at: latestPlayerData.last_game_at
      };
      
      // 更新状态（不需要再次保存到本地，因为ID已经保存了）
      setBoundPlayerData(updatedPlayerData);
      
      console.log('✅ 用户信息刷新成功:', {
        name: updatedPlayerData.name,
        rating: updatedPlayerData.leaderboards?.rm_solo?.rating || 'N/A',
        games: updatedPlayerData.leaderboards?.rm_solo?.games_count || 'N/A',
        updateTime: new Date().toLocaleTimeString()
      });
      
      return updatedPlayerData;
    } catch (error) {
      console.error('❌ 刷新用户信息失败:', error);
      return null;
    }
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

  const handleShowGameDetail = (gameId: number, profileId: number) => {
    setGameDetailData({ gameId, profileId });
    setShowGameDetail(true);
  };

  const handleBackFromGameDetail = () => {
    setShowGameDetail(false);
    setGameDetailData(null);
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

  // 如果正在显示游戏详情页面
  if (showGameDetail && gameDetailData) {
    return (
      <View className="flex-1 bg-slate-900">
        <StatusBar style="light" />
        <GameDetailScreen 
          gameId={gameDetailData.gameId}
          profileId={gameDetailData.profileId}
          onBack={handleBackFromGameDetail}
        />
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
        {activeTab === 'history' && <HistoryScreen boundPlayerData={viewingPlayerData || boundPlayerData} onShowGameDetail={handleShowGameDetail} />}
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </View>
  );
}
