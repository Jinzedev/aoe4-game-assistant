import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export function StatsScreen() {
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
              <Text className="text-2xl font-bold text-white">详细统计</Text>
              <Text className="text-white/60">深入分析你的表现</Text>
            </View>
            <View className="bg-white/10 rounded-2xl p-3">
              <FontAwesome5 name="filter" size={18} color="white" />
            </View>
          </View>
        </View>

        {/* 内容 */}
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          {/* 胜率趋势图 */}
          <View className="bg-white/95 rounded-3xl p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">胜率趋势</Text>
            <View className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600">本月平均胜率</Text>
                <Text className="text-2xl font-bold text-purple-600">73.2%</Text>
              </View>
              {/* 模拟图表 */}
              <View className="flex-row items-end space-x-1 h-20">
                <View className="bg-purple-500 rounded-t flex-1" style={{ height: '60%' }} />
                <View className="bg-purple-500 rounded-t flex-1" style={{ height: '75%' }} />
                <View className="bg-purple-500 rounded-t flex-1" style={{ height: '45%' }} />
                <View className="bg-purple-500 rounded-t flex-1" style={{ height: '80%' }} />
                <View className="bg-purple-500 rounded-t flex-1" style={{ height: '90%' }} />
                <View className="bg-purple-500 rounded-t flex-1" style={{ height: '70%' }} />
              </View>
            </View>
          </View>

          {/* 文明统计 */}
          <View className="bg-white/95 rounded-3xl p-6 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">文明使用统计</Text>
            <View className="space-y-3">
              <View className="flex-row items-center justify-between p-4 bg-blue-50 rounded-2xl">
                <View className="flex-row items-center space-x-3">
                  <View className="w-10 h-10 bg-blue-500 rounded-xl items-center justify-center">
                    <FontAwesome5 name="crown" size={16} color="white" />
                  </View>
                  <View>
                    <Text className="font-semibold text-blue-800">英格兰</Text>
                    <Text className="text-sm text-blue-600">47场比赛</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold text-blue-800">78%</Text>
                  <Text className="text-sm text-blue-600">37胜10负</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between p-4 bg-red-50 rounded-2xl">
                <View className="flex-row items-center space-x-3">
                  <View className="w-10 h-10 bg-red-500 rounded-xl items-center justify-center">
                    <FontAwesome5 name="chess-rook" size={16} color="white" />
                  </View>
                  <View>
                    <Text className="font-semibold text-red-800">法兰西</Text>
                    <Text className="text-sm text-red-600">32场比赛</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold text-red-800">69%</Text>
                  <Text className="text-sm text-red-600">22胜10负</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
} 