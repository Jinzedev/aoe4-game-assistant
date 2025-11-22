import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image, ImageSourcePropType } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ApiService from '../services/apiService';
import { getMapInfo, getChineseMapName } from '../services/mapImages';
import { getCivilizationInfo } from '../services/civilizationImages';

// 安全的图片组件，带错误处理
function SafeImage({ source, style, className, fallback }: { 
  source: ImageSourcePropType; 
  style?: any; 
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return <>{fallback}</>;
  }

  return (
    <Image
      source={source}
      style={style}
      className={className}
      onError={() => {
        console.log('图片加载失败');
        setImageError(true);
      }}
    />
  );
}

interface GameDetailScreenProps {
  gameId: number;
  profileId: number;
  onBack: () => void;
}

export function GameDetailScreen({ gameId, profileId, onBack }: GameDetailScreenProps) {
  const [gameBasicInfo, setGameBasicInfo] = useState<any>(null);
  const [gameSummary, setGameSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // 获取游戏基本信息
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

  // 获取游戏详细数据
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
                            <SafeImage 
                              source={{ uri: mapInfo.imageUrl }} 
                              className="w-full h-full"
                              style={{ resizeMode: 'cover' }}
                              fallback={<View className="w-full h-full items-center justify-center"><FontAwesome5 name="map" size={24} color="white" /></View>}
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

                    {/* 对局比较卡片 */}
                    <View className="bg-white/95 rounded-3xl p-6 mb-4">
                      <Text className="text-xl font-bold text-gray-800 mb-6">对局比较</Text>
                      
                      {/* 玩家对比 */}
                      <View className="flex-row justify-between items-center mb-6">
                        {/* 当前玩家 */}
                        <View className="flex-1">
                          <View className="flex-row items-center mb-2">
                            {/* 文明图片 */}
                            <View className="w-12 h-12 rounded-xl mr-3 overflow-hidden" 
                                  style={{ backgroundColor: getCivilizationInfo(currentPlayer.civilization).color }}>
                              {getCivilizationInfo(currentPlayer.civilization).imageUrl ? (
                                <SafeImage 
                                  source={{ uri: getCivilizationInfo(currentPlayer.civilization).imageUrl }} 
                                  className="w-full h-full"
                                  style={{ resizeMode: 'cover' }}
                                  fallback={<View className="w-full h-full items-center justify-center"><FontAwesome5 name="flag" size={16} color="white" /></View>}
                                />
                              ) : (
                                <View className="w-full h-full items-center justify-center">
                                  <FontAwesome5 name="flag" size={16} color="white" />
                                </View>
                              )}
                            </View>
                            {/* 玩家信息 */}
                            <View className="flex-1">
                              <Text className="text-base font-bold text-gray-800 mb-0.5">
                                {currentPlayer.name || '未知玩家'}
                              </Text>
                              <Text className="text-xs text-gray-600">
                                {getCivilizationInfo(currentPlayer.civilization).name}
                              </Text>
                            </View>
                          </View>
                          {/* 分数和变化 */}
                          <View className="flex-row items-center ml-15">
                            <Text className="text-2xl font-bold text-blue-600 mr-3">
                              {currentPlayer.rating || 0}
                            </Text>
                            {!isInvalidGame && currentPlayer.rating_diff && (
                              <View className={`px-2.5 py-1 rounded-full ${
                                currentPlayer.rating_diff > 0 ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                <Text className={`text-sm font-bold ${
                                  currentPlayer.rating_diff > 0 ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {currentPlayer.rating_diff > 0 ? `+${currentPlayer.rating_diff}` : `${currentPlayer.rating_diff}`}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>

                        {/* VS 分隔符 */}
                        <View className="mx-4">
                          <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
                            <Text className="text-gray-600 font-bold text-sm">VS</Text>
                          </View>
                        </View>

                        {/* 对手玩家 */}
                        <View className="flex-1">
                          <View className="flex-row items-center mb-2">
                            {/* 文明图片 */}
                            <View className="w-12 h-12 rounded-xl mr-3 overflow-hidden" 
                                  style={{ backgroundColor: getCivilizationInfo(opponent.civilization).color }}>
                              {getCivilizationInfo(opponent.civilization).imageUrl ? (
                                <SafeImage 
                                  source={{ uri: getCivilizationInfo(opponent.civilization).imageUrl }} 
                                  className="w-full h-full"
                                  style={{ resizeMode: 'cover' }}
                                  fallback={<View className="w-full h-full items-center justify-center"><FontAwesome5 name="flag" size={16} color="white" /></View>}
                                />
                              ) : (
                                <View className="w-full h-full items-center justify-center">
                                  <FontAwesome5 name="flag" size={16} color="white" />
                                </View>
                              )}
                            </View>
                            {/* 玩家信息 */}
                            <View className="flex-1">
                              <Text className="text-base font-bold text-gray-800 mb-0.5">
                                {opponent.name || '未知玩家'}
                              </Text>
                              <Text className="text-xs text-gray-600">
                                {getCivilizationInfo(opponent.civilization).name}
                              </Text>
                            </View>
                          </View>
                          {/* 分数和变化 */}
                          <View className="flex-row items-center ml-15">
                            <Text className="text-2xl font-bold text-blue-600 mr-3">
                              {opponent.rating || 0}
                            </Text>
                            {!isInvalidGame && opponent.rating_diff && (
                              <View className={`px-2.5 py-1 rounded-full ${
                                opponent.rating_diff > 0 ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                <Text className={`text-sm font-bold ${
                                  opponent.rating_diff > 0 ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {opponent.rating_diff > 0 ? `+${opponent.rating_diff}` : `${opponent.rating_diff}`}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>

                      {/* 详细数据对比 */}
                      <View className="bg-gray-50 rounded-2xl p-4">
                        <Text className="text-lg font-bold text-gray-800 mb-4 text-center">详细数据</Text>
                        
                        {summaryLoading ? (
                          <View className="items-center py-8">
                            <ActivityIndicator size="small" color="#8b5cf6" />
                            <Text className="text-gray-500 mt-2 text-sm">加载详细数据中...</Text>
                          </View>
                        ) : gameSummary && gameSummary.players ? (() => {
                          // 从详细数据中找到对应的玩家
                          const currentSummaryPlayer = gameSummary.players.find((p: any) => 
                            Number(p.profileId) === Number(profileId)
                          );
                          const opponentSummaryPlayer = gameSummary.players.find((p: any) => 
                            Number(p.profileId) !== Number(profileId)
                          );

                          if (!currentSummaryPlayer || !opponentSummaryPlayer) {
                            return (
                              <Text className="text-center text-gray-500 py-4">暂无详细数据</Text>
                            );
                          }

                          // 通用的对比显示组件
                          const ComparisonRow = ({ currentValue, opponentValue, higherIsBetter = true }: {
                            currentValue: number;
                            opponentValue: number;
                            higherIsBetter?: boolean;
                          }) => {
                            const currentHigher = higherIsBetter ? currentValue > opponentValue : currentValue < opponentValue;
                            const opponentHigher = higherIsBetter ? opponentValue > currentValue : opponentValue < currentValue;
                            
                            return (
                              <>
                                <View className={`flex-1 py-2 px-3 rounded-lg ${
                                  currentHigher ? 'bg-green-100' : 'bg-transparent'
                                }`}>
                                  <Text className={`text-sm font-semibold text-center ${
                                    currentHigher ? 'text-green-800' : 'text-gray-700'
                                  }`}>
                                    {currentValue.toLocaleString()}
                                  </Text>
                                </View>
                                <Text className="text-xs text-gray-400 mx-4">vs</Text>
                                <View className={`flex-1 py-2 px-3 rounded-lg ${
                                  opponentHigher ? 'bg-green-100' : 'bg-transparent'
                                }`}>
                                  <Text className={`text-sm font-semibold text-center ${
                                    opponentHigher ? 'text-green-800' : 'text-gray-700'
                                  }`}>
                                    {opponentValue.toLocaleString()}
                                  </Text>
                                </View>
                              </>
                            );
                          };

                          return (
                            <>
                              {/* 分数数据 */}
                              <View className="mb-4">
                                <Text className="text-base font-semibold text-gray-700 mb-3">🏆 分数对比</Text>
                                
                                {/* 总分 */}
                                <View className="mb-3">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">总分</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    {(() => {
                                      const currentScore = currentSummaryPlayer.scores?.total || 0;
                                      const opponentScore = opponentSummaryPlayer.scores?.total || 0;
                                      const currentHigher = currentScore > opponentScore;
                                      const opponentHigher = opponentScore > currentScore;
                                      
                                      return (
                                        <>
                                          <View className={`flex-1 py-2 px-3 rounded-lg ${
                                            currentHigher ? 'bg-green-100' : 'bg-transparent'
                                          }`}>
                                            <Text className={`text-base font-bold text-center ${
                                              currentHigher ? 'text-green-800' : 'text-gray-800'
                                            }`}>
                                              {currentScore.toLocaleString()}
                                            </Text>
                                          </View>
                                          <Text className="text-xs text-gray-500 mx-4">vs</Text>
                                          <View className={`flex-1 py-2 px-3 rounded-lg ${
                                            opponentHigher ? 'bg-green-100' : 'bg-transparent'
                                          }`}>
                                            <Text className={`text-base font-bold text-center ${
                                              opponentHigher ? 'text-green-800' : 'text-gray-800'
                                            }`}>
                                              {opponentScore.toLocaleString()}
                                            </Text>
                                          </View>
                                        </>
                                      );
                                    })()}
                                  </View>
                                </View>

                                {/* 军事分 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-xs">⚔️ 军事</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer.scores?.military || 0}
                                      opponentValue={opponentSummaryPlayer.scores?.military || 0}
                                    />
                                  </View>
                                </View>

                                {/* 经济分 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-xs">💰 经济</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer.scores?.economy || 0}
                                      opponentValue={opponentSummaryPlayer.scores?.economy || 0}
                                    />
                                  </View>
                                </View>

                                {/* 科技分 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-xs">🔬 科技</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer.scores?.technology || 0}
                                      opponentValue={opponentSummaryPlayer.scores?.technology || 0}
                                    />
                                  </View>
                                </View>

                                {/* 社会分 */}
                                <View className="mb-3">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-xs">🏛️ 社会</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer.scores?.society || 0}
                                      opponentValue={opponentSummaryPlayer.scores?.society || 0}
                                    />
                                  </View>
                                </View>
                              </View>

                              {/* 分隔线 */}
                              <View className="h-px bg-gray-300 my-4" />

                              {/* 资源消耗数据 */}
                              <View className="mb-4">
                                <Text className="text-base font-semibold text-gray-700 mb-3">💰 资源数据</Text>
                                
                                {/* 总资源消耗 */}
                                <View className="mb-3">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">总消耗</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    {(() => {
                                      const currentTotal = currentSummaryPlayer.totalResourcesSpent?.total || 0;
                                      const opponentTotal = opponentSummaryPlayer.totalResourcesSpent?.total || 0;
                                      const currentHigher = currentTotal > opponentTotal;
                                      const opponentHigher = opponentTotal > currentTotal;
                                      
                                      return (
                                        <>
                                          <View className={`flex-1 py-2 px-3 rounded-lg ${
                                            currentHigher ? 'bg-green-100' : 'bg-transparent'
                                          }`}>
                                            <Text className={`text-base font-bold text-center ${
                                              currentHigher ? 'text-green-800' : 'text-gray-800'
                                            }`}>
                                              {currentTotal.toLocaleString()}
                                            </Text>
                                          </View>
                                          <Text className="text-xs text-gray-500 mx-4">vs</Text>
                                          <View className={`flex-1 py-2 px-3 rounded-lg ${
                                            opponentHigher ? 'bg-green-100' : 'bg-transparent'
                                          }`}>
                                            <Text className={`text-base font-bold text-center ${
                                              opponentHigher ? 'text-green-800' : 'text-gray-800'
                                            }`}>
                                              {opponentTotal.toLocaleString()}
                                            </Text>
                                          </View>
                                        </>
                                      );
                                    })()}
                                  </View>
                                </View>

                                {/* 食物消耗 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-xs">🥖 食物</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer.totalResourcesSpent?.food || 0}
                                      opponentValue={opponentSummaryPlayer.totalResourcesSpent?.food || 0}
                                    />
                                  </View>
                                </View>

                                {/* 木材消耗 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-xs">🪵 木材</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer.totalResourcesSpent?.wood || 0}
                                      opponentValue={opponentSummaryPlayer.totalResourcesSpent?.wood || 0}
                                    />
                                  </View>
                                </View>

                                {/* 金币消耗 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-xs">🪙 金币</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer.totalResourcesSpent?.gold || 0}
                                      opponentValue={opponentSummaryPlayer.totalResourcesSpent?.gold || 0}
                                    />
                                  </View>
                                </View>

                                {/* 石材消耗 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-xs">🪨 石材</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer.totalResourcesSpent?.stone || 0}
                                      opponentValue={opponentSummaryPlayer.totalResourcesSpent?.stone || 0}
                                    />
                                  </View>
                                </View>

                                {/* 橄榄油消耗 */}
                                <View className="mb-3">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-xs">🫒 橄榄油</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer.totalResourcesSpent?.oliveoil || 0}
                                      opponentValue={opponentSummaryPlayer.totalResourcesSpent?.oliveoil || 0}
                                    />
                                  </View>
                                </View>
                              </View>

                              {/* 分隔线 */}
                              <View className="h-px bg-gray-300 my-4" />



                              {/* Military */}
                              <View className="mb-4">
                                <Text className="text-base font-semibold text-gray-700 mb-3">⚔️ 军事</Text>
                                
                                {/* 军事生产 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">生产</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer._stats?.sqprod || 0}
                                      opponentValue={opponentSummaryPlayer._stats?.sqprod || 0}
                                    />
                                  </View>
                                </View>

                                {/* 击杀 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">击杀</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer._stats?.sqkill || 0}
                                      opponentValue={opponentSummaryPlayer._stats?.sqkill || 0}
                                    />
                                  </View>
                                </View>

                                {/* 死亡 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">死亡</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer._stats?.edeaths || 0}
                                      opponentValue={opponentSummaryPlayer._stats?.edeaths || 0}
                                      higherIsBetter={false}
                                    />
                                  </View>
                                </View>

                                {/* K/D比率 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">K/D</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={(() => {
                                        const kills = currentSummaryPlayer._stats?.sqkill || 0;
                                        const deaths = currentSummaryPlayer._stats?.edeaths || 1;
                                        return deaths > 0 ? parseFloat((kills / deaths).toFixed(2)) : kills;
                                      })()}
                                      opponentValue={(() => {
                                        const kills = opponentSummaryPlayer._stats?.sqkill || 0;
                                        const deaths = opponentSummaryPlayer._stats?.edeaths || 1;
                                        return deaths > 0 ? parseFloat((kills / deaths).toFixed(2)) : kills;
                                      })()}
                                    />
                                  </View>
                                </View>
                              </View>

                              {/* 分隔线 */}
                              <View className="h-px bg-gray-300 my-4" />

                              {/* Buildings */}
                              <View className="mb-4">
                                <Text className="text-base font-semibold text-gray-700 mb-3">🏗️ 建筑</Text>
                                
                                {/* 建筑摧毁 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">摧毁</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer._stats?.structdmg || 0}
                                      opponentValue={opponentSummaryPlayer._stats?.structdmg || 0}
                                    />
                                  </View>
                                </View>

                                {/* 建筑损失 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">损失</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer._stats?.blost || 0}
                                      opponentValue={opponentSummaryPlayer._stats?.blost || 0}
                                      higherIsBetter={false}
                                    />
                                  </View>
                                </View>
                              </View>

                              {/* 分隔线 */}
                              <View className="h-px bg-gray-300 my-4" />

                              {/* Tech */}
                              <View className="mb-4">
                                <Text className="text-base font-semibold text-gray-700 mb-3">🔬 科技</Text>
                                
                                {/* 科技研究 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">研究</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer._stats?.upg || 0}
                                      opponentValue={opponentSummaryPlayer._stats?.upg || 0}
                                    />
                                  </View>
                                </View>
                              </View>

                              {/* 分隔线 */}
                              <View className="h-px bg-gray-300 my-4" />

                              {/* Sacred Sites */}
                              <View className="mb-4">
                                <Text className="text-base font-semibold text-gray-700 mb-3">🏛️ 圣地</Text>
                                
                                {/* 圣地占领 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">占领</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer._stats?.pcap || 0}
                                      opponentValue={opponentSummaryPlayer._stats?.pcap || 0}
                                    />
                                  </View>
                                </View>

                                {/* 圣地损失 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">损失</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer._stats?.plost || 0}
                                      opponentValue={opponentSummaryPlayer._stats?.plost || 0}
                                      higherIsBetter={false}
                                    />
                                  </View>
                                </View>

                                {/* 中立圣地 */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">中立</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer._stats?.precap || 0}
                                      opponentValue={opponentSummaryPlayer._stats?.precap || 0}
                                    />
                                  </View>
                                </View>
                              </View>

                              {/* 分隔线 */}
                              <View className="h-px bg-gray-300 my-4" />

                              {/* Misc */}
                              <View className="mb-4">
                                <Text className="text-base font-semibold text-gray-700 mb-3">📊 其他</Text>
                                
                                {/* APM */}
                                <View className="mb-2">
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-gray-600 text-sm">APM</Text>
                                  </View>
                                  <View className="flex-row justify-between items-center">
                                    <ComparisonRow 
                                      currentValue={currentSummaryPlayer.apm || 0}
                                      opponentValue={opponentSummaryPlayer.apm || 0}
                                    />
                                  </View>
                                </View>
                              </View>


                            </>
                          );
                        })() : (
                          <Text className="text-center text-gray-500 py-4">暂无详细数据</Text>
                        )}
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