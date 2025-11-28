import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Flag, Info } from 'lucide-react-native';
import { SafeImage } from './SafeImage';
import { getCivilizationInfo } from '../../services/civilizationImages';
import { SearchResult } from '../../types';
import { Game } from '../../services/apiService';
import { PERSONAL_MODE_OPTIONS, PersonalMode } from '../../constants/statsConstants';

interface PersonalStatsCardProps {
  player: SearchResult;
  games: Game[];
  civStats: Map<string, { wins: number, total: number, winRate: number }>;
  loading: boolean;
  mode: PersonalMode;
  onModeChange: (mode: PersonalMode) => void;
}

export function PersonalStatsCard({ player, games, civStats, loading, mode, onModeChange }: PersonalStatsCardProps) {
  const currentModeLabel = PERSONAL_MODE_OPTIONS.find(opt => opt.key === mode)?.label || '1v1';

  return (
    <View className="bg-white/95 rounded-3xl p-6 mb-4">
      {/* 头部信息 */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-lg font-bold text-gray-800">我的文明使用情况</Text>
          <Text className="text-gray-500 text-sm">
            {player.name} · {currentModeLabel}模式
          </Text>
        </View>
        <View className="bg-purple-100 rounded-full px-3 py-1">
          <Text className="text-purple-700 font-medium text-sm">
            {games.length}场比赛
          </Text>
        </View>
      </View>

      {/* 模式切换 */}
      <View className="flex-row bg-white/70 rounded-2xl p-1 mb-4">
        {PERSONAL_MODE_OPTIONS.map(option => {
          const isActive = option.key === mode;
          return (
            <TouchableOpacity
              key={option.key}
              activeOpacity={0.85}
              onPress={() => onModeChange(option.key)}
              className="flex-1 rounded-2xl px-3 py-2"
              style={{
                backgroundColor: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                borderWidth: isActive ? 1 : 0,
                borderColor: isActive ? 'rgba(99,102,241,0.35)' : 'transparent'
              }}
            >
              <Text
                className="text-center font-semibold"
                style={{ color: isActive ? '#7c3aed' : '#6b7280' }}
              >
                {option.label}
              </Text>
              <Text
                className="text-center text-xs mt-1"
                style={{ color: isActive ? '#a855f7' : '#9ca3af' }}
              >
                {option.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 列表内容 */}
      {loading ? (
        <View className="py-8 items-center justify-center">
          <ActivityIndicator size="small" color="#7c3aed" />
          <Text className="text-gray-500 text-sm mt-3">正在加载{currentModeLabel}数据...</Text>
        </View>
      ) : civStats.size > 0 ? (
        <View className="space-y-3">
          {Array.from(civStats.entries())
            .sort(([, a], [, b]) => b.total - a.total)
            .slice(0, 6)
            .map(([civilization, stats], index) => {
              const civInfo = getCivilizationInfo(civilization);
              // 个人统计也使用类似的金/银/铜配色，但简单处理
              const rankColors = ['#f59e0b', '#3b82f6', '#cd7f32', '#8b5cf6', '#06b6d4', '#10b981'];
              const rankColor = rankColors[index] || '#6b7280';

              return (
                <View key={civilization} className="bg-gray-50 rounded-2xl p-4">
                  <View className="flex-row items-center">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: rankColor }}
                    >
                      <Text className="text-white font-bold text-sm">{index + 1}</Text>
                    </View>

                    <SafeImage
                      source={{ uri: civInfo.imageUrl }}
                      className="w-10 h-10 rounded-xl mr-3"
                      resizeMode="cover"
                      fallback={<View className="w-10 h-10 rounded-xl mr-3 bg-gray-200 items-center justify-center"><Flag size={16} color="#6b7280" /></View>}
                    />

                    <View className="flex-1">
                      <Text className="font-bold text-gray-800">{civInfo.name}</Text>
                      <Text className="text-gray-600 text-sm">
                        {stats.total}场 • {stats.wins}胜{stats.total - stats.wins}负
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-xl font-bold" style={{ color: rankColor }}>
                        {stats.winRate.toFixed(1)}%
                      </Text>
                      <Text className="text-gray-500 text-xs">胜率</Text>
                    </View>
                  </View>

                  <View className="mt-3">
                    <View className="w-full bg-gray-200 rounded-full h-2">
                      <View
                        className="h-2 rounded-full"
                        style={{ width: `${Math.min(stats.winRate, 100)}%`, backgroundColor: rankColor }}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      ) : (
        <View className="py-10 items-center rounded-2xl bg-gray-50">
          <Info size={20} color="#9ca3af" />
          <Text className="text-gray-500 text-sm mt-2">暂无{currentModeLabel}模式数据</Text>
        </View>
      )}

      {civStats.size > 6 && (
        <TouchableOpacity className="mt-4 bg-purple-50 rounded-2xl p-3">
          <Text className="text-purple-700 font-medium text-center">
            查看全部 {civStats.size} 个文明数据
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}