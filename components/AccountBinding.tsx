import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../services/apiService';
import { SearchResults } from './SearchResults';
import { SearchResult } from '../types';

interface AccountBindingProps {
  onBind: (playerData: SearchResult) => void;
  onBack: () => void;
}

export function AccountBinding({ onBind, onBack }: AccountBindingProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!playerName.trim()) {
      Alert.alert('提示', '请输入玩家名称');
      return;
    }


    setIsSearching(true);
    try {
      // 调用真实API搜索玩家
      const response = await apiService.searchPlayers({ 
        query: playerName.trim(),
        page: 1
      });
      
      // 🔍 调试输出 - 打印API原始响应
      console.log('=== API搜索响应 ===');
      console.log('搜索关键词:', playerName.trim());
      console.log('响应总数:', response.count || response.players?.length || 0);
      console.log('原始响应:', JSON.stringify(response, null, 2));
      
      // 🔍 详细打印每个玩家的数据结构
      if (response.players && response.players.length > 0) {
        response.players.forEach((player, index) => {
          console.log(`--- 玩家 ${index + 1} ---`);
          console.log('基本信息:', {
            profile_id: player.profile_id,
            name: player.name,
            country: player.country
          });
          console.log('头像信息:', player.avatars);
          console.log('模式数据:', player.leaderboards);
          console.log('最后对战:', player.last_game_at);
          console.log('完整数据:', JSON.stringify(player, null, 2));
        });
      }
      
      // 转换API响应为我们的SearchResult格式
      const results: SearchResult[] = response.players.map(player => ({
        profile_id: player.profile_id,
        name: player.name,
        country: player.country,
        avatars: player.avatars,
        leaderboards: {
          rm_solo: player.leaderboards?.rm_solo ? {
            rating: player.leaderboards.rm_solo.rating,
            rank: player.leaderboards.rm_solo.rank,
            rank_level: player.leaderboards.rm_solo.rank_level,
            streak: player.leaderboards.rm_solo.streak || 0,
            games_count: player.leaderboards.rm_solo.games_count,
            wins_count: player.leaderboards.rm_solo.wins_count || 0,
            losses_count: player.leaderboards.rm_solo.losses_count || 0,
            disputes_count: player.leaderboards.rm_solo.disputes_count || 0,
            drops_count: player.leaderboards.rm_solo.drops_count || 0,
            last_game_at: player.leaderboards.rm_solo.last_game_at,
            win_rate: player.leaderboards.rm_solo.win_rate || 0,
            season: player.leaderboards.rm_solo.season
          } : undefined
        },
        last_game_at: player.last_game_at
      }));
      
      // 🔍 打印转换后的结果
      console.log('=== 转换后的结果 ===');
      console.log('结果数量:', results.length);
      results.forEach((result, index) => {
        console.log(`转换结果 ${index + 1}:`, JSON.stringify(result, null, 2));
      });
      
      setSearchResults(results);
      setShowResults(true);
      
      // 如果没有找到结果，显示提示
      if (results.length === 0) {
        Alert.alert('提示', `没有找到名为 "${playerName.trim()}" 的玩家，请检查拼写后重试。`);
      }
    } catch (error) {
      console.error('搜索玩家失败:', error);
      
      // 如果API调用失败，显示友好的错误信息
      let errorMessage = '搜索失败，请重试';
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage = '网络连接失败，请检查网络后重试';
        } else if (error.message.includes('timeout')) {
          errorMessage = '请求超时，请重试';
        } else if (error.message.includes('404')) {
          errorMessage = '服务暂时不可用，请稍后重试';
        }
      }
      
      Alert.alert('错误', errorMessage);
      
      // 如果API失败，可以选择显示模拟数据作为后备
      // setSearchResults(mockResults);
      // setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlayer = (player: SearchResult) => {
    onBind(player);
  };

  const handleBackFromResults = () => {
    setShowResults(false);
    setSearchResults([]);
  };

  // 如果显示搜索结果
  if (showResults) {
    return (
      <SearchResults
        searchQuery={playerName}
        results={searchResults}
        isLoading={false}
        onSelectPlayer={handleSelectPlayer}
        onBack={handleBackFromResults}
      />
    );
  }

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient
        colors={['#0f172a', '#581c87', '#0f172a']}
        className="flex-1"
      >
        {/* 顶部返回按钮 */}
        <View className="px-6 pt-10 pb-4">
          <TouchableOpacity 
            onPress={onBack}
            className="w-10 h-10 bg-white/10 rounded-full items-center justify-center"
          >
            <FontAwesome5 name="arrow-left" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center px-6">
          <View className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* 图标 */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-purple-500/20 rounded-full items-center justify-center mb-4">
                <FontAwesome5 name="user-plus" size={32} color="#a855f7" />
              </View>
              <Text className="text-2xl font-bold text-white mb-2">绑定账户</Text>
              <Text className="text-white/60 text-center leading-6">
                请输入你的游戏名称来绑定账户{'\n'}绑定后即可查看详细数据
              </Text>
            </View>

            {/* 输入框 */}
            <View className="mb-6">
              <Text className="text-white/80 text-sm mb-3 font-medium">玩家名称</Text>
              <View className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex-row items-center">
                <FontAwesome5 name="search" size={16} color="#a855f7" />
                <TextInput
                  value={playerName}
                  onChangeText={setPlayerName}
                  placeholder="输入你的游戏名称..."
                  placeholderTextColor="#a1a1aa"
                  className="flex-1 ml-3 text-white text-base"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* 搜索按钮 */}
            <TouchableOpacity
              onPress={handleSearch}
              disabled={isSearching}
              className={`bg-purple-500 rounded-2xl py-4 items-center ${isSearching ? 'opacity-70' : ''}`}
            >
              <View className="flex-row items-center">
                {isSearching && (
                  <View className="mr-2">
                    <FontAwesome5 name="spinner" size={16} color="white" />
                  </View>
                )}
                <Text className="text-white font-bold text-base">
                  {isSearching ? '搜索中...' : '搜索玩家'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* 提示信息 */}
            <View className="mt-6 bg-blue-500/10 border border-blue-400/20 rounded-2xl p-4">
              <View className="flex-row items-start">
                <FontAwesome5 name="info-circle" size={16} color="#60a5fa" />
                <View className="ml-3 flex-1">
                  <Text className="text-blue-300 text-sm leading-5">
                    请确保输入的是你在帝国时代4中的准确游戏名称，
                    系统将从AoE4World获取你的游戏数据。
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
} 