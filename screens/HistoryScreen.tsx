import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Trophy, X, UserX, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Context & Types
import { usePlayer } from '../context/PlayerContext';
import { RootStackParamList, MainTabParamList } from '../navigation/types';
import { apiService } from '../services/apiService';

// Components
import { ModernGameCard } from '../components/home/MatchCard';
import { FilterPill } from '../components/home/FilterPill';

type HistoryRouteProp = RouteProp<MainTabParamList, 'History'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HistoryRouteProp>();
  const { boundPlayer } = usePlayer();

  // 优先使用路由参数传来的 player (查看他人)，否则使用绑定的 player (查看自己)
  const targetPlayer = route.params?.targetPlayer || boundPlayer;

  const [allGames, setAllGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // 获取历史游戏数据
  useEffect(() => {
    const fetchAllGames = async () => {
      if (!targetPlayer) {
        setAllGames([]);
        return;
      }

      setIsLoading(true);
      try {
        // 获取更多历史游戏记录
        const gamesResponse = await apiService.getPlayerGames(targetPlayer.profile_id, {
          limit: 100
        });

        const formattedGames = gamesResponse.games
          .filter(game => game.teams && game.teams.length > 0)
          .map(game => {
            let playerData = null;
            let playerTeam = null;
            let opponentTeam = null;

            for (let teamIndex = 0; teamIndex < game.teams.length; teamIndex++) {
              const team = game.teams[teamIndex];
              if (Array.isArray(team)) {
                for (const playerWrapper of team) {
                  if (playerWrapper.player.profile_id === targetPlayer.profile_id) {
                    playerData = playerWrapper.player;
                    playerTeam = team;
                    opponentTeam = game.teams[1 - teamIndex];
                    break;
                  }
                }
                if (playerData) break;
              }
            }

            if (!playerData || !opponentTeam) return null;

            const isWin = playerData.result === 'win';
            const eloChange = playerData.rating_diff || 0;
            const duration = game.duration ? `${Math.floor(game.duration / 60)}分钟` : '--';

            // 计算时间差
            const gameDate = new Date(game.started_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - gameDate.getTime());

            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            let timeAgo = '';
            if (diffMinutes < 1) {
              timeAgo = '刚刚';
            } else if (diffMinutes < 60) {
              timeAgo = `${diffMinutes}分钟前`;
            } else if (diffHours < 24) {
              timeAgo = `${diffHours}小时前`;
            } else if (diffDays === 1) {
              timeAgo = '1天前';
            } else if (diffDays < 7) {
              timeAgo = `${diffDays}天前`;
            } else {
              const diffWeeks = Math.floor(diffDays / 7);
              if (diffWeeks < 4) {
                timeAgo = `${diffWeeks}周前`;
              } else {
                const diffMonths = Math.floor(diffDays / 30);
                timeAgo = `${diffMonths}个月前`;
              }
            }

            const isInvalidGame = ((game.duration && game.duration < 300) || playerData.result === null);

            let gameMode = 'RM 1v1';
            if (game.kind) {
              if (game.kind.includes('1v1')) gameMode = 'RM 1v1';
              else if (game.kind.includes('2v2')) gameMode = 'RM 2v2';
              else if (game.kind.includes('3v3')) gameMode = 'RM 3v3';
              else if (game.kind.includes('4v4')) gameMode = 'RM 4v4';
            } else {
              const teamSize = playerTeam ? playerTeam.length : 1;
              if (teamSize === 1) gameMode = 'RM 1v1';
              else if (teamSize === 2) gameMode = 'RM 2v2';
              else if (teamSize === 3) gameMode = 'RM 3v3';
              else if (teamSize === 4) gameMode = 'RM 4v4';
            }

            if (isInvalidGame) {
              gameMode += ' (Invalid)';
            }

            const players = playerTeam ? playerTeam.map((p: any) => ({
              name: p.player.name,
              rating: p.player.rating || 0,
              civilization: p.player.civilization
            })) : [];

            const opponents = opponentTeam ? opponentTeam.map((p: any) => ({
              name: p.player.name,
              rating: p.player.rating || 0,
              civilization: p.player.civilization
            })) : [];

            return {
              gameId: game.game_id || Math.random().toString(),
              realGameId: game.game_id,
              mapName: game.map || 'Unknown',
              gameMode,
              duration,
              isWin,
              players,
              opponents,
              eloChange,
              timeAgo,
              startedAt: game.started_at,
              isTeamGame: playerTeam ? playerTeam.length > 1 : false,
              civilization: playerData.civilization,
              opponentCivilization: opponents[0]?.civilization,
            };
          })
          .filter(game => game !== null);

        setAllGames(formattedGames);
      } catch (error) {
        console.error('❌ 获取历史游戏数据失败:', error);
        setAllGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllGames();
  }, [targetPlayer]);

  // 筛选游戏
  const filteredGames = useMemo(() => {
    return allGames.filter(game => {
      switch (selectedFilter) {
        case '1v1': return !game.isTeamGame;
        case 'team': return game.isTeamGame;
        case 'wins': return game.isWin;
        case 'losses': return !game.isWin;
        default: return true;
      }
    });
  }, [allGames, selectedFilter]);

  // 分组游戏
  const groupedGames = useMemo(() => {
    const groups: { [key: string]: any[] } = {};

    filteredGames.forEach(game => {
      const gameDate = new Date(game.startedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey = '';
      if (gameDate.toDateString() === today.toDateString()) {
        groupKey = '今天';
      } else if (gameDate.toDateString() === yesterday.toDateString()) {
        groupKey = '昨天';
      } else {
        groupKey = gameDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push({ ...game, realGameId: Number(game.realGameId) });
    });

    return groups;
  }, [filteredGames]);

  // 跳转详情
  const handleGamePress = (game: any) => {
    if (targetPlayer?.profile_id && game.realGameId) {
      navigation.navigate('GameDetail', {
        gameId: game.realGameId,
        profileId: targetPlayer.profile_id
      });
    }
  };

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient colors={['#0f172a', '#581c87', '#0f172a']} className="flex-1">
        <View className="px-6 pb-4 pt-10">
          <View>
            <Text className="text-2xl font-bold text-white">对战历史</Text>
            {targetPlayer ? (
              <Text className="text-white/60">
                {targetPlayer.name} 的征战历程
              </Text>
            ) : (
              <Text className="text-white/60">回顾你的征战历程</Text>
            )}
          </View>
        </View>

        <View className="px-6 pb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
            <View className="flex-row space-x-2">
              <FilterPill label={`全部 (${filteredGames.length})`} value="all" onSelect={setSelectedFilter} isSelected={selectedFilter === 'all'} />
              <FilterPill label="1v1" value="1v1" onSelect={setSelectedFilter} isSelected={selectedFilter === '1v1'} />
              <FilterPill label="团队" value="team" onSelect={setSelectedFilter} isSelected={selectedFilter === 'team'} />
              <FilterPill label="胜利" value="wins" Icon={Trophy} color="#10b981" onSelect={setSelectedFilter} isSelected={selectedFilter === 'wins'} />
              <FilterPill label="失败" value="losses" Icon={X} color="#ef4444" onSelect={setSelectedFilter} isSelected={selectedFilter === 'losses'} />
            </View>
          </ScrollView>
        </View>

        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View className="bg-white/95 rounded-3xl p-4 mb-3">
              <Text className="text-sm font-bold text-gray-500 mb-4">加载中...</Text>
              {[1, 2, 3].map((index) => (
                <View key={index} className="flex-row items-center py-3 border-b border-gray-100">
                  <View className="w-10 h-10 bg-gray-200 rounded-lg mr-3" />
                  <View className="flex-1">
                    <View className="w-24 h-4 bg-gray-200 rounded mb-2" />
                    <View className="w-16 h-3 bg-gray-200 rounded" />
                  </View>
                </View>
              ))}
            </View>
          ) : !targetPlayer ? (
            <View className="bg-white/95 rounded-3xl p-6 items-center">
              <UserX size={32} color="#9ca3af" />
              <Text className="text-gray-500 text-center mt-3">请先绑定玩家账号</Text>
            </View>
          ) : Object.keys(groupedGames).length === 0 ? (
            <View className="bg-white/95 rounded-3xl p-6 items-center">
              <Search size={32} color="#9ca3af" />
              <Text className="text-gray-500 text-center mt-3">暂无对战记录</Text>
            </View>
          ) : (
            Object.entries(groupedGames).map(([dateGroup, games]) => (
              <View key={dateGroup} className="bg-white/95 rounded-3xl p-4 mb-3">
                <Text className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
                  {dateGroup}
                </Text>
                <View>
                  {games.map((game) => (
                    <ModernGameCard
                      key={game.gameId}
                      game={game}
                      onPress={() => handleGamePress(game)}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}