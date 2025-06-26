import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GameRecord } from '../components/GameRecord';
import { SearchResult } from '../types';
import { formatTier, formatRankLevel, getRankIcon, getCountryFlag, apiService, calculateMonthlyStats, MonthlyStats } from '../services/apiService';

import AsyncStorage from '@react-native-async-storage/async-storage';

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
  onViewAllGames?: () => void; // 新增：查看全部游戏的回调
}

export function HomeScreen({ boundPlayerData, onShowBinding, onUnbind, onViewAllGames }: HomeScreenProps) {
  const [monthlyStats, setMonthlyStats] = React.useState<MonthlyStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = React.useState(false);
  const [recentGames, setRecentGames] = React.useState<any[]>([]);
  const [allGames, setAllGames] = React.useState<any[]>([]); // 存储所有游戏数据
  const [isLoadingGames, setIsLoadingGames] = React.useState(false);
  // 筛选相关状态
  const [selectedFilter, setSelectedFilter] = React.useState('all'); // all, 1v1, team, thisWeek, wins, losses

  // 🔥 获取本月表现数据
  React.useEffect(() => {
    const fetchMonthlyStats = async () => {
      if (!boundPlayerData) {
        setMonthlyStats(null);
        return;
      }

      setIsLoadingStats(true);
      try {
        // 计算本月第一天
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthStartISO = monthStart.toISOString();
        
        // 获取本月的游戏记录（所有模式）
        const gamesResponse = await apiService.getPlayerGames(boundPlayerData.profile_id, {
          since: monthStartISO,
          limit: 200 // 增加限制数量，因为包含所有模式
        });
        
        // 计算本月统计
        const stats = calculateMonthlyStats(gamesResponse.games, boundPlayerData.profile_id);
        
        setMonthlyStats(stats);
      } catch (error) {
        console.error('❌ 获取本月表现数据失败:', error);
        // 设置默认数据，避免显示空白
        setMonthlyStats({
          totalGames: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          rankChange: null,
          teamRankChange: null
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchMonthlyStats();
  }, [boundPlayerData]);

  // 🎮 获取最近对战数据
  React.useEffect(() => {
    const fetchRecentGames = async () => {
      if (!boundPlayerData) {
        setRecentGames([]);
        return;
      }

      setIsLoadingGames(true);
      try {
        // 获取最近的游戏记录（所有模式）
        const gamesResponse = await apiService.getPlayerGames(boundPlayerData.profile_id, {
          limit: 20 // 获取更多游戏，因为包含了所有模式
        });
        
        // 转换为UI需要的格式
        const formattedGames = gamesResponse.games
          .filter(game => game.teams && game.teams.length > 0)
          .slice(0, 5) // 只显示前5场
          .map(game => {
            // 找到玩家所在的团队和对手团队
            let playerData = null;
            let playerTeam = null;
            let opponentTeam = null;
            let opponentData = null;
            
            // 遍历所有团队找到玩家
            for (let teamIndex = 0; teamIndex < game.teams.length; teamIndex++) {
              const team = game.teams[teamIndex];
              if (Array.isArray(team)) {
                for (const playerWrapper of team) {
                  if (playerWrapper.player.profile_id === boundPlayerData.profile_id) {
                    playerData = playerWrapper.player;
                    playerTeam = team;
                    // 找到对手团队（另一个团队）
                    opponentTeam = game.teams[1 - teamIndex];
                    break;
                  }
                }
                if (playerData) break;
              }
            }
            
            // 获取对手信息（团队战中取第一个对手，1v1中就是唯一的对手）
            if (opponentTeam && Array.isArray(opponentTeam) && opponentTeam.length > 0) {
              opponentData = opponentTeam[0].player;
            }
            
            if (!playerData || !opponentData) return null;
            
            const isWin = playerData.result === 'win';
            const eloChange = playerData.rating_diff || 0;
            
            // 计算游戏时长
            const duration = game.duration ? `${Math.floor(game.duration / 60)}分钟` : '--';
            
            // 计算时间差
            const gameDate = new Date(game.started_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - gameDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const timeAgo = diffDays === 1 ? '1天前' : `${diffDays}天前`;
            
            // 判断是否为无效对局 - 修改判断逻辑，不仅仅依赖ELO变化
            const isInvalidGame = (
              (game.duration && game.duration < 300) || // 少于5分钟
              playerData.result === null // 结果为空
              // 移除ELO变化的判断，因为定位赛和某些团队战可能ELO为0但仍是有效对局
            );
            
            // 格式化游戏模式
            let gameMode = 'RM 1v1';
            if (game.kind) {
              if (game.kind.includes('1v1')) gameMode = 'RM 1v1';
              else if (game.kind.includes('2v2')) gameMode = 'RM 2v2';
              else if (game.kind.includes('3v3')) gameMode = 'RM 3v3';
              else if (game.kind.includes('4v4')) gameMode = 'RM 4v4';
            } else {
              // 如果没有kind字段，根据团队大小推断
              const teamSize = playerTeam ? playerTeam.length : 1;
              if (teamSize === 1) gameMode = 'RM 1v1';
              else if (teamSize === 2) gameMode = 'RM 2v2';
              else if (teamSize === 3) gameMode = 'RM 3v3';
              else if (teamSize === 4) gameMode = 'RM 4v4';
            }
            
            // 如果是无效对局，添加(Invalid)标记
            if (isInvalidGame) {
              gameMode += ' (Invalid)';
            }
            
            // 构建玩家列表（包括自己和队友）
            const allPlayers = playerTeam ? 
              playerTeam.map(p => ({
                name: p.player.name,
                rating: p.player.rating || 0,
                civilization: p.player.civilization
              })) : [{ name: playerData.name, rating: playerData.rating || 0, civilization: playerData.civilization }];
            
            // 构建对手列表
            const allOpponents = opponentTeam ? 
              opponentTeam.map(p => ({
                name: p.player.name,
                rating: p.player.rating || 0,
                civilization: p.player.civilization
              })) : [{ name: opponentData.name, rating: opponentData.rating || 0, civilization: opponentData.civilization }];

            return {
              gameId: game.game_id.toString(),
              mapName: game.map,
              gameMode,
              duration,
              isWin,
              players: allPlayers,
              opponents: allOpponents,
              eloChange: isInvalidGame ? 0 : (eloChange || 0), // 保留原始ELO变化，包括0
              timeAgo,
              civilization: playerData.civilization,
              opponentCivilization: opponentData.civilization
            };
          })
          .filter(game => game !== null);
        
        setAllGames(formattedGames); // 保存所有游戏数据
        setRecentGames(formattedGames); // 初始显示所有游戏
        
      } catch (error) {
        console.error('❌ 获取最近对战数据失败:', error);
        setAllGames([]);
        setRecentGames([]);
      } finally {
        setIsLoadingGames(false);
      }
    };

    fetchRecentGames();
  }, [boundPlayerData]);

  // 筛选游戏数据
  const filterGames = React.useCallback((filter: string) => {
    if (!allGames.length) return;
    
    let filteredGames = [...allGames];
    
    switch (filter) {
      case '1v1':
        filteredGames = allGames.filter(game => 
          game.gameMode.includes('1v1')
        );
        break;
      case 'team':
        filteredGames = allGames.filter(game => 
          game.gameMode.includes('2v2') || 
          game.gameMode.includes('3v3') || 
          game.gameMode.includes('4v4')
        );
        break;
      case 'thisWeek':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredGames = allGames.filter(game => {
          // 解析时间，比如 "3天前" -> 3天前的日期
          const daysMatch = game.timeAgo.match(/(\d+)天前/);
          if (daysMatch) {
            const daysAgo = parseInt(daysMatch[1]);
            return daysAgo <= 7;
          }
          return true; // 如果解析失败，保留该游戏
        });
        break;
      case 'wins':
        filteredGames = allGames.filter(game => game.isWin);
        break;
      case 'losses':
        filteredGames = allGames.filter(game => !game.isWin);
        break;
      case 'all':
      default:
        filteredGames = allGames;
        break;
    }
    
    // 限制显示数量
    setRecentGames(filteredGames.slice(0, 5));
  }, [allGames]);

  // 当筛选条件改变时更新显示的游戏
  React.useEffect(() => {
    filterGames(selectedFilter);
  }, [selectedFilter, filterGames]);

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
                  </View>
                  <View className="bg-white/10 rounded-2xl p-4 flex-1 ml-2">
                    <Text className="text-2xl font-bold text-white mb-1 text-center">
                      {boundPlayerData.leaderboards.rm_solo?.rating || '--'}
                    </Text>
                    <Text className="text-white/60 text-xs text-center">ELO分数</Text>
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
                className="rounded-2xl px-8 py-4 shadow-lg"
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  style={{
                    borderRadius: 16,
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    alignItems: 'center',
                  }}
                >
                  <Text className="text-white font-bold text-base">立即绑定</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <>


              {/* 本月表现 */}
              <View className="bg-white/95 rounded-3xl p-6 mb-4 shadow-lg">
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-lg font-bold text-gray-800">本月表现</Text>
                  <View className="bg-gray-100 rounded-full px-3 py-1">
                    <Text className="text-gray-600 text-xs font-medium">
                      {new Date().toLocaleDateString('zh-CN', { month: 'long' })}
                    </Text>
                  </View>
                </View>

                {isLoadingStats ? (
                  // 加载状态
                  <View className="flex-row">
                    {[1, 2].map((index) => (
                      <View key={index} className="flex-1 mx-1">
                        <View className="bg-gray-100 rounded-2xl p-5 h-32">
                          <View className="w-8 h-8 bg-gray-200 rounded-full mb-3" />
                          <View className="w-12 h-6 bg-gray-200 rounded mb-2" />
                          <View className="w-16 h-3 bg-gray-200 rounded" />
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="flex-row">
                    {/* 本月胜率卡片 */}
                    <View className="flex-1 mr-3">
                      <LinearGradient
                        colors={['#e0f2fe', '#b3e5fc']}
                        style={{ borderRadius: 15, padding: 20 }}
                      >
                        <View className="flex-row items-center justify-between mb-3">
                          <Text className="text-cyan-700 font-bold text-sm">本月胜率</Text>
                          <View className="bg-cyan-200 rounded-full p-2">
                            <FontAwesome5 name="trophy" size={14} color="#0891b2" />
                          </View>
                        </View>
                        <Text className="text-3xl font-bold text-cyan-900 mb-2">
                          {monthlyStats ? `${monthlyStats.winRate.toFixed(1)}%` : '--'}
                        </Text>
                        <View className="flex-row items-center">
                          <View className="bg-cyan-100 rounded-full px-3 py-1">
                            <Text className="text-cyan-700 text-xs font-semibold">
                              {monthlyStats ? `${monthlyStats.wins}胜${monthlyStats.losses}负` : '暂无数据'}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                    
                    {/* 本月场次卡片 */}
                    <View className="flex-1 ml-3">
                      <LinearGradient
                        colors={['#f3e8ff', '#e9d5ff']}
                        style={{ borderRadius: 15, padding: 20 }}
                      >
                        <View className="flex-row items-center justify-between mb-3">
                          <Text className="text-purple-700 font-bold text-sm">本月场次</Text>
                          <View className="bg-purple-200 rounded-full p-2">
                            <FontAwesome5 name="gamepad" size={14} color="#7c3aed" />
                          </View>
                        </View>
                        <Text className="text-3xl font-bold text-purple-900 mb-2">
                          {monthlyStats ? monthlyStats.totalGames : '--'}
                        </Text>
                        <View className="flex-row items-center">
                          <View className="bg-purple-100 rounded-full px-3 py-1">
                            <Text className="text-purple-700 text-xs font-semibold">
                              {monthlyStats && monthlyStats.totalGames > 0 ? '保持活跃' : '尚未开始'}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                  </View>
                )}
              </View>

              {/* 最近对战 */}
              <View className="bg-white/95 rounded-3xl p-6 mb-6 shadow-lg">
                {/* 头部区域 */}
                <View className="mb-6">
                  <View className="flex-row items-center justify-between mb-4">
                    <View>
                    <Text className="text-lg font-bold text-gray-800">最近对战</Text>
                      <Text className="text-gray-500 text-sm">
                        {selectedFilter === 'all' ? `共${allGames.length}场` : 
                         `筛选出${recentGames.length}场 / 共${allGames.length}场`}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      className="bg-purple-100 rounded-full px-3 py-1"
                      onPress={onViewAllGames}
                    >
                      <Text className="text-purple-600 text-sm font-medium">查看全部</Text>
                    </TouchableOpacity>
                  </View>
                  

                  
                  {/* 筛选标签 */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    className="flex-row"
                    contentContainerStyle={{ paddingRight: 20 }}
                  >
                  <View className="flex-row space-x-2">
                      <TouchableOpacity 
                        onPress={() => setSelectedFilter('all')}
                        className={`rounded-full px-3 py-1 ${
                          selectedFilter === 'all' ? 'bg-purple-600' : 'bg-gray-100'
                        }`}
                      >
                        <Text className={`text-xs font-medium ${
                          selectedFilter === 'all' ? 'text-white' : 'text-gray-600'
                        }`}>
                          全部
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => setSelectedFilter('wins')}
                        className={`rounded-full px-3 py-1 flex-row items-center ${
                          selectedFilter === 'wins' ? 'bg-green-500' : 'bg-gray-100'
                        }`}
                      >
                        <FontAwesome5 
                          name="trophy" 
                          size={10} 
                          color={selectedFilter === 'wins' ? 'white' : '#10b981'} 
                          style={{ marginRight: 4 }}
                        />
                        <Text className={`text-xs font-medium ${
                          selectedFilter === 'wins' ? 'text-white' : 'text-gray-600'
                        }`}>
                          胜利
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => setSelectedFilter('losses')}
                        className={`rounded-full px-3 py-1 flex-row items-center ${
                          selectedFilter === 'losses' ? 'bg-red-500' : 'bg-gray-100'
                        }`}
                      >
                        <FontAwesome5 
                          name="times" 
                          size={10} 
                          color={selectedFilter === 'losses' ? 'white' : '#ef4444'} 
                          style={{ marginRight: 4 }}
                        />
                        <Text className={`text-xs font-medium ${
                          selectedFilter === 'losses' ? 'text-white' : 'text-gray-600'
                        }`}>
                          失败
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => setSelectedFilter('1v1')}
                        className={`rounded-full px-3 py-1 ${
                          selectedFilter === '1v1' ? 'bg-purple-600' : 'bg-gray-100'
                        }`}
                      >
                        <Text className={`text-xs font-medium ${
                          selectedFilter === '1v1' ? 'text-white' : 'text-gray-600'
                        }`}>
                          1v1
                        </Text>
                    </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => setSelectedFilter('team')}
                        className={`rounded-full px-3 py-1 ${
                          selectedFilter === 'team' ? 'bg-purple-600' : 'bg-gray-100'
                        }`}
                      >
                        <Text className={`text-xs font-medium ${
                          selectedFilter === 'team' ? 'text-white' : 'text-gray-600'
                        }`}>
                          团队
                        </Text>
                    </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => setSelectedFilter('thisWeek')}
                        className={`rounded-full px-3 py-1 ${
                          selectedFilter === 'thisWeek' ? 'bg-purple-600' : 'bg-gray-100'
                        }`}
                      >
                        <Text className={`text-xs font-medium ${
                          selectedFilter === 'thisWeek' ? 'text-white' : 'text-gray-600'
                        }`}>
                          本周
                        </Text>
                    </TouchableOpacity>
                  </View>
                  </ScrollView>
                </View>
                
                {/* 游戏记录 */}
                <View>
                  {isLoadingGames ? (
                    // 加载状态
                    <>
                      {[1, 2, 3].map((index) => (
                        <View key={index} className="flex-row items-center py-3 border-b border-gray-100">
                          <View className="w-10 h-10 bg-gray-200 rounded-lg mr-3" />
                          <View className="flex-1">
                            <View className="w-24 h-4 bg-gray-200 rounded mb-2" />
                            <View className="w-16 h-3 bg-gray-200 rounded" />
                          </View>
                          <View className="items-end">
                            <View className="w-12 h-4 bg-gray-200 rounded mb-2" />
                            <View className="w-8 h-3 bg-gray-200 rounded" />
                          </View>
                        </View>
                      ))}
                    </>
                  ) : recentGames.length > 0 ? (
                    recentGames.map((game, index) => (
                      <GameRecord
                        key={game.gameId}
                        mapName={game.mapName}
                        mapIcon="map"
                        gameMode={game.gameMode}
                        duration={game.duration}
                        isWin={game.isWin}
                        players={game.players}
                        playerIcon="crown"
                        opponents={game.opponents}
                        opponentIcon={game.opponents[0]?.rating > game.players[0]?.rating ? "trophy" : "chess-rook"}
                        eloChange={game.eloChange}
                        timeAgo={game.timeAgo}
                        mapIconColor={index % 3 === 0 ? "#16a34a" : index % 3 === 1 ? "#0ea5e9" : "#f59e0b"}
                        playerIconColor="#eab308"
                        opponentIconColor={game.opponents[0]?.rating > game.players[0]?.rating ? "#dc2626" : "#16a34a"}
                      />
                    ))
                  ) : (
                    <View className="py-8 items-center">
                      <Text className="text-gray-500 text-sm">暂无对战记录</Text>
                    </View>
                  )}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}