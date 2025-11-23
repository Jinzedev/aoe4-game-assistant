import { useState, useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import StorageService from '../services/storageService';
import { apiService } from '../services/apiService';
import { SearchResult } from '../types';
import { transformPlayerData } from '../utils/dataAdapter';

export function useAppNavigation() {
  // --- 状态定义 ---
  const [activeTab, setActiveTab] = useState('home');
  const [boundPlayerData, setBoundPlayerData] = useState<SearchResult | undefined>(undefined);
  const [showBindingPage, setShowBindingPage] = useState(false);
  const [viewingPlayerData, setViewingPlayerData] = useState<SearchResult | undefined>(undefined);
  const [showGameDetail, setShowGameDetail] = useState(false);
  const [gameDetailData, setGameDetailData] = useState<{ gameId: number, profileId: number } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- 初始化加载用户 ---
  useEffect(() => {
    const loadBoundPlayer = async () => {
      try {
        const savedPlayerId = await StorageService.getBoundPlayerId();
        if (savedPlayerId) {
          const latestPlayerData = await apiService.getPlayer(savedPlayerId);
          const playerData = transformPlayerData(latestPlayerData);
          setBoundPlayerData(playerData);
        }
      } catch (error) {
        console.error('加载玩家失败', error);
        await StorageService.removeBoundPlayer();
      } finally {
        setIsLoadingData(false);
      }
    };
    loadBoundPlayer();
  }, []);

  // --- 物理返回键逻辑 ---
  useEffect(() => {
    const backAction = () => {
      if (showGameDetail) {
        setShowGameDetail(false);
        setGameDetailData(null);
        return true;
      }
      if (showBindingPage) {
        setShowBindingPage(false);
        return true;
      }
      if (activeTab !== 'home') {
        setActiveTab('home');
        setViewingPlayerData(undefined);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showGameDetail, showBindingPage, activeTab]);

  // --- 动作处理 (Actions) ---
  
  const refreshPlayerData = async (): Promise<SearchResult | null> => {
    if (!boundPlayerData) return null;
    try {
      const latestPlayerData = await apiService.getPlayer(boundPlayerData.profile_id);
      const updated = transformPlayerData(latestPlayerData);
      setBoundPlayerData(updated);
      return updated;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleAccountBind = async (playerData: SearchResult) => {
    try {
      await StorageService.saveBoundPlayer(playerData);
      setBoundPlayerData(playerData);
      setShowBindingPage(false);
    } catch (error) {
      Alert.alert('错误', '绑定保存失败');
    }
  };

  const handleAccountUnbind = () => {
    Alert.alert('退出登录', '确定要退出当前账户吗？', [
      { text: '取消', style: 'cancel' },
      { 
        text: '退出', 
        style: 'destructive', 
        onPress: async () => {
          await StorageService.removeBoundPlayer();
          setBoundPlayerData(undefined);
        }
      }
    ]);
  };

  const navigationActions = {
    setTab: (tab: string) => {
      if (tab !== 'history') setViewingPlayerData(undefined);
      setActiveTab(tab);
    },
    showBinding: () => setShowBindingPage(true),
    hideBinding: () => setShowBindingPage(false),
    viewPlayerHistory: (player: SearchResult) => {
      setViewingPlayerData(player);
      setActiveTab('history');
    },
    showGameDetail: (gameId: number | string, profileId: number) => {
      setGameDetailData({ gameId: Number(gameId), profileId });
      setShowGameDetail(true);
    },
    // 从主页点击最近比赛进入详情
    showGameDetailFromHome: (gameId: string) => {
        if (boundPlayerData) {
            setGameDetailData({ gameId: Number(gameId), profileId: boundPlayerData.profile_id });
            setShowGameDetail(true);
        }
    },
    hideGameDetail: () => {
      setShowGameDetail(false);
      setGameDetailData(null);
    },
    bindAccount: handleAccountBind,
    unbindAccount: handleAccountUnbind,
    refreshData: refreshPlayerData,
  };

  // --- 返回给 UI 的数据 ---
  return {
    state: {
      activeTab,
      boundPlayerData,
      showBindingPage,
      viewingPlayerData,
      showGameDetail,
      gameDetailData,
      isLoadingData,
    },
    actions: navigationActions,
  };
}