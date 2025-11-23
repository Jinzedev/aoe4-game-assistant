import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface GameDetailInfoCardProps {
  serverName: string;
  duration: string;
  timeAgo: string;
  season: string;
  rating: number;
  ratingDiff: number | string;
  isWin: boolean;
  isInvalidGame: boolean;
}

export function GameDetailInfoCard({
  serverName,
  duration,
  timeAgo,
  season,
  rating,
  ratingDiff,
  isWin,
  isInvalidGame,
}: GameDetailInfoCardProps) {
  return (
    <View className="mb-4 rounded-3xl bg-white/95 p-6">
      <Text className="mb-4 text-xl font-bold text-gray-800">游戏信息</Text>
      {/* 第一行 */}
      <View className="mb-4 flex-row">
        <View className="mr-2 flex-1 rounded-2xl bg-gray-50 p-4">
          <View className="mb-2 flex-row items-center">
            <FontAwesome5 name="server" size={16} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600">服务器</Text>
          </View>
          <Text className="text-base font-semibold text-gray-800">{serverName}</Text>
        </View>
        <View className="ml-2 flex-1 rounded-2xl bg-gray-50 p-4">
          <View className="mb-2 flex-row items-center">
            <FontAwesome5 name="clock" size={16} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600">游戏时长</Text>
          </View>
          <Text className="text-base font-semibold text-gray-800">{duration}</Text>
        </View>
      </View>
      {/* 第二行 */}
      <View className="mb-4 flex-row">
        <View className="mr-2 flex-1 rounded-2xl bg-gray-50 p-4">
          <View className="mb-2 flex-row items-center">
            <FontAwesome5 name="calendar" size={16} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600">游戏时间</Text>
          </View>
          <Text className="text-base font-semibold text-gray-800">{timeAgo}</Text>
        </View>
        <View className="ml-2 flex-1 rounded-2xl bg-gray-50 p-4">
          <View className="mb-2 flex-row items-center">
            <FontAwesome5 name="trophy" size={16} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600">赛季</Text>
          </View>
          <Text className="text-base font-semibold text-gray-800">赛季 {season || '未知'}</Text>
        </View>
      </View>
      {/* 第三行 - 我的分数 */}
      <View className="rounded-2xl bg-blue-50 p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <FontAwesome5 name="chart-line" size={16} color="#3b82f6" />
            <Text className="ml-2 text-sm font-medium text-blue-600">我的分数</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="mr-2 text-2xl font-bold text-blue-600">{rating || 0}</Text>
            <View
              className={`rounded-full px-3 py-1 ${
                isInvalidGame ? 'bg-gray-200' : isWin ? 'bg-green-200' : 'bg-red-200'
              }`}>
              <Text
                className={`text-sm font-bold ${
                  isInvalidGame ? 'text-gray-600' : isWin ? 'text-green-700' : 'text-red-700'
                }`}>
                {isInvalidGame
                  ? '--'
                  : ratingDiff
                    ? Number(ratingDiff) > 0
                      ? `+${ratingDiff}`
                      : `${ratingDiff}`
                    : '±0'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
