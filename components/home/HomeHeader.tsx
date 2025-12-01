import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LogOut, User } from 'lucide-react-native';
import { SearchResult } from '../../types';
// 导入所有需要的工具函数
import { formatRankLevel, getRankIcon, getCountryFlag, default as apiService } from '../../services/apiService';
// 假设 PlayerAvatar 和 SkeletonLoader 位于 components 目录下
import { PlayerAvatar } from '../PlayerAvatar';
import { SkeletonLoader } from '../SkeletonLoader';

type LeaderboardMode = 'rm_solo' | 'rm_team' | 'qm_4v4';

interface HomeHeaderProps {
  boundPlayerData?: SearchResult;
  selectedMode: LeaderboardMode;
  setSelectedMode: (mode: LeaderboardMode) => void;
  onUnbind?: () => void;
  showSkeleton: boolean;
  // onShowBinding 不再需要，因为我们在 HomeHeader 中只处理绑定后的状态和骨架屏
}

// 辅助函数：根据当前模式获取段位信息（从 HomeScreen 逻辑中抽取）
const getCurrentModeEntry = (data: SearchResult | undefined, mode: LeaderboardMode) => {
  if (!data?.leaderboards) return undefined;
  return data.leaderboards[mode];
};


export function HomeHeader({ boundPlayerData, selectedMode, setSelectedMode, onUnbind, showSkeleton }: HomeHeaderProps) {
  const [averageApm, setAverageApm] = useState<number | null>(null);

  useEffect(() => {
    const fetchApm = async () => {
      if (boundPlayerData?.profile_id) {
        setAverageApm(null); // Reset on change
        const apm = await apiService.getAverageApm(boundPlayerData.profile_id);
        setAverageApm(apm);
      }
    };
    fetchApm();
  }, [boundPlayerData?.profile_id]);

  if (showSkeleton) {
    // 渲染骨架屏，注意：未绑定账户的提示卡片仍然留在 HomeScreen 的 ScrollView 中
    return (
      <View className="px-6 pb-6 pt-10">
        <View className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          <SkeletonLoader />
        </View>
      </View>
    );
  }

  // 确保数据存在
  if (!boundPlayerData) return null;

  const currentModeEntry = getCurrentModeEntry(boundPlayerData, selectedMode);

  return (
    <View className="px-6 pb-6 pt-10">
      <View className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
        {onUnbind && (
          <TouchableOpacity
            onPress={onUnbind}
            style={{ position: 'absolute', top: 12, right: 12, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            activeOpacity={0.6}
          >
            <LogOut size={16} color="#a1a1aa" />
          </TouchableOpacity>
        )}

        <View className="flex-row items-center mb-6">
          <View className="relative mr-6">
            {boundPlayerData.avatars?.medium ? (
              <PlayerAvatar uri={boundPlayerData.avatars.medium} size={64} />
            ) : (
              <View className="w-16 h-16 bg-gray-400 rounded-2xl border-2 border-white/20 flex items-center justify-center">
                <User size={32} color="#ffffff" />
              </View>
            )}
            {boundPlayerData.country && (
              <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border border-white/20">
                <Text className="text-xs">{getCountryFlag(boundPlayerData.country)}</Text>
              </View>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-white mb-3">{boundPlayerData.name}</Text>
            <View className="mb-2">
              <View className="flex-row items-center mb-2">
                <View className="bg-purple-400 px-3 py-1 rounded-full mr-3">
                  <Text className="text-xs font-semibold text-white">
                    {currentModeEntry ? `${getRankIcon(currentModeEntry!.rank_level)} ${formatRankLevel(currentModeEntry!.rank_level)}` : '❓ 未知段位'}
                  </Text>
                </View>
                <Text className="text-white/60 text-sm">#{currentModeEntry?.rank || '---'}</Text>
              </View>
              <View className="flex-row bg-white/5 rounded-full px-1 py-1 self-start">
                {['rm_solo', 'rm_team', 'qm_4v4'].map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setSelectedMode(mode as LeaderboardMode)}
                    className={`px-3 py-1 rounded-full mr-1 ${selectedMode === mode ? 'bg-white/80' : 'bg-transparent'}`}
                  >
                    <Text className={`text-[11px] font-medium ${selectedMode === mode ? 'text-purple-700' : 'text-white/60'}`}>
                      {mode === 'rm_solo' ? '1v1 排位' : mode === 'rm_team' ? '组队排位' : '4v4 快速'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid - 2x2 Layout */}
        <View>
          <View className="flex-row mb-2">
            <View className="bg-white/10 rounded-2xl p-4 flex-1 mr-1">
              <Text className="text-2xl font-bold text-white mb-1 text-center">
                {currentModeEntry?.win_rate !== undefined
                  ? `${currentModeEntry.win_rate.toFixed(1)}%`
                  : '--'}
              </Text>
              <Text className="text-white/60 text-xs text-center">总胜率</Text>
              <View className="w-full bg-white/20 rounded-full h-1 mt-2">
                <View
                  className="bg-emerald-500 h-1 rounded-full"
                  style={{ width: currentModeEntry?.win_rate !== undefined ? `${currentModeEntry.win_rate}%` : '0%' }}
                />
              </View>
            </View>
            <View className="bg-white/10 rounded-2xl p-4 flex-1 ml-1">
              <Text className="text-2xl font-bold text-white mb-1 text-center">{currentModeEntry?.games_count || '--'}</Text>
              <Text className="text-white/60 text-xs text-center">总场次</Text>
            </View>
          </View>
          <View className="flex-row">
            <View className="bg-white/10 rounded-2xl p-4 flex-1 mr-1">
              <Text className="text-2xl font-bold text-white mb-1 text-center">{currentModeEntry?.rating || '--'}</Text>
              <Text className="text-white/60 text-xs text-center">ELO分数</Text>
            </View>
            <View className="bg-white/10 rounded-2xl p-4 flex-1 ml-1">
              <Text className="text-2xl font-bold text-white mb-1 text-center">{averageApm || '--'}</Text>
              <Text className="text-white/60 text-xs text-center">平均APM</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}