import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GameRecord } from './GameRecord';

export function HistoryScreen() {
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
              <Text className="text-2xl font-bold text-white">对战历史</Text>
              <Text className="text-white/60">回顾你的征战历程</Text>
            </View>
            <View className="bg-white/10 rounded-2xl p-3">
              <FontAwesome5 name="search" size={18} color="white" />
            </View>
          </View>
        </View>

        {/* 筛选器 */}
        <View className="px-6 pb-4">
          <View className="flex-row space-x-2">
            <View className="bg-white/20 rounded-2xl px-4 py-2">
              <Text className="text-white text-sm font-medium">全部</Text>
            </View>
            <TouchableOpacity className="bg-white/10 rounded-2xl px-4 py-2">
              <Text className="text-white/60 text-sm">1v1</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white/10 rounded-2xl px-4 py-2">
              <Text className="text-white/60 text-sm">团队</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 内容 */}
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          {/* 今天 */}
          <View className="bg-white/95 rounded-3xl p-4 mb-3">
            <Text className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">今天</Text>
            <View>
              <GameRecord
                mapName="King of the Hill"
                mapIcon="mountain"
                gameMode="RM 1v1"
                duration="22分钟"
                isWin={true}
                playerName="帝国征服者"
                playerElo={1247}
                playerIcon="crown"
                opponentName="MarineLorD"
                opponentElo={1456}
                opponentIcon="chess-rook"
                eloChange={28}
                timeAgo="2小时前"
                mapIconColor="#16a34a"
                playerIconColor="#3b82f6"
                opponentIconColor="#dc2626"
              />

              <GameRecord
                mapName="Hill and Dale"
                mapIcon="tree"
                gameMode="RM 1v1"
                duration="18分钟"
                isWin={true}
                playerName="帝国征服者"
                playerElo={1219}
                playerIcon="crown"
                opponentName="Hera"
                opponentElo={1389}
                opponentIcon="dragon"
                eloChange={22}
                timeAgo="4小时前"
                mapIconColor="#16a34a"
                playerIconColor="#3b82f6"
                opponentIconColor="#eab308"
              />
            </View>
          </View>

          {/* 昨天 */}
          <View className="bg-white/95 rounded-3xl p-4 mb-6">
            <Text className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">昨天</Text>
            <View>
              <GameRecord
                mapName="Continental"
                mapIcon="globe"
                gameMode="RM 1v1"
                duration="35分钟"
                isWin={false}
                playerName="帝国征服者"
                playerElo={1265}
                playerIcon="chess-rook"
                opponentName="TheViper"
                opponentElo={1678}
                opponentIcon="horse"
                eloChange={-18}
                timeAgo="昨天"
                mapIconColor="#dc2626"
                playerIconColor="#ef4444"
                opponentIconColor="#16a34a"
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
} 