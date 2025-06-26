import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export function RankingScreen() {
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
              <Text className="text-2xl font-bold text-white">排名追踪</Text>
              <Text className="text-white/60">见证你的成长轨迹</Text>
            </View>
            <View className="bg-white/10 rounded-2xl p-3">
              <FontAwesome5 name="bullseye" size={18} color="white" />
            </View>
          </View>
        </View>

        {/* 内容 */}
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          {/* 当前排名 */}
          <View className="bg-white/95 rounded-3xl p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">当前排名</Text>
            <View className="flex-row space-x-4">
              <View className="bg-purple-50 rounded-2xl p-4 flex-1">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-purple-700 font-semibold">1v1 排名</Text>
                  <FontAwesome5 name="trophy" size={16} color="#7c3aed" />
                </View>
                <Text className="text-3xl font-bold text-purple-800 mb-1">#1,247</Text>
                <View className="flex-row items-center">
                  <FontAwesome5 name="arrow-up" size={10} color="#059669" />
                  <Text className="text-sm font-medium text-emerald-600 ml-1">+23 本月</Text>
                </View>
              </View>
              <View className="bg-blue-50 rounded-2xl p-4 flex-1">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-blue-700 font-semibold">团队排名</Text>
                  <FontAwesome5 name="users" size={16} color="#2563eb" />
                </View>
                <Text className="text-3xl font-bold text-blue-800 mb-1">#892</Text>
                <View className="flex-row items-center">
                  <FontAwesome5 name="arrow-down" size={10} color="#dc2626" />
                  <Text className="text-sm font-medium text-red-600 ml-1">-5 本月</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 排名趋势 */}
          <View className="bg-white/95 rounded-3xl p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">排名趋势</Text>
            <View className="bg-indigo-100 rounded-2xl p-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm text-gray-600">最近30天</Text>
                <View className="bg-emerald-100 px-3 py-1 rounded-full">
                  <Text className="text-emerald-700 text-xs font-semibold">↗ 上升趋势</Text>
                </View>
              </View>
              {/* 模拟排名趋势图 */}
              <View className="flex-row items-end justify-between h-24 mb-2">
                <View className="w-2 bg-indigo-500 rounded-t" style={{ height: '40%' }} />
                <View className="w-2 bg-indigo-500 rounded-t" style={{ height: '45%' }} />
                <View className="w-2 bg-indigo-500 rounded-t" style={{ height: '35%' }} />
                <View className="w-2 bg-indigo-500 rounded-t" style={{ height: '55%' }} />
                <View className="w-2 bg-indigo-500 rounded-t" style={{ height: '70%' }} />
                <View className="w-2 bg-indigo-500 rounded-t" style={{ height: '85%' }} />
                <View className="w-2 bg-indigo-500 rounded-t" style={{ height: '90%' }} />
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">30天前</Text>
                <Text className="text-xs text-gray-500">今天</Text>
              </View>
            </View>
          </View>

          {/* 目标设定 */}
          <View className="bg-white/95 rounded-3xl p-6 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">本月目标</Text>
            <View className="space-y-4">
              <View className="bg-emerald-50 rounded-2xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-emerald-700 font-semibold">达到白金段位</Text>
                  <View className="bg-emerald-200 px-2 py-1 rounded">
                    <Text className="text-emerald-800 text-xs">进行中</Text>
                  </View>
                </View>
                <View className="w-full bg-emerald-200 rounded-full h-2 mb-2">
                  <View className="bg-emerald-500 h-2 rounded-full" style={{ width: '68%' }} />
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-emerald-600">还需132分</Text>
                  <Text className="text-sm text-emerald-600">68% 完成</Text>
                </View>
              </View>
              <View className="bg-blue-50 rounded-2xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-blue-700 font-semibold">进入前1000名</Text>
                  <View className="bg-blue-200 px-2 py-1 rounded">
                    <Text className="text-blue-800 text-xs">计划中</Text>
                  </View>
                </View>
                <View className="w-full bg-blue-200 rounded-full h-2 mb-2">
                  <View className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }} />
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-blue-600">还需247个排名</Text>
                  <Text className="text-sm text-blue-600">25% 完成</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
} 