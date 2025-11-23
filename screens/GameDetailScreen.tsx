import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar'; // ✅ 1. 新增引入

import ApiService from '../services/apiService';
import { getMapInfo, getChineseMapName } from '../services/mapImages';
import { MatchInfoCard } from '../components/game-detail/MatchInfoCard';
import { GameDetailInfoCard } from '../components/game-detail/GameDetailInfoCard';
import { StatComparisonCard } from '../components/game-detail/StatComparisonCard';
import { GameSummary } from '../types';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'GameDetail'>;

export function GameDetailScreen({ route, navigation }: Props) {
  const { gameId, profileId } = route.params;

  const [gameBasicInfo, setGameBasicInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [gameSummary, setGameSummary] = useState<GameSummary | null>(null);

  const fetchGameBasicInfo = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getPlayerGame(profileId, gameId);
      setGameBasicInfo(data);
    } catch (error) {
      Alert.alert('获取失败', '无法获取游戏基本信息，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const fetchGameSummary = async () => {
    try {
      setSummaryLoading(true);
      const data = await ApiService.getGameSummary(profileId, gameId);
      setGameSummary(data);
    } catch (error) {
      console.error('❌ 获取游戏详细数据失败:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (gameId && profileId) {
      fetchGameBasicInfo();
      fetchGameSummary();
    }
  }, [gameId, profileId]);

  return (
    <SafeAreaProvider>
      {/* ✅ 2. 设置状态栏样式：style="light" 表示白色文字，backgroundColor 设为深色(Android) */}
      <StatusBar style="light"  />
      
      <SafeAreaView 
        style={{ flex: 1, backgroundColor: '#0f172a' }} // ✅ 3. 确保安全区域背景也是深色
        edges={['top']}
      >
        <View className="flex-1 bg-slate-900">
          {/* 头部导航 */}
          <View className="flex-row items-center justify-between px-4 pb-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex-row items-center rounded-full bg-white/10 px-4 py-2">
              <FontAwesome5 name="arrow-left" size={16} color="white" />
              <Text className="ml-2 font-medium text-white">返回</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white">游戏详情</Text>
            <View className="w-16" />
          </View>

          <View className="flex-1 px-4">
            {loading ? (
              <View className="items-center rounded-3xl bg-white/95 p-8">
                <ActivityIndicator size="large" color="#8b5cf6" />
                <Text className="mt-4 text-base text-gray-600">加载游戏信息中...</Text>
              </View>
            ) : !gameBasicInfo ? (
              <View className="items-center rounded-3xl bg-white/95 p-8">
                <FontAwesome5 name="exclamation-triangle" size={32} color="#ef4444" />
                <Text className="mt-4 text-center text-base text-gray-600">无法加载游戏信息</Text>
              </View>
            ) : (
              <>
                {(() => {
                  let allPlayers: any[] = [];
                  if (gameBasicInfo.teams && Array.isArray(gameBasicInfo.teams)) {
                    if (gameBasicInfo.teams.length > 0 && Array.isArray(gameBasicInfo.teams[0])) {
                      allPlayers = gameBasicInfo.teams
                        .flat()
                        .map((wrapper: any) => wrapper.player || wrapper);
                    }
                  }

                  if (allPlayers.length < 2) {
                    return (
                      <View className="items-center rounded-3xl bg-white/95 p-8">
                        <FontAwesome5 name="info-circle" size={32} color="#6b7280" />
                        <Text className="mt-4 text-center text-base text-gray-600">
                          游戏数据不完整
                        </Text>
                      </View>
                    );
                  }

                  const currentPlayer = allPlayers.find(
                    (p: any) => Number(p.profile_id) === Number(profileId)
                  );
                  const opponent = allPlayers.find(
                    (p: any) => Number(p.profile_id) !== Number(profileId)
                  );

                  if (!currentPlayer || !opponent) {
                    return (
                      <View className="items-center rounded-3xl bg-white/95 p-8">
                        <FontAwesome5 name="info-circle" size={32} color="#6b7280" />
                        <Text className="mt-4 text-center text-base text-gray-600">
                          无法找到玩家信息
                        </Text>
                      </View>
                    );
                  }

                  const isWin = currentPlayer.result === 'win';
                  const mapInfo = getMapInfo(gameBasicInfo.map || '');

                  const gameDate = new Date(gameBasicInfo.started_at);
                  const now = new Date();
                  const diffTime = Math.abs(now.getTime() - gameDate.getTime());
                  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                  let timeAgo = '';
                  if (diffHours < 1) {
                    timeAgo = '刚刚';
                  } else if (diffHours < 24) {
                    timeAgo = `${diffHours}小时前`;
                  } else if (diffDays === 1) {
                    timeAgo = '1天前';
                  } else if (diffDays < 7) {
                    timeAgo = `${diffDays}天前`;
                  } else {
                    const diffWeeks = Math.floor(diffDays / 7);
                    timeAgo = `${diffWeeks}周前`;
                  }

                  const isInvalidGame = gameBasicInfo.duration && gameBasicInfo.duration < 300;

                  let gameMode = '1v1排位赛';
                  if (gameBasicInfo.leaderboard) {
                    const modeMap: Record<string, string> = {
                      rm_solo: '1v1排位赛',
                      rm_team: '团队排位赛',
                      qm_1v1: '1v1快速匹配',
                      qm_2v2: '2v2快速匹配',
                      qm_3v3: '3v3快速匹配',
                      qm_4v4: '4v4快速匹配',
                      custom: '自定义游戏',
                      unranked: '非排位赛',
                    };
                    gameMode = modeMap[gameBasicInfo.leaderboard] || gameBasicInfo.leaderboard;
                  }

                  if (isInvalidGame) {
                    gameMode += ' (无效)';
                  }

                  const formatDuration = (seconds: number) => {
                    const minutes = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    return `${minutes}分${secs}秒`;
                  };

                  const duration = gameBasicInfo.duration
                    ? formatDuration(gameBasicInfo.duration)
                    : '--';

                  const serverMap: Record<string, string> = {
                    Korea: '韩国服务器',
                    'US West': '美国西部服务器',
                    'US East': '美国东部服务器',
                    Europe: '欧洲服务器',
                    Brazil: '巴西服务器',
                    Australia: '澳洲服务器',
                    Singapore: '新加坡服务器',
                  };

                  const serverName = serverMap[gameBasicInfo.server] || gameBasicInfo.server || '未知服务器';

                  return (
                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                      <MatchInfoCard
                        mapName={getChineseMapName(gameBasicInfo.map || '未知地图')}
                        mapImageUrl={mapInfo.imageUrl ?? undefined}
                        gameMode={gameMode}
                        result={isInvalidGame ? 'invalid' : isWin ? 'win' : 'lose'}
                        color={mapInfo.color}
                      />

                      <GameDetailInfoCard
                        serverName={serverName}
                        duration={duration}
                        timeAgo={timeAgo}
                        season={gameBasicInfo.season}
                        rating={currentPlayer.rating || 0}
                        ratingDiff={isInvalidGame ? '--' : currentPlayer.rating_diff}
                        isWin={isWin}
                        isInvalidGame={isInvalidGame}
                      />
                      
                      {summaryLoading ? (
                        <View className="items-center py-8">
                          <ActivityIndicator size="small" color="#8b5cf6" />
                          <Text className="mt-2 text-xs text-gray-500">加载详细统计...</Text>
                        </View>
                      ) : 
                      gameSummary?.players && gameSummary.players.length > 0 ? (
                        <StatComparisonCard
                          players={gameSummary.players}
                          currentProfileId={profileId}
                        />
                      ) : null}
                      <View className="h-8" />
                    </ScrollView>
                  );
                })()}
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}