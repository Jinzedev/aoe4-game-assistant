import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchResult } from '../types';
import { apiService, getCountryFlag, Player, LeaderboardEntry, formatRankLevel } from '../services/apiService';
import StorageService from '../services/storageService';

interface SearchScreenProps {
  onPlayerSelect?: (player: SearchResult) => void;
  onViewPlayerHistory?: (player: SearchResult) => void;
}

export function SearchScreen({ onPlayerSelect, onViewPlayerHistory }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = React.useState<SearchResult[]>([]);
  const [hotPlayers, setHotPlayers] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  // 加载搜索历史
  React.useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const history = await StorageService.getSearchHistory();
        setSearchHistory(history);
      } catch (error) {
        console.error('❌ 加载搜索历史失败:', error);
      }
    };
    loadSearchHistory();
  }, []);

  // 加载热门玩家（使用排行榜API）
  React.useEffect(() => {
    const loadHotPlayers = async () => {
      try {
        // 获取1v1排行榜前10名
        const leaderboardData = await apiService.getLeaderboard({
          leaderboard: 'rm_solo',
          page: 1,
          count: 10
        });
        
        if (leaderboardData.players && leaderboardData.players.length > 0) {
          // 排行榜API返回的players已经包含完整信息，直接转换为SearchResult格式
          const searchResults: SearchResult[] = leaderboardData.players.map((player: any) => ({
            profile_id: player.profile_id,
            name: player.name,
            country: player.country,
            avatars: player.avatars,
            leaderboards: {
              rm_solo: {
                rating: player.rating,
                rank: player.rank,
                rank_level: player.rank_level,
                streak: player.streak,
                games_count: player.games_count,
                wins_count: player.wins_count,
                losses_count: player.losses_count,
                disputes_count: player.disputes_count,
                drops_count: player.drops_count,
                last_game_at: player.last_game_at,
                win_rate: player.win_rate,
                season: player.season
              }
            },
            last_game_at: player.last_game_at
          }));
          
          setHotPlayers(searchResults);
        }
      } catch (error) {
        console.error('❌ 加载热门玩家失败:', error);
      }
    };
    loadHotPlayers();
  }, []);

  // 搜索玩家
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await apiService.searchPlayers({ query: searchQuery.trim() });
      // 将Player转换为SearchResult
      const searchResults: SearchResult[] = results.players.map(player => ({
        profile_id: player.profile_id,
        name: player.name,
        country: player.country,
        avatars: player.avatars,
        leaderboards: player.leaderboards,
        last_game_at: player.last_game_at
      }));
      setSearchResults(searchResults);
    } catch (error) {
      console.error('❌ 搜索玩家失败:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 选择玩家
  const handlePlayerSelect = async (player: SearchResult) => {
    // 保存到搜索历史
    try {
      await StorageService.addToSearchHistory(player);
      // 更新本地搜索历史状态
      setSearchHistory(prev => {
        const filtered = prev.filter(p => p.profile_id !== player.profile_id);
        return [player, ...filtered].slice(0, 10); // 最多保存10个
      });
    } catch (error) {
      console.error('❌ 保存搜索历史失败:', error);
    }
    
    // 导航到历史记录页面查看该玩家的对局
    onViewPlayerHistory?.(player);
    
    // 回调给父组件
    onPlayerSelect?.(player);
  };

  // 清除搜索历史
  const clearSearchHistory = async () => {
    try {
      await StorageService.clearSearchHistory();
      setSearchHistory([]);
    } catch (error) {
      console.error('❌ 清除搜索历史失败:', error);
    }
  };

  // 格式化最后游戏时间
  const formatLastGameTime = (lastGameAt?: string): string => {
    if (!lastGameAt) return '未知';
    
    const now = new Date();
    const gameTime = new Date(lastGameAt);
    const diffInHours = Math.floor((now.getTime() - gameTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '刚刚在线';
    if (diffInHours < 24) return `${diffInHours}小时前在线`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}天前在线`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}周前在线`;
    
    return `${Math.floor(diffInDays / 30)}月前在线`;
  };

  // 玩家卡片组件
  const PlayerCard = ({ player }: { player: SearchResult }) => {
    const rmSoloData = player.leaderboards?.rm_solo;
    
    return (
      <TouchableOpacity
        onPress={() => handlePlayerSelect(player)}
        className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      >
        <View className="flex-row items-center">
          {/* 头像 */}
          <View className="w-14 h-14 rounded-xl mr-3 overflow-hidden bg-gray-200 relative">
            {player.avatars?.medium ? (
              <Image 
                source={{ uri: player.avatars.medium }} 
                className="w-full h-full"
                style={{ resizeMode: 'cover' }}
              />
            ) : (
              <View className="w-full h-full items-center justify-center bg-purple-100">
                <FontAwesome5 name="user" size={18} color="#7c3aed" />
              </View>
            )}
            
            {/* 国旗徽章 */}
            {player.country && (
              <View 
                className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full items-center justify-center"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.3,
                  shadowRadius: 2,
                  elevation: 3,
                }}
              >
                <Text className="text-sm" style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 1 }}>
                  {getCountryFlag(player.country)}
                </Text>
              </View>
            )}
          </View>
          
          {/* 玩家信息 */}
          <View className="flex-1">
            {/* 第一行：姓名 */}
            <View className="flex-row items-center mb-1">
              <Text className="font-bold text-gray-800 text-base" numberOfLines={1}>
                {player.name}
              </Text>
            </View>
            
            {/* 第二行：ID和ELO */}
            {rmSoloData && (
              <View className="flex-row items-center mb-1">
                <Text className="text-purple-600 font-semibold text-sm mr-2">
                  #{player.profile_id}
                </Text>
                <Text className="text-gray-600 text-sm font-medium mr-2">
                  {rmSoloData.rating || '--'} ELO
                </Text>
                {rmSoloData.rank_level && (
                  <View className="bg-purple-100 px-2 py-0.5 rounded-md">
                    <Text className="text-purple-700 text-xs font-medium">
                      {formatRankLevel(rmSoloData.rank_level)}
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            {/* 第三行：排名、胜率和场数 */}
            {rmSoloData && (
              <View className="flex-row items-center mb-1">
                {rmSoloData.rank && (
                  <View className="bg-yellow-100 px-2 py-0.5 rounded-md mr-2">
                    <Text className="text-yellow-700 text-xs font-medium">
                      排名 #{rmSoloData.rank.toLocaleString()}
                    </Text>
                  </View>
                )}
                <View className="bg-green-100 px-2 py-0.5 rounded-md mr-2">
                  <Text className="text-green-700 text-xs font-medium">
                    {rmSoloData.win_rate ? `${rmSoloData.win_rate.toFixed(1)}%` : '--'}
                  </Text>
                </View>
                <Text className="text-gray-500 text-xs">
                  {rmSoloData.games_count || 0}场比赛
                </Text>
              </View>
            )}
            
            {/* 第四行：最后上线时间 */}
            <View className="flex-row items-center">
              <FontAwesome5 name="clock" size={10} color="#9ca3af" />
              <Text className="text-gray-400 text-xs ml-1">
                {formatLastGameTime(rmSoloData?.last_game_at || player.last_game_at)}
              </Text>
            </View>
          </View>
          
          <FontAwesome5 name="chevron-right" size={12} color="#9ca3af" style={{ marginLeft: 8 }} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient
        colors={['#0f172a', '#581c87', '#0f172a']}
        className="flex-1"
      >
        {/* 头部 */}
        <View className="px-6 pb-4 pt-10">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-white">搜索玩家</Text>
              <Text className="text-white/60">发现和分析其他玩家</Text>
            </View>
            <View className="bg-white/10 rounded-2xl p-3">
              <FontAwesome5 name="search" size={18} color="white" />
            </View>
          </View>
        </View>

        {/* 搜索框 */}
        <View className="px-6 pb-4">
          <View className="bg-white/10 rounded-2xl p-4 flex-row items-center">
            <FontAwesome5 name="search" size={16} color="white" />
            <TextInput
              className="flex-1 ml-3 text-white text-base"
              placeholder="输入玩家名称..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome5 name="times" size={14} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            )}
          </View>
          
          {searchQuery.trim().length > 0 && (
            <TouchableOpacity
              onPress={handleSearch}
              className="bg-purple-600 rounded-2xl py-3 mt-2"
            >
              <Text className="text-white font-medium text-center">
                {isLoading ? '搜索中...' : '搜索'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 内容 */}
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          
          {/* 搜索结果 */}
          {hasSearched && (
            <View className="bg-white/95 rounded-3xl p-6 mb-4">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                搜索结果 {searchResults.length > 0 && `(${searchResults.length})`}
              </Text>
              
              {isLoading ? (
                // 加载状态
                <View className="space-y-3">
                  {[1, 2, 3].map((index) => (
                    <View key={index} className="animate-pulse">
                      <View className="bg-gray-100 rounded-2xl p-4 flex-row items-center">
                        <View className="w-12 h-12 bg-gray-200 rounded-xl mr-3" />
                        <View className="flex-1">
                          <View className="w-24 h-4 bg-gray-200 rounded mb-2" />
                          <View className="w-32 h-3 bg-gray-200 rounded" />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : searchResults.length > 0 ? (
                // 搜索结果列表
                <View>
                  {searchResults.map((player) => (
                    <PlayerCard 
                      key={player.profile_id} 
                      player={player} 
                    />
                  ))}
                </View>
              ) : (
                // 无搜索结果
                <View className="py-8 items-center">
                  <FontAwesome5 name="search" size={32} color="#9ca3af" />
                  <Text className="text-gray-500 text-center mt-3">
                    未找到玩家 "{searchQuery}"
                  </Text>
                  <Text className="text-gray-400 text-center text-sm mt-2">
                    请检查玩家名称是否正确
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* 搜索历史 */}
          {!hasSearched && searchHistory.length > 0 && (
            <View className="bg-white/95 rounded-3xl p-6 mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-800">最近搜索</Text>
                <TouchableOpacity onPress={clearSearchHistory}>
                  <Text className="text-gray-500 text-sm">清除</Text>
                </TouchableOpacity>
              </View>
              
              <View>
                {searchHistory.map((player) => (
                  <PlayerCard 
                    key={player.profile_id} 
                    player={player} 
                  />
                ))}
              </View>
            </View>
          )}

          {/* 热门玩家 */}
          {!hasSearched && hotPlayers.length > 0 && (
            <View className="bg-white/95 rounded-3xl p-6 mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                热门玩家 🏆
              </Text>
              <Text className="text-gray-500 text-sm mb-4">
                目前1v1排位赛排名
              </Text>
              
              <View>
                {hotPlayers.map((player, index) => (
                  <PlayerCard 
                    key={player.profile_id} 
                    player={player} 
                  />
                ))}
              </View>
            </View>
          )}

          {/* 空状态 */}
          {!hasSearched && searchHistory.length === 0 && hotPlayers.length === 0 && (
            <View className="bg-white/95 rounded-3xl p-6 items-center">
              <FontAwesome5 name="search" size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-center mt-4 text-lg font-medium">
                开始搜索玩家
              </Text>
              <Text className="text-gray-400 text-center text-sm mt-2">
                输入玩家名称来查找和分析其他玩家的数据
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
} 