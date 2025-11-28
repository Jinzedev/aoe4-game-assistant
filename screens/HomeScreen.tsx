import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, AppState, AppStateStatus } from 'react-native';
import { Link, Trophy, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Context & Types
import { usePlayer } from '../context/PlayerContext';
import { RootStackParamList } from '../navigation/types';
import { calculateMonthlyStats, MonthlyStats, apiService } from '../services/apiService';

// Components
import { ModernGameCard } from '../components/home/MatchCard';
import { FilterPill } from '../components/home/FilterPill';
import { HomeHeader } from '../components/home/HomeHeader';
import { MonthlyStatsCard } from '../components/home/MonthlyStatsCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  // 从 Context 获取数据和方法
  const { boundPlayer, unbindPlayer, refreshPlayer } = usePlayer();

  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMode, setSelectedMode] = useState<'rm_solo' | 'rm_team' | 'qm_4v4'>('rm_solo');

  // ===== 刷新逻辑 =====
  const hasInitialRefreshedRef = useRef(false);

  useEffect(() => {
    if (!boundPlayer) return;

    if (!hasInitialRefreshedRef.current) {
      hasInitialRefreshedRef.current = true;
      console.log('🔄 [HomeScreen] 首次进入首页，尝试刷新玩家信息');
      refreshPlayer().catch((err) => console.error('❌ [HomeScreen] 首次刷新玩家信息失败:', err));
    }
    const currentStateRef: { value: AppStateStatus } = { value: AppState.currentState };
    const handleAppStateChange = (nextState: AppStateStatus) => {
      const prevState = currentStateRef.value;
      currentStateRef.value = nextState;
      if ((prevState === 'inactive' || prevState === 'background') && nextState === 'active') {
        console.log('🔄 [HomeScreen] 应用回到前台，自动刷新玩家信息');
        refreshPlayer().catch((err) => console.error('❌ [HomeScreen] 前台刷新玩家信息失败:', err));
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [boundPlayer, refreshPlayer]);

  // 🔥 获取本月表现数据
  useEffect(() => {
    const fetchMonthlyStats = async () => {
      if (!boundPlayer) {
        setMonthlyStats(null);
        return;
      }
      setIsLoadingStats(true);
      try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const gamesResponse = await apiService.getPlayerGames(boundPlayer.profile_id, {
          since: monthStart.toISOString(),
          limit: 200,
        });
        const stats = calculateMonthlyStats(gamesResponse.games, boundPlayer.profile_id);
        setMonthlyStats(stats);
      } catch (error) {
        console.error('❌ 获取本月表现数据失败:', error);
        setMonthlyStats({
          totalGames: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          rankChange: null,
          teamRankChange: null,
        });
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchMonthlyStats();
  }, [boundPlayer]);

  // 🎮 获取最近对战数据
  useEffect(() => {
    const fetchRecentGames = async () => {
      if (!boundPlayer) {
        setRecentGames([]);
        return;
      }
      setIsLoadingGames(true);
      try {
        const gamesResponse = await apiService.getPlayerGames(boundPlayer.profile_id, {
          limit: 20,
        });
        const formattedGames = gamesResponse.games
          .filter((game) => game.teams && game.teams.length > 0)
          .slice(0, 10)
          .map((game) => {
            let playerData = null;
            let playerTeam = null;
            let opponentTeam = null;
            let opponentData = null;

            for (let teamIndex = 0; teamIndex < game.teams.length; teamIndex++) {
              const team = game.teams[teamIndex];
              if (Array.isArray(team)) {
                for (const playerWrapper of team) {
                  if (playerWrapper.player.profile_id === boundPlayer.profile_id) {
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

            const isInvalidGame =
              (game.duration && game.duration < 300) || playerData.result === null;

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

            const allPlayers = playerTeam
              ? playerTeam.map((p: any) => ({
                name: p.player.name,
                rating: p.player.rating || 0,
                civilization: p.player.civilization,
              }))
              : [
                {
                  name: playerData.name,
                  rating: playerData.rating || 0,
                  civilization: playerData.civilization,
                },
              ];

            const allOpponents = opponentTeam
              ? opponentTeam.map((p: any) => ({
                name: p.player.name,
                rating: p.player.rating || 0,
                civilization: p.player.civilization,
              }))
              : [
                {
                  name: opponentData.name,
                  rating: opponentData.rating || 0,
                  civilization: opponentData.civilization,
                },
              ];

            return {
              gameId: game.game_id.toString(),
              mapName: game.map,
              gameMode,
              duration,
              isWin,
              players: allPlayers,
              opponents: allOpponents,
              eloChange: isInvalidGame ? 0 : eloChange || 0,
              timeAgo,
              civilization: playerData.civilization,
              opponentCivilization: opponentData.civilization,
            };
          })
          .filter((game) => game !== null);

        setAllGames(formattedGames);
        setRecentGames(formattedGames.slice(0, 5));
      } catch (error) {
        console.error('❌ 获取最近对战数据失败:', error);
      } finally {
        setIsLoadingGames(false);
      }
    };
    fetchRecentGames();
  }, [boundPlayer]);

  // 筛选逻辑
  const filterGames = useCallback(
    (filter: string) => {
      if (!allGames.length) return;
      let filteredGames = [...allGames];
      switch (filter) {
        case '1v1':
          filteredGames = allGames.filter((game) => game.gameMode.includes('1v1'));
          break;
        case 'team':
          filteredGames = allGames.filter((game) => !game.gameMode.includes('1v1'));
          break;
        case 'thisWeek':
          filteredGames = allGames.filter((game) => {
            const daysMatch = game.timeAgo.match(/(\d+)天前/);
            return daysMatch ? parseInt(daysMatch[1]) <= 7 : true;
          });
          break;
        case 'wins':
          filteredGames = allGames.filter((game) => game.isWin);
          break;
        case 'losses':
          filteredGames = allGames.filter((game) => !game.isWin);
          break;
      }
      setRecentGames(filteredGames.slice(0, 5));
    },
    [allGames]
  );

  useEffect(() => {
    filterGames(selectedFilter);
  }, [selectedFilter, filterGames]);

  // 自动设置模式
  useEffect(() => {
    if (!boundPlayer?.leaderboards) return;
    const lb = boundPlayer.leaderboards;
    if (lb.rm_solo) setSelectedMode('rm_solo');
    else if (lb.rm_team) setSelectedMode('rm_team');
    else if (lb.qm_4v4) setSelectedMode('qm_4v4');
  }, [boundPlayer]);

  const showSkeleton = !boundPlayer;

  // 跳转处理
  const handleShowBinding = () => navigation.navigate('AccountBinding');
  const handleViewAllGames = () =>
    navigation.navigate('MainTabs', { screen: 'History', params: {} });
  const handleViewGameDetail = (gameId: string) => {
    if (boundPlayer) {
      navigation.navigate('GameDetail', {
        gameId: Number(gameId),
        profileId: boundPlayer.profile_id,
      });
    }
  };

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient colors={['#0f172a', '#581c87', '#0f172a']} className="flex-1">
        <HomeHeader
          boundPlayerData={boundPlayer || undefined}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          onUnbind={unbindPlayer}
          showSkeleton={showSkeleton}
        />

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {showSkeleton ? (
            <View className="mb-6 items-center rounded-3xl bg-white/95 p-8 shadow-lg">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <Link size={24} color="#7c3aed" />
              </View>
              <Text className="mb-2 text-lg font-bold text-gray-800">绑定游戏账户</Text>
              <Text className="mb-6 text-center text-sm leading-5 text-gray-500">
                绑定你的游戏账户后{'\n'}即可查看详细的数据统计和对战记录
              </Text>
              <TouchableOpacity
                onPress={handleShowBinding}
                style={{
                  borderRadius: 16, // rounded-2xl
                  backgroundColor: '#a855f7', // bg-purple-500
                  paddingHorizontal: 32, // px-8
                  paddingVertical: 12, // py-3
                  alignItems: 'center', // 居中文本
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16, // text-base
                    fontWeight: 'bold', // font-bold
                    color: '#fff', // text-white
                    letterSpacing: 1,
                  }}>
                  立即绑定
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <MonthlyStatsCard monthlyStats={monthlyStats} isLoadingStats={isLoadingStats} />

              <View className="mb-6 rounded-3xl bg-white/95 p-6 shadow-lg">
                <View className="mb-6">
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-xl font-extrabold text-slate-800">最近对战</Text>
                    <TouchableOpacity
                      onPress={handleViewAllGames}
                      className="rounded-full bg-purple-50 px-4 py-2">
                      <Text className="text-xs font-bold text-purple-600">查看全部</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-5"
                  contentContainerStyle={{ paddingRight: 20 }}>
                  <FilterPill
                    label="全部"
                    value="all"
                    onSelect={setSelectedFilter}
                    isSelected={selectedFilter === 'all'}
                  />
                  <FilterPill
                    label="胜利"
                    value="wins"
                    Icon={Trophy}
                    color="#10b981"
                    onSelect={setSelectedFilter}
                    isSelected={selectedFilter === 'wins'}
                  />
                  <FilterPill
                    label="失败"
                    value="losses"
                    Icon={X}
                    color="#ef4444"
                    onSelect={setSelectedFilter}
                    isSelected={selectedFilter === 'losses'}
                  />
                  <FilterPill
                    label="1v1"
                    value="1v1"
                    onSelect={setSelectedFilter}
                    isSelected={selectedFilter === '1v1'}
                  />
                  <FilterPill
                    label="团队"
                    value="team"
                    onSelect={setSelectedFilter}
                    isSelected={selectedFilter === 'team'}
                  />
                  <FilterPill
                    label="本周"
                    value="thisWeek"
                    onSelect={setSelectedFilter}
                    isSelected={selectedFilter === 'thisWeek'}
                  />
                </ScrollView>

                <View>
                  {isLoadingGames ? (
                    <View className="items-center py-10">
                      <Text className="text-gray-400">加载数据中...</Text>
                    </View>
                  ) : recentGames.length > 0 ? (
                    recentGames.map((game) => (
                      <ModernGameCard
                        key={game.gameId}
                        game={game}
                        onPress={() => handleViewGameDetail(game.gameId)}
                      />
                    ))
                  ) : (
                    <View className="items-center py-10">
                      <Text className="font-medium text-slate-400">暂无符合条件的记录</Text>
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
