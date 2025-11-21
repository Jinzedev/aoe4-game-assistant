// src/components/MonthlyStatsCard.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// 假设 MonthlyStats 类型可以从 apiService 导入，但此处我们只使用接口
import { MonthlyStats } from '../services/apiService'; 

interface MonthlyStatsCardProps {
  monthlyStats: MonthlyStats | null;
  isLoadingStats: boolean;
}

export function MonthlyStatsCard({ monthlyStats, isLoadingStats }: MonthlyStatsCardProps) {
  return (
    <View className="bg-white/95 rounded-3xl p-6 mb-4 shadow-lg">
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-lg font-bold text-gray-800">本月表现</Text>
        <View className="bg-gray-100 rounded-full px-3 py-1">
          <Text className="text-gray-600 text-xs font-medium">{new Date().toLocaleDateString('zh-CN', { month: 'long' })}</Text>
        </View>
      </View>
      {isLoadingStats ? (
        <View className="flex-row">
          <View className="flex-1 bg-gray-100 h-32 rounded-2xl mr-2" />
          <View className="flex-1 bg-gray-100 h-32 rounded-2xl ml-2" />
        </View>
      ) : (
        <View className="flex-row">
          <View className="flex-1 mr-3">
            <LinearGradient colors={['#e0f2fe', '#b3e5fc']} style={{ borderRadius: 15, padding: 20 }}>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-cyan-700 font-bold text-sm">本月胜率</Text>
                <FontAwesome5 name="trophy" size={14} color="#0891b2" />
              </View>
              <Text className="text-3xl font-bold text-cyan-900 mb-2">{monthlyStats ? `${monthlyStats.winRate.toFixed(1)}%` : '--'}</Text>
              <Text className="text-cyan-700 text-xs font-semibold">{monthlyStats ? `${monthlyStats.wins}胜${monthlyStats.losses}负` : '暂无数据'}</Text>
            </LinearGradient>
          </View>
          <View className="flex-1 ml-3">
            <LinearGradient colors={['#f3e8ff', '#e9d5ff']} style={{ borderRadius: 15, padding: 20 }}>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-purple-700 font-bold text-sm">本月场次</Text>
                <FontAwesome5 name="gamepad" size={14} color="#7c3aed" />
              </View>
              <Text className="text-3xl font-bold text-purple-900 mb-2">{monthlyStats ? monthlyStats.totalGames : '--'}</Text>
              <Text className="text-purple-700 text-xs font-semibold">{monthlyStats && monthlyStats.totalGames > 0 ? '保持活跃' : '尚未开始'}</Text>
            </LinearGradient>
          </View>
        </View>
      )}
    </View>
  );
}