import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchResult } from '../types';
// 移除已迁移到 HomeHeader 的工具函数，只保留需要的
import { apiService, calculateMonthlyStats, MonthlyStats } from '../services/apiService'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

// 引入新的现代化组件
import { ModernGameCard } from '../components/MatchCard'; 
// 移除已抽取的组件导入
// import { PlayerAvatar } from '../components/PlayerAvatar'; 
// import { SkeletonLoader } from '../components/SkeletonLoader'; 
import { FilterPill } from '../components/FilterPill'; 
import { HomeHeader } from '../components/HomeHeader'; // <-- 新增
import { MonthlyStatsCard } from '../components/MonthlyStatsCard'; // <-- 新增


interface HomeScreenProps {
  boundPlayerData?: SearchResult;
  onShowBinding: () => void;
  onUnbind?: () => void;
  onViewAllGames?: () => void;
  onViewGameDetail?: (gameId: string) => void;
  onRefreshPlayerData?: () => Promise<SearchResult | null>;
}

export function HomeScreen({ boundPlayerData, onShowBinding, onUnbind, onViewAllGames, onViewGameDetail, onRefreshPlayerData }: HomeScreenProps) {
  const [monthlyStats, setMonthlyStats] = React.useState<MonthlyStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = React.useState(false);
  const [recentGames, setRecentGames] = React.useState<any[]>([]);
  const [allGames, setAllGames] = React.useState<any[]>([]);
  const [isLoadingGames, setIsLoadingGames] = React.useState(false);
  
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [selectedMode, setSelectedMode] = React.useState<'rm_solo' | 'rm_team' | 'qm_4v4'>('rm_solo');

  // ===== 刷新逻辑 (保持不变) =====
  const hasInitialRefreshedRef = useRef(false);

  React.useEffect(() => {
    if (!onRefreshPlayerData) return;
    if (!hasInitialRefreshedRef.current) {
      hasInitialRefreshedRef.current = true;
      console.log('🔄 [HomeScreen] 首次进入首页，尝试刷新玩家信息');
      onRefreshPlayerData().catch(err => console.error('❌ [HomeScreen] 首次刷新玩家信息失败:', err));
    }
    const currentStateRef: { value: AppStateStatus } = { value: AppState.currentState };
    const handleAppStateChange = (nextState: AppStateStatus) => {
      const prevState = currentStateRef.value;
      currentStateRef.value = nextState;
      if ((prevState === 'inactive' || prevState === 'background') && nextState === 'active') {
        console.log('🔄 [HomeScreen] 应用回到前台，自动刷新玩家信息');
        onRefreshPlayerData().catch(err => console.error('❌ [HomeScreen] 前台刷新玩家信息失败:', err));
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [onRefreshPlayerData]);

  // 🔥 获取本月表现数据 (保持不变)
  React.useEffect(() => {
    const fetchMonthlyStats = async () => {
      if (!boundPlayerData) {
        setMonthlyStats(null);
        return;
      }
      setIsLoadingStats(true);
      try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const gamesResponse = await apiService.getPlayerGames(boundPlayerData.profile_id, {
          since: monthStart.toISOString(),
          limit: 200
        });
        const stats = calculateMonthlyStats(gamesResponse.games, boundPlayerData.profile_id);
        setMonthlyStats(stats);
      } catch (error) {
        console.error('❌ 获取本月表现数据失败:', error);
        setMonthlyStats({ totalGames: 0, wins: 0, losses: 0, winRate: 0, rankChange: null, teamRankChange: null });
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchMonthlyStats();
  }, [boundPlayerData]);

  // 🎮 获取最近对战数据 (保持不变)
  React.useEffect(() => {
    const fetchRecentGames = async () => {
      if (!boundPlayerData) {
        setRecentGames([]);
        return;
      }
      setIsLoadingGames(true);
      try {
        const gamesResponse = await apiService.getPlayerGames(boundPlayerData.profile_id, { limit: 20 });
        const formattedGames = gamesResponse.games
          .filter(game => game.teams && game.teams.length > 0)
          .slice(0, 10)
          .map(game => {
            let playerData = null;
            let playerTeam = null;
            let opponentTeam = null;
            let opponentData = null;
            
            for (let teamIndex = 0; teamIndex < game.teams.length; teamIndex++) {
              const team = game.teams[teamIndex];
              if (Array.isArray(team)) {
                for (const playerWrapper of team) {
                  if (playerWrapper.player.profile_id === boundPlayerData.profile_id) {
                    playerData = playerWrapper.player;
                    playerTeam = team;
                    opponentTeam = game.teams[1 - teamIndex];
                    break;
                  }
                }
                if (playerData) break;
              }
            }
            
            if (opponentTeam && Array.isArray(opponentTeam) && opponentTeam.length > 0) {
              opponentData = opponentTeam[0].player;
            }
            
            if (!playerData || !opponentData) return null;
            
            const isWin = playerData.result === 'win';
            const eloChange = playerData.rating_diff || 0;
            const duration = game.duration ? `${Math.floor(game.duration / 60)}分钟` : '--';
            
            const gameDate = new Date(game.started_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - gameDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const timeAgo = diffDays === 1 ? '1天前' : `${diffDays}天前`;
            
            const isInvalidGame = ((game.duration && game.duration < 300) || playerData.result === null);
            
            let gameMode = 'RM 1v1';
            if (game.kind) {
              if (game.kind.includes('1v1')) gameMode = 'RM 1v1';
              else if (game.kind.includes('2v2')) gameMode = 'RM 2v2';
              else if (game.kind.includes('3v3')) gameMode = 'RM 3v3';
              else if (game.kind.includes('4v4')) gameMode = 'RM 4v4';
            } else {
              const teamSize = playerTeam ? playerTeam.length : 1;
              gameMode = teamSize === 1 ? 'RM 1v1' : `RM ${teamSize}v${teamSize}`;
            }
            
            if (isInvalidGame) gameMode += ' (Invalid)';
            
            const allPlayers = playerTeam ? playerTeam.map((p: any) => ({
                name: p.player.name,
                rating: p.player.rating || 0,
                civilization: p.player.civilization
              })) : [{ name: playerData.name, rating: playerData.rating || 0, civilization: playerData.civilization }];
            
            const allOpponents = opponentTeam ? opponentTeam.map((p: any) => ({
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
              eloChange: isInvalidGame ? 0 : (eloChange || 0),
              timeAgo,
              civilization: playerData.civilization,
              opponentCivilization: opponentData.civilization
            };
          })
          .filter(game => game !== null);
        
        setAllGames(formattedGames);
        setRecentGames(formattedGames.slice(0, 5));
      } catch (error) {
        console.error('❌ 获取最近对战数据失败:', error);
      } finally {
        setIsLoadingGames(false);
      }
    };
    fetchRecentGames();
  }, [boundPlayerData]);

  // 筛选逻辑 (保持不变)
  const filterGames = React.useCallback((filter: string) => {
    if (!allGames.length) return;
    let filteredGames = [...allGames];
    switch (filter) {
      case '1v1': filteredGames = allGames.filter(game => game.gameMode.includes('1v1')); break;
      case 'team': filteredGames = allGames.filter(game => !game.gameMode.includes('1v1')); break;
      case 'thisWeek':
        filteredGames = allGames.filter(game => {
          const daysMatch = game.timeAgo.match(/(\d+)天前/);
          return daysMatch ? parseInt(daysMatch[1]) <= 7 : true;
        });
        break;
      case 'wins': filteredGames = allGames.filter(game => game.isWin); break;
      case 'losses': filteredGames = allGames.filter(game => !game.isWin); break;
    }
    setRecentGames(filteredGames.slice(0, 5));
  }, [allGames]);

  React.useEffect(() => {
    filterGames(selectedFilter);
  }, [selectedFilter, filterGames]);

  const showSkeleton = !boundPlayerData;
  
  // 保持自动设置段位模式的逻辑 (它负责设置 selectedMode state)
  React.useEffect(() => {
    if (!boundPlayerData?.leaderboards) return;
    const lb = boundPlayerData.leaderboards;
    if (lb.rm_solo) setSelectedMode('rm_solo');
    else if (lb.rm_team) setSelectedMode('rm_team');
    else if (lb.qm_4v4) setSelectedMode('qm_4v4');
  }, [boundPlayerData]);


  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient
        colors={['#0f172a', '#581c87', '#0f172a']}
        className="flex-1"
      >
        {/* 1. 头部用户信息 (HomeHeader) */}
        <HomeHeader
          boundPlayerData={boundPlayerData}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          onUnbind={onUnbind}
          showSkeleton={showSkeleton}
        />
        
        {/* 内容区域 */}
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          {showSkeleton ? (
            /* 未绑定状态 (保留在 ScrollView 内容区) */
            <View className="bg-white/95 rounded-3xl p-8 mb-6 shadow-lg items-center">
              <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
                <FontAwesome5 name="link" size={24} color="#7c3aed" />
              </View>
              <Text className="text-gray-800 font-bold text-lg mb-2">绑定游戏账户</Text>
              <Text className="text-gray-500 text-center text-sm leading-5 mb-6">绑定你的游戏账户后{'\n'}即可查看详细的数据统计和对战记录</Text>
              <TouchableOpacity onPress={onShowBinding} className="bg-purple-500 rounded-2xl px-8 py-3">
                <Text className="text-white font-bold text-base">立即绑定</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* 2. 本月表现 (MonthlyStatsCard) */}
              <MonthlyStatsCard
                monthlyStats={monthlyStats}
                isLoadingStats={isLoadingStats}
              />

              {/* 最近对战列表 (保持不变) */}
              <View className="bg-white/95 rounded-3xl p-6 mb-6 shadow-lg">
                {/* 头部区域 */}
                <View className="mb-6">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-xl font-extrabold text-slate-800">最近对战</Text>
                    <Text className="text-slate-400 text-xs font-medium mt-0.5">
                      {selectedFilter === 'all' ? `共${allGames.length}场记录` : `筛选显示`}
                    </Text>
                  </View>
                  {onViewAllGames && (
                    <TouchableOpacity 
                      onPress={onViewAllGames}
                      className="bg-purple-50 px-4 py-2 rounded-full"
                    >
                      <Text className="text-purple-600 font-bold text-xs">查看全部</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* 2. 筛选胶囊 (Filter Pills) */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  className="mb-5" 
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                    <FilterPill label="全部" value="all" onSelect={setSelectedFilter} isSelected={selectedFilter === 'all'} />
                    <FilterPill label="胜利" value="wins" icon="trophy" color="#10b981" onSelect={setSelectedFilter} isSelected={selectedFilter === 'wins'} />
                    <FilterPill label="失败" value="losses" icon="times" color="#ef4444" onSelect={setSelectedFilter} isSelected={selectedFilter === 'losses'} />
                    <FilterPill label="1v1" value="1v1" onSelect={setSelectedFilter} isSelected={selectedFilter === '1v1'} />
                    <FilterPill label="团队" value="team" onSelect={setSelectedFilter} isSelected={selectedFilter === 'team'} />
                    <FilterPill label="本周" value="thisWeek" onSelect={setSelectedFilter} isSelected={selectedFilter === 'thisWeek'} />
                </ScrollView>

                {/* 3. 列表内容渲染 */}
                <View>
                  {isLoadingGames ? (
                    <View className="py-10 items-center">
                      <Text className="text-gray-400">加载数据中...</Text>
                    </View>
                  ) : recentGames.length > 0 ? (
                    recentGames.map((game) => (
                      <ModernGameCard 
                        key={game.gameId} 
                        game={game} 
                        onPress={() => onViewGameDetail?.(game.gameId)}
                      />
                    ))
                  ) : (
                    <View className="py-10 items-center">
                      <Text className="text-slate-400 font-medium">暂无符合条件的记录</Text>
                    </View>
                  )}
                </View>

              </View>
            </>
          )}
          <View className="h-10" />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}