import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeImage } from './SafeImage'; 
import { getCivilizationInfo } from '../../services/civilizationImages';
import { CivilizationStats } from '../../services/apiService';

interface CivilizationCardProps {
  civ: CivilizationStats;
  rank: number;
}

export function CivilizationCard({ civ, rank }: CivilizationCardProps) {
  const civInfo = getCivilizationInfo(civ.civilization);
  const civImage = civInfo.imageUrl;
  
  const rankColor = '#6366f1'; 

  return (
    <View className="mb-3">
      <View
        className="bg-white/95 rounded-2xl p-4 shadow-sm"
        style={{ borderWidth: 1, borderColor: '#e5e7eb' }}
      >
        <View className="flex-row items-center">
          
          {/* 排名徽章 */}
          <View className="w-10 items-center justify-center mr-2">
            {rank === 1 ? (
              <View className="items-center justify-center shadow-sm">
                <FontAwesome5 name="crown" size={22} color="#fbbf24" />
              </View>
            ) : rank === 2 ? (
              <View className="items-center justify-center">
                <FontAwesome5 name="medal" size={20} color="#94a3b8" />
                <Text className="text-[10px] font-bold text-slate-500 absolute pt-1">2</Text>
              </View>
            ) : rank === 3 ? (
              <View className="items-center justify-center">
                <FontAwesome5 name="medal" size={20} color="#b45309" />
                <Text className="text-[10px] font-bold text-amber-100 absolute pt-1">3</Text>
              </View>
            ) : (
              <View className="w-6 h-6 items-center justify-center rounded-full bg-slate-100">
                <Text className="text-slate-500 font-bold text-xs">{rank}</Text>
              </View>
            )}
          </View>

          {/* 文明图片 */}
          <View 
            className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-white items-center justify-center"
            style={{ borderWidth: 2, borderColor: '#e5e7eb' }}
          >
            {civImage ? (
              <SafeImage 
                source={{ uri: civImage }}
                className="w-full h-full"
                resizeMode="cover"
                fallback={<FontAwesome5 name="chess-pawn" size={20} color="#6b7280" />}
              />
            ) : (
              <FontAwesome5 name="chess-pawn" size={20} color="#6b7280" />
            )}
          </View>

          {/* 文明信息和统计 */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-bold text-lg text-gray-800">{civInfo.name}</Text>
              <Text className="text-2xl font-bold" style={{ color: rankColor }}>
                {(civ.win_rate || 0).toFixed(1)}%
              </Text>
            </View>
            
            <View className="flex-row items-center space-x-4">
              <Text className="text-sm text-gray-600">
                {(civ.games_count || 0).toLocaleString()}场比赛
              </Text>
              <Text className="text-sm text-gray-600">
                使用率 {(civ.pick_rate || 0).toFixed(1)}%
              </Text>
            </View>
            
            <View className="mt-3">
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View 
                  className="h-2 rounded-full"
                  style={{ 
                    width: `${Math.min(civ.win_rate || 0, 100)}%`,
                    backgroundColor: rankColor
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}