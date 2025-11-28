import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { User, ArrowLeft, Loader2, ChevronRight, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatTier, formatRankLevel, getCountryFlag } from '../services/apiService';
import { SearchResult } from '../types';

interface SearchResultsProps {
  searchQuery: string;
  results: SearchResult[];
  isLoading: boolean;
  onSelectPlayer: (player: SearchResult) => void;
  onBack: () => void;
}

// 安全的头像组件，带错误处理
function PlayerAvatar({ uri, size = 56 }: { uri: string; size?: number }) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !uri) {
    return (
      <View
        className="rounded-xl bg-white/10 border border-white/20 items-center justify-center"
        style={{ width: size, height: size, borderRadius: size / 4.67 }}
      >
        <User size={size / 2.3} color="#a1a1aa" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      className="rounded-xl border border-white/20"
      style={{ width: size, height: size, borderRadius: size / 4.67 }}
      onError={() => {
        console.log('头像加载失败:', uri);
        setImageError(true);
      }}
    />
  );
}

export function SearchResults({
  searchQuery,
  results,
  isLoading,
  onSelectPlayer,
  onBack
}: SearchResultsProps) {
  // 🔍 组件挂载时打印搜索结果
  React.useEffect(() => {
    console.log('=== 搜索结果页面数据 ===');
    console.log('搜索关键词:', searchQuery);
    console.log('加载状态:', isLoading);
    console.log('搜索结果数量:', results.length);
    results.forEach((result, index) => {
      console.log(`搜索结果 ${index + 1}:`, {
        profile_id: result.profile_id,
        name: result.name,
        country: result.country,
        hasAvatar: !!result.avatars?.medium,
        avatarUrl: result.avatars?.medium,
        rm_solo_data: result.leaderboards.rm_solo,
        last_game: result.last_game_at
      });
    });
  }, [searchQuery, results, isLoading]);

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient
        colors={['#0f172a', '#581c87', '#0f172a']}
        className="flex-1"
      >
        {/* 顶部标题栏 */}
        <View className="px-6 pt-10 pb-4">
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity
              onPress={onBack}
              className="w-10 h-10 bg-white/10 rounded-full items-center justify-center"
            >
              <ArrowLeft size={16} color="white" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">
                搜索结果 ({results.length})
              </Text>
              <Text className="text-white/60 text-sm">搜索 "{searchQuery}"</Text>
            </View>
          </View>
        </View>

        {/* 搜索结果列表 */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {isLoading ? (
            /* 加载状态 */
            <View className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 items-center">
              <Loader2 size={32} color="#a855f7" className="animate-spin" />
              <Text className="text-white mt-4 text-base">搜索中...</Text>
            </View>
          ) : results.length > 0 ? (
            /* 搜索结果 */
            <View className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
              <Text className="text-white font-bold text-lg mb-4">
                找到 {results.length} 个玩家
              </Text>

              {results.map((player, index) => (
                <TouchableOpacity
                  key={player.profile_id}
                  onPress={() => onSelectPlayer(player)}
                  className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${index < results.length - 1 ? 'mb-4' : ''
                    }`}
                >
                  <View className="flex-row items-center">
                    {/* 玩家头像 */}
                    <View className="relative mr-5">
                      {player.avatars?.medium ? (
                        <PlayerAvatar uri={player.avatars.medium} size={56} />
                      ) : (
                        <View className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 items-center justify-center">
                          <User size={24} color="#a1a1aa" />
                        </View>
                      )}
                      {player.country && (
                        <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-800 rounded-full items-center justify-center border border-white/20">
                          <Text className="text-xs">{getCountryFlag(player.country)}</Text>
                        </View>
                      )}
                    </View>

                    {/* 玩家信息 */}
                    <View className="flex-1">
                      <Text className="text-white font-bold text-lg mb-2">{player.name}</Text>
                      <View className="flex-row items-center mb-2">
                        {player.leaderboards.rm_solo ? (
                          <>
                            <View className="bg-purple-400/20 px-3 py-1 rounded-lg mr-3">
                              <Text className="text-purple-300 text-xs font-medium">
                                {formatRankLevel(player.leaderboards.rm_solo.rank_level)}
                              </Text>
                            </View>
                            <Text className="text-white/60 text-sm">
                              #{player.leaderboards.rm_solo.rank}
                            </Text>
                          </>
                        ) : (
                          <Text className="text-white/40 text-sm">无排位数据</Text>
                        )}
                      </View>
                      {player.leaderboards.rm_solo && (
                        <View className="flex-row items-center">
                          <Text className="text-white/40 text-sm mr-4">
                            ELO: {player.leaderboards.rm_solo.rating}
                          </Text>
                          <Text className="text-white/40 text-sm">
                            总场次: {player.leaderboards.rm_solo.games_count}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* 选择箭头 */}
                    <ChevronRight size={16} color="#a1a1aa" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            /* 无结果 */
            <View className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 items-center">
              <View className="w-16 h-16 bg-gray-500/20 rounded-full items-center justify-center mb-4">
                <Search size={24} color="#6b7280" />
              </View>
              <Text className="text-white font-bold text-lg mb-2">未找到玩家</Text>
              <Text className="text-white/60 text-center text-sm leading-5">
                没有找到名为 "{searchQuery}" 的玩家{'\n'}请检查拼写或尝试其他搜索词
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}