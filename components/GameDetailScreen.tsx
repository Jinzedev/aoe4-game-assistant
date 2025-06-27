import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ApiService from '../services/apiService';
import { getMapInfo, getChineseMapName } from '../services/mapImages';
import { getCivilizationInfo } from '../services/civilizationImages';

interface GameDetailScreenProps {
  gameId: number;
  profileId: number;
  onBack: () => void;
}

export function GameDetailScreen({ gameId, profileId, onBack }: GameDetailScreenProps) {
  const [gameBasicInfo, setGameBasicInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 获取游戏基本信息
  const fetchGameBasicInfo = async () => {
    try {
      setLoading(true);
      console.log('🎮 获取游戏基本信息:', { gameId, profileId });
      const data = await ApiService.getPlayerGame(profileId, gameId);
      setGameBasicInfo(data);
      console.log('✅ 游戏基本信息:', data);
    } catch (error) {
      console.error('❌ 获取游戏基本信息失败:', error);
      Alert.alert('获取失败', '无法获取游戏基本信息，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameId && profileId) {
      fetchGameBasicInfo();
    }
  }, [gameId, profileId]);

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        className="flex-1"
      >
        {/* 头部导航 */}
        <View className="flex-row items-center justify-between pt-12 pb-4 px-4">
          <TouchableOpacity
            onPress={onBack}
            className="flex-row items-center bg-white/10 rounded-full px-4 py-2"
          >
            <FontAwesome5 name="arrow-left" size={16} color="white" />
            <Text className="text-white font-medium ml-2">返回</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">游戏详情</Text>
          <View className="w-16" />
        </View>

        <View className="flex-1 px-4">
          {loading ? (
            <View className="bg-white/95 rounded-3xl p-8 items-center">
              <ActivityIndicator size="large" color="#8b5cf6" />
              <Text className="text-gray-600 mt-4 text-base">加载游戏信息中...</Text>
            </View>
          ) : !gameBasicInfo ? (
            <View className="bg-white/95 rounded-3xl p-8 items-center">
              <FontAwesome5 name="exclamation-triangle" size={32} color="#ef4444" />
              <Text className="text-gray-600 mt-4 text-base text-center">无法加载游戏信息</Text>
            </View>
          ) : (
            <>
              {/* 游戏信息卡片 */}
              {(() => {
                // 处理teams数据结构
                let allPlayers: any[] = [];
                if (gameBasicInfo.teams && Array.isArray(gameBasicInfo.teams)) {
                  if (gameBasicInfo.teams.length > 0 && Array.isArray(gameBasicInfo.teams[0])) {
                    allPlayers = gameBasicInfo.teams.flat().map((wrapper: any) => wrapper.player || wrapper);
                  }
                }

                if (allPlayers.length < 2) {
                  return (
                    <View className="bg-white/95 rounded-3xl p-8 items-center">
                      <FontAwesome5 name="info-circle" size={32} color="#6b7280" />
                      <Text className="text-gray-600 mt-4 text-base text-center">游戏数据不完整</Text>
                    </View>
                  );
                }

                // 找到当前用户和对手
                const currentPlayer = allPlayers.find((p: any) => 
                  Number(p.profile_id) === Number(profileId)
                );
                const opponent = allPlayers.find((p: any) => 
                  Number(p.profile_id) !== Number(profileId)
                );

                if (!currentPlayer || !opponent) {
                  return (
                    <View className="bg-white/95 rounded-3xl p-8 items-center">
                      <FontAwesome5 name="info-circle" size={32} color="#6b7280" />
                      <Text className="text-gray-600 mt-4 text-base text-center">无法找到玩家信息</Text>
                    </View>
                  );
                }

                const isWin = currentPlayer.result === 'win';
                const mapInfo = getMapInfo(gameBasicInfo.map || '');
                
                // 计算时间差
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

                // 检测是否为无效对局
                const isInvalidGame = gameBasicInfo.duration && gameBasicInfo.duration < 300;
                
                // 格式化游戏模式
                let gameMode = '1v1排位赛';
                if (gameBasicInfo.leaderboard) {
                  const modeMap: Record<string, string> = {
                    'rm_solo': '1v1排位赛',
                    'rm_team': '团队排位赛',
                    'qm_1v1': '1v1快速匹配',
                    'qm_2v2': '2v2快速匹配',
                    'qm_3v3': '3v3快速匹配',
                    'qm_4v4': '4v4快速匹配',
                    'custom': '自定义游戏',
                    'unranked': '非排位赛'
                  };
                  gameMode = modeMap[gameBasicInfo.leaderboard] || gameBasicInfo.leaderboard;
                }
                
                if (isInvalidGame) {
                  gameMode += ' (无效)';
                }

                // 格式化游戏时长
                const formatDuration = (seconds: number) => {
                  const minutes = Math.floor(seconds / 60);
                  const secs = seconds % 60;
                  return `${minutes}分${secs}秒`;
                };

                const duration = gameBasicInfo.duration ? formatDuration(gameBasicInfo.duration) : '--';

                // 服务器名称映射
                const serverMap: Record<string, string> = {
                  'Korea': '韩国服务器',
                  'US West': '美国西部服务器',
                  'US East': '美国东部服务器',
                  'Europe': '欧洲服务器',
                  'Brazil': '巴西服务器',
                  'Australia': '澳洲服务器',
                  'Singapore': '新加坡服务器'
                };

                const serverName = serverMap[gameBasicInfo.server] || gameBasicInfo.server || '未知服务器';

                return (
                  <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    {/* 地图信息卡片 */}
                    <View className="bg-white/95 rounded-3xl p-6 mb-4">
                      <View className="flex-row items-center mb-4">
                        <View className="w-16 h-16 rounded-2xl mr-4 overflow-hidden" style={{ backgroundColor: mapInfo.color }}>
                          {mapInfo.imageUrl ? (
                            <Image 
                              source={{ uri: mapInfo.imageUrl }} 
                              className="w-full h-full"
                              style={{ resizeMode: 'cover' }}
                            />
                          ) : (
                            <View className="w-full h-full items-center justify-center">
                              <FontAwesome5 name="map" size={24} color="white" />
                            </View>
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="text-2xl font-bold text-gray-800 mb-1">
                            {getChineseMapName(gameBasicInfo.map || '未知地图')}
                          </Text>
                          <Text className="text-gray-600 text-base">{gameMode}</Text>
                        </View>
                        <View className={`px-4 py-2 rounded-full ${
                          isInvalidGame ? 'bg-gray-100' : (isWin ? 'bg-green-100' : 'bg-red-100')
                        }`}>
                          <Text className={`text-lg font-bold ${
                            isInvalidGame ? 'text-gray-600' : (isWin ? 'text-green-700' : 'text-red-700')
                          }`}>
                            {isInvalidGame ? '无效' : (isWin ? '胜利' : '失败')}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* 游戏详细信息卡片 */}
                    <View className="bg-white/95 rounded-3xl p-6 mb-4">
                      <Text className="text-xl font-bold text-gray-800 mb-4">游戏信息</Text>
                      
                      <View>
                        {/* 第一行 */}
                        <View className="flex-row mb-4">
                          <View className="flex-1 bg-gray-50 rounded-2xl p-4 mr-2">
                            <View className="flex-row items-center mb-2">
                              <FontAwesome5 name="server" size={16} color="#6b7280" />
                              <Text className="text-gray-600 ml-2 text-sm">服务器</Text>
                            </View>
                            <Text className="text-gray-800 font-semibold text-base">{serverName}</Text>
                          </View>
                          <View className="flex-1 bg-gray-50 rounded-2xl p-4 ml-2">
                            <View className="flex-row items-center mb-2">
                              <FontAwesome5 name="clock" size={16} color="#6b7280" />
                              <Text className="text-gray-600 ml-2 text-sm">游戏时长</Text>
                            </View>
                            <Text className="text-gray-800 font-semibold text-base">{duration}</Text>
                          </View>
                        </View>
                        
                        {/* 第二行 */}
                        <View className="flex-row mb-4">
                          <View className="flex-1 bg-gray-50 rounded-2xl p-4 mr-2">
                            <View className="flex-row items-center mb-2">
                              <FontAwesome5 name="calendar" size={16} color="#6b7280" />
                              <Text className="text-gray-600 ml-2 text-sm">游戏时间</Text>
                            </View>
                            <Text className="text-gray-800 font-semibold text-base">{timeAgo}</Text>
                          </View>
                          <View className="flex-1 bg-gray-50 rounded-2xl p-4 ml-2">
                            <View className="flex-row items-center mb-2">
                              <FontAwesome5 name="trophy" size={16} color="#6b7280" />
                              <Text className="text-gray-600 ml-2 text-sm">赛季</Text>
                            </View>
                            <Text className="text-gray-800 font-semibold text-base">赛季 {gameBasicInfo.season || '未知'}</Text>
                          </View>
                        </View>
                        
                        {/* 第三行 - 我的分数 */}
                        <View className="bg-blue-50 rounded-2xl p-4">
                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                              <FontAwesome5 name="chart-line" size={16} color="#3b82f6" />
                              <Text className="text-blue-600 ml-2 text-sm font-medium">我的分数</Text>
                            </View>
                            <View className="flex-row items-center">
                              <Text className="text-2xl font-bold text-blue-600 mr-2">
                                {currentPlayer.rating || 0}
                              </Text>
                              <View className={`px-3 py-1 rounded-full ${
                                isInvalidGame ? 'bg-gray-200' : (isWin ? 'bg-green-200' : 'bg-red-200')
                              }`}>
                                <Text className={`text-sm font-bold ${
                                  isInvalidGame ? 'text-gray-600' : (isWin ? 'text-green-700' : 'text-red-700')
                                }`}>
                                  {isInvalidGame ? '--' : (currentPlayer.rating_diff ? 
                                    (currentPlayer.rating_diff > 0 ? `+${currentPlayer.rating_diff}` : `${currentPlayer.rating_diff}`) 
                                    : '±0')}
                                </Text>
                              </View>
                                                         </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                );
              })()}
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  );
} 