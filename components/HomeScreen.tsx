import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GameRecord } from './GameRecord';
import { SearchResult } from '../types';
import { formatTier, formatRankLevel, getRankIcon, getCountryFlag } from '../services/apiService';

// 骨架屏组件
function SkeletonLoader() {
  return (
    <View className="animate-pulse">
      {/* 骨架屏头像 */}
      <View className="flex-row items-center space-x-4 mb-6">
        <View className="w-16 h-16 bg-white/10 rounded-2xl" />
        <View className="flex-1">
          <View className="h-5 bg-white/10 rounded-lg mb-2 w-32" />
          <View className="h-4 bg-white/10 rounded-lg w-24" />
        </View>
      </View>
      
      {/* 骨架屏数据卡片 */}
      <View className="flex-row space-x-2">
        <View className="flex-1 bg-white/10 rounded-2xl p-4">
          <View className="h-6 bg-white/10 rounded mb-2" />
          <View className="h-3 bg-white/10 rounded w-16" />
        </View>
        <View className="flex-1 bg-white/10 rounded-2xl p-4">
          <View className="h-6 bg-white/10 rounded mb-2" />
          <View className="h-3 bg-white/10 rounded w-16" />
        </View>
        <View className="flex-1 bg-white/10 rounded-2xl p-4">
          <View className="h-6 bg-white/10 rounded mb-2" />
          <View className="h-3 bg-white/10 rounded w-16" />
        </View>
      </View>
    </View>
  );
}

interface HomeScreenProps {
  boundPlayerData?: SearchResult;
  onShowBinding: () => void;
  onUnbind?: () => void;
}

export function HomeScreen({ boundPlayerData, onShowBinding, onUnbind }: HomeScreenProps) {
  // 🔍 打印绑定的玩家数据
  React.useEffect(() => {
    if (boundPlayerData) {
      console.log('=== 主页显示玩家数据 ===');
      console.log('玩家名称:', boundPlayerData.name);
      console.log('玩家ID:', boundPlayerData.profile_id);
      console.log('国家:', boundPlayerData.country);
             console.log('头像数据:', boundPlayerData.avatars);
       console.log('1v1数据:', boundPlayerData.leaderboards.rm_solo);
       console.log('最后对战:', boundPlayerData.last_game_at);
      console.log('完整数据:', JSON.stringify(boundPlayerData, null, 2));
    } else {
      console.log('=== 主页状态 ===');
      console.log('未绑定玩家数据');
    }
  }, [boundPlayerData]);

  // 如果没有绑定账户，显示骨架屏状态
  const showSkeleton = !boundPlayerData;

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient
        colors={['#0f172a', '#581c87', '#0f172a']}
        className="flex-1"
      >
        {/* 头部用户信息 */}
        <View className="px-6 pb-6 pt-10">
          <View className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
            {/* 退出按钮 */}
            {!showSkeleton && onUnbind && (
              <TouchableOpacity 
                onPress={onUnbind}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
                activeOpacity={0.6}
              >
                <FontAwesome5 name="sign-out-alt" size={14} color="#a1a1aa" />
              </TouchableOpacity>
            )}

            {showSkeleton ? (
              <SkeletonLoader />
            ) : (
              <>
                <View className="flex-row items-center mb-6">
                  <View className="relative mr-6">
                    {boundPlayerData.avatars?.medium ? (
                      <Image 
                        source={{ uri: boundPlayerData.avatars.medium }}
                        className="w-16 h-16 rounded-2xl border-2 border-white/20"
                        style={{ width: 64, height: 64, borderRadius: 16 }}
                      />
                    ) : (
                      <View className="w-16 h-16 bg-gray-400 rounded-2xl border-2 border-white/20 flex items-center justify-center">
                        <FontAwesome5 name="user" size={24} color="#ffffff" />
                      </View>
                    )}
                    {boundPlayerData.country && (
                      <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border border-white/20">
                        <Text className="text-xs">
                          {getCountryFlag(boundPlayerData.country)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-white mb-3">{boundPlayerData.name}</Text>
                    <View className="flex-row items-center">
                      <View className="bg-purple-400 px-3 py-1 rounded-full mr-3">
                        <Text className="text-xs font-semibold text-white">
                          {boundPlayerData.leaderboards.rm_solo ? 
                            `${getRankIcon(boundPlayerData.leaderboards.rm_solo.rank_level)} ${formatRankLevel(boundPlayerData.leaderboards.rm_solo.rank_level)}` : 
                            '❓ 未知段位'
                          }
                        </Text>
                      </View>
                      <Text className="text-white/60 text-sm">
                        #{boundPlayerData.leaderboards.rm_solo?.rank || '---'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {/* 核心数据 */}
                <View className="flex-row">
                  <View className="bg-white/10 rounded-2xl p-4 flex-1 mr-2">
                    <Text className="text-2xl font-bold text-white mb-1 text-center">
                      {boundPlayerData.leaderboards.rm_solo ? 
                        `${boundPlayerData.leaderboards.rm_solo.win_rate.toFixed(1)}%` : 
                        '--'
                      }
                    </Text>
                    <Text className="text-white/60 text-xs text-center">总胜率</Text>
                    <View className="w-full bg-white/20 rounded-full h-1 mt-2">
                      <View 
                        className="bg-emerald-500 h-1 rounded-full" 
                        style={{ 
                          width: boundPlayerData.leaderboards.rm_solo ? 
                            `${boundPlayerData.leaderboards.rm_solo.win_rate}%` : 
                            '0%' 
                        }} 
                      />
                    </View>
                  </View>
                  <View className="bg-white/10 rounded-2xl p-4 flex-1 mx-2">
                    <Text className="text-2xl font-bold text-white mb-1 text-center">
                      {boundPlayerData.leaderboards.rm_solo?.games_count || '--'}
                    </Text>
                    <Text className="text-white/60 text-xs text-center">总场次</Text>
                    <Text className="text-emerald-400 text-xs mt-1 text-center">--</Text>
                  </View>
                  <View className="bg-white/10 rounded-2xl p-4 flex-1 ml-2">
                    <Text className="text-2xl font-bold text-white mb-1 text-center">
                      {boundPlayerData.leaderboards.rm_solo?.rating || '--'}
                    </Text>
                    <Text className="text-white/60 text-xs text-center">ELO分数</Text>
                    <View className="flex-row items-center justify-center mt-1">
                      <Text className="text-white/40 text-xs">--</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* 内容区域 */}
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          {showSkeleton ? (
            /* 未绑定状态 - 显示绑定入口 */
            <View className="bg-white/95 rounded-3xl p-8 mb-6 shadow-lg items-center">
              <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
                <FontAwesome5 name="link" size={24} color="#7c3aed" />
              </View>
              <Text className="text-gray-800 font-bold text-lg mb-2">绑定游戏账户</Text>
              <Text className="text-gray-500 text-center text-sm leading-5 mb-6">
                绑定你的游戏账户后{'\n'}即可查看详细的数据统计和对战记录
              </Text>
              <TouchableOpacity 
                onPress={onShowBinding}
                className="bg-purple-500 rounded-2xl px-8 py-3"
              >
                <Text className="text-white font-bold text-base">立即绑定</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* 快速统计  */}
              <View className="bg-white/95 rounded-3xl p-6 mb-4 shadow-lg">
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-lg font-bold text-gray-800">本月表现</Text>
                  <View className="bg-gray-100 rounded-full px-3 py-1">
                    <Text className="text-gray-600 text-xs font-medium">12月</Text>
                  </View>
                </View>
                <View className="flex-row ">
                  {/* 1v1 排名卡片 */}
                  <View className="flex-1 mr-3">
                    <LinearGradient
                      colors={['#e0f2fe', '#b3e5fc']}
                      style={{ borderRadius: 15, padding: 20 }}
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-cyan-700 font-bold text-sm">1v1 排名</Text>
                        <View className="bg-cyan-200 rounded-full p-2">
                          <FontAwesome5 name="trophy" size={14} color="#0891b2" />
                        </View>
                      </View>
                      <Text className="text-3xl font-bold text-cyan-900 mb-2">
                        #{boundPlayerData.leaderboards.rm_solo?.rank || '---'}
                      </Text>
                      <View className="flex-row items-center">
                        <View className="bg-gray-100 rounded-full px-3 py-1">
                          <Text className="text-gray-600 text-xs font-semibold">--</Text>
                        </View>
                        <Text className="text-cyan-600 text-xs ml-2">本月</Text>
                      </View>
                    </LinearGradient>
                  </View>
                  
                  {/* 团队排名卡片 */}
                  <View className="flex-1 ml-3">
                    <LinearGradient
                      colors={['#f3e8ff', '#e9d5ff']}
                      style={{ borderRadius: 15, padding: 20 }}
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-purple-700 font-bold text-sm">团队排名</Text>
                        <View className="bg-purple-200 rounded-full p-2">
                          <FontAwesome5 name="users" size={14} color="#7c3aed" />
                        </View>
                      </View>
                      <Text className="text-3xl font-bold text-purple-900 mb-2">#892</Text>
                      <View className="flex-row items-center">
                        <View className="bg-red-100 rounded-full px-3 py-1 flex-row items-center">
                          <FontAwesome5 name="arrow-down" size={10} color="#dc2626" />
                          <Text className="text-red-700 text-xs font-semibold ml-1">-5</Text>
                        </View>
                        <Text className="text-purple-600 text-xs ml-2">本月</Text>
                      </View>
                    </LinearGradient>
                  </View>
                </View>
              </View>

              {/* 最近对战 */}
              <View className="bg-white/95 rounded-3xl p-6 mb-6 shadow-lg">
                {/* 头部区域 */}
                <View className="mb-6">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-bold text-gray-800">最近对战</Text>
                    <TouchableOpacity className="bg-purple-100 rounded-full px-3 py-1">
                      <Text className="text-purple-600 text-sm font-medium">查看全部</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* 战绩摘要 */}
                  <View className="flex-row space-x-3 mb-4">
                    <View className="bg-emerald-50 rounded-full px-3 py-1 flex-row items-center">
                      <View className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                      <Text className="text-emerald-700 text-xs font-medium">2胜</Text>
                    </View>
                    <View className="bg-red-50 rounded-full px-3 py-1 flex-row items-center">
                      <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                      <Text className="text-red-700 text-xs font-medium">1负</Text>
                    </View>
                    <View className="bg-gray-50 rounded-full px-3 py-1">
                      <Text className="text-gray-600 text-xs font-medium">胜率 66.7%</Text>
                    </View>
                  </View>
                  
                  {/* 筛选标签 */}
                  <View className="flex-row space-x-2">
                    <View className="bg-gray-800 rounded-full px-3 py-1">
                      <Text className="text-white text-xs font-medium">全部</Text>
                    </View>
                    <TouchableOpacity className="bg-gray-100 rounded-full px-3 py-1">
                      <Text className="text-gray-600 text-xs">1v1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-100 rounded-full px-3 py-1">
                      <Text className="text-gray-600 text-xs">团队</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-100 rounded-full px-3 py-1">
                      <Text className="text-gray-600 text-xs">本周</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* 游戏记录 */}
                <View>
                  <GameRecord
                    mapName="Dry Arabia"
                    mapIcon="map"
                    gameMode="RM 1v1"
                    duration="15分钟"
                    isWin={true}
                    playerName="梦想胖到180"
                    playerElo={760}
                    playerIcon="crown"
                    opponentName="SF Brady"
                    opponentElo={763}
                    opponentIcon="chess-rook"
                    eloChange={22}
                    timeAgo="8天前"
                    mapIconColor="#16a34a"
                    playerIconColor="#eab308"
                    opponentIconColor="#16a34a"
                  />
                  
                  <GameRecord
                    mapName="Four Lakes"
                    mapIcon="map"
                    gameMode="RM 1v1"
                    duration="18分钟"
                    isWin={false}
                    playerName="梦想胖到180"
                    playerElo={760}
                    playerIcon="crown"
                    opponentName="TheViper"
                    opponentElo={1678}
                    opponentIcon="trophy"
                    eloChange={-18}
                    timeAgo="5天前"
                    mapIconColor="#0ea5e9"
                    playerIconColor="#eab308"
                    opponentIconColor="#dc2626"
                  />
                  
                  <GameRecord
                    mapName="Ancient Spires"
                    mapIcon="mountain"
                    gameMode="RM 1v1"
                    duration="31分钟"
                    isWin={true}
                    playerName="梦想胖到180"
                    playerElo={760}
                    playerIcon="crown"
                    opponentName="NoobSlayer"
                    opponentElo={892}
                    opponentIcon="fire"
                    eloChange={25}
                    timeAgo="3天前"
                    mapIconColor="#7c3aed"
                    playerIconColor="#eab308"
                    opponentIconColor="#f59e0b"
                  />
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
} 