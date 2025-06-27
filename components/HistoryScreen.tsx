import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GameRecord } from './GameRecord';
import { SearchResult } from '../types';
import { apiService } from '../services/apiService';
import { getChineseMapName } from '../services/mapImages';

interface HistoryScreenProps {
  boundPlayerData?: SearchResult;
}

export function HistoryScreen({ boundPlayerData }: HistoryScreenProps) {
  const [allGames, setAllGames] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState('all'); // all, 1v1, team, wins, losses


  // 获取历史游戏数据
  React.useEffect(() => {
    const fetchAllGames = async () => {
      if (!boundPlayerData) {
        setAllGames([]);
        return;
      }

      setIsLoading(true);
      try {
        // 获取更多历史游戏记录
        const gamesResponse = await apiService.getPlayerGames(boundPlayerData.profile_id, {
          limit: 100 // 获取更多历史记录
        });
        
        // 转换为UI需要的格式
        const formattedGames = gamesResponse.games
          .filter(game => game.teams && game.teams.length > 0)
          .map(game => {
            // 找到玩家所在的团队和对手团队
            let playerData = null;
            let playerTeam = null;
            let opponentTeam = null;
            
            // 遍历所有团队找到玩家
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
            
            if (!playerData || !opponentTeam) return null;
            
            const isWin = playerData.result === 'win';
            const eloChange = playerData.rating_diff || 0;
            const duration = game.duration ? `${Math.floor(game.duration / 60)}分钟` : '--';
            
            // 计算时间差
            const gameDate = new Date(game.started_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - gameDate.getTime());
            
            // 计算更精确的时间差
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
            
            // 判断是否为无效对局
            const isInvalidGame = (
              (game.duration && game.duration < 300) || 
              playerData.result === null
            );
            
            // 格式化游戏模式
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
            
                         // 构建玩家和对手数据
             const players = playerTeam ? playerTeam.map(p => ({
               name: p.player.name,
               rating: p.player.rating || 0,
               civilization: p.player.civilization
             })) : [];
             
             const opponents = opponentTeam ? opponentTeam.map(p => ({
               name: p.player.name,
               rating: p.player.rating || 0,
               civilization: p.player.civilization
             })) : [];
             
             return {
               gameId: game.game_id || Math.random().toString(),
               realGameId: game.game_id, // 保存真实的游戏ID用于API调用
               mapName: game.map || 'Unknown',
               gameMode,
               duration,
               isWin,
               players,
               opponents,
               eloChange,
               timeAgo,
               startedAt: game.started_at,
               isTeamGame: playerTeam ? playerTeam.length > 1 : false
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
  }, [boundPlayerData]);

  // 筛选游戏
  const filteredGames = React.useMemo(() => {
    return allGames.filter(game => {
      switch (selectedFilter) {
        case '1v1':
          return !game.isTeamGame;
        case 'team':
          return game.isTeamGame;
        case 'wins':
          return game.isWin;
        case 'losses':
          return !game.isWin;
        default:
          return true;
      }
    });
  }, [allGames, selectedFilter]);

  // 按日期分组游戏
  const groupedGames = React.useMemo(() => {
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
      groups[groupKey].push(game);
    });
    
    return groups;
  }, [filteredGames]);

  // 处理游戏详情查看
  const handleGamePress = (game: any) => {
    // 暂时禁用详情功能
    console.log('游戏详情功能暂时禁用:', game.realGameId);
  };

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient
        colors={['#0f172a', '#581c87', '#0f172a']}
        className="flex-1"
      >


        {/* 头部 */}
        <View className="px-6 pb-4 pt-10">
            <View>
              <Text className="text-2xl font-bold text-white">对战历史</Text>
            {boundPlayerData ? (
              <Text className="text-white/60">
                {boundPlayerData.name} 的征战历程
              </Text>
            ) : (
              <Text className="text-white/60">回顾你的征战历程</Text>
            )}
          </View>
        </View>

        {/* 筛选器 */}
        <View className="px-6 pb-4">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
          <View className="flex-row space-x-2">
              <TouchableOpacity 
                onPress={() => setSelectedFilter('all')}
                className={`rounded-2xl px-4 py-2 ${
                  selectedFilter === 'all' ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedFilter === 'all' ? 'text-white' : 'text-white/60'
                }`}>
                  全部 ({filteredGames.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedFilter('1v1')}
                className={`rounded-2xl px-4 py-2 ${
                  selectedFilter === '1v1' ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedFilter === '1v1' ? 'text-white' : 'text-white/60'
                }`}>
                  1v1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedFilter('team')}
                className={`rounded-2xl px-4 py-2 ${
                  selectedFilter === 'team' ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedFilter === 'team' ? 'text-white' : 'text-white/60'
                }`}>
                  团队
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedFilter('wins')}
                className={`rounded-2xl px-4 py-2 ${
                  selectedFilter === 'wins' ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedFilter === 'wins' ? 'text-white' : 'text-white/60'
                }`}>
                  胜利
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedFilter('losses')}
                className={`rounded-2xl px-4 py-2 ${
                  selectedFilter === 'losses' ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedFilter === 'losses' ? 'text-white' : 'text-white/60'
                }`}>
                  失败
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* 内容 */}
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          {isLoading ? (
            // 加载状态
          <View className="bg-white/95 rounded-3xl p-4 mb-3">
              <Text className="text-sm font-bold text-gray-500 mb-4">加载中...</Text>
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
            </View>
          ) : !boundPlayerData ? (
            // 未绑定状态
            <View className="bg-white/95 rounded-3xl p-6 items-center">
              <FontAwesome5 name="user-slash" size={32} color="#9ca3af" />
              <Text className="text-gray-500 text-center mt-3">请先绑定玩家账号</Text>
          </View>
          ) : Object.keys(groupedGames).length === 0 ? (
            // 空状态
            <View className="bg-white/95 rounded-3xl p-6 items-center">
              <FontAwesome5 name="search" size={32} color="#9ca3af" />
              <Text className="text-gray-500 text-center mt-3">暂无对战记录</Text>
            </View>
          ) : (
            // 游戏记录按日期分组显示
            Object.entries(groupedGames).map(([dateGroup, games]) => (
              <View key={dateGroup} className="bg-white/95 rounded-3xl p-4 mb-3">
                <Text className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">
                  {dateGroup}
                </Text>
            <View>
                  {games.map((game) => (
              <GameRecord
                      key={game.gameId}
                      gameId={game.realGameId}
                      mapName={game.mapName}
                      mapIcon="map"
                      gameMode={game.gameMode}
                      duration={game.duration}
                      isWin={game.isWin}
                      players={game.players}
                      playerIcon="crown"
                      opponents={game.opponents}
                      opponentIcon="chess-rook"
                      eloChange={game.eloChange}
                      timeAgo={game.timeAgo}
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