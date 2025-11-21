import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getMapInfo, getChineseMapName } from '../services/mapImages';
import { getCivilizationInfo } from '../services/civilizationImages';

interface ModernGameCardProps {
  game: any;
  onPress?: () => void;
}

export function ModernGameCard({ game, onPress }: ModernGameCardProps) {
  const { isWin, mapName, gameMode, duration, timeAgo, players, opponents, eloChange } = game;
  
  const isInvalid = gameMode.includes('(Invalid)');

  // 配色方案
  const theme = isInvalid 
    ? { color: '#9ca3af', gradient: ['#f3f4f6', '#e5e7eb'], text: 'text-gray-500', label: '无效', badgeBg: 'bg-gray-200' }
    : isWin 
      ? { color: '#10b981', gradient: ['#ecfdf5', '#d1fae5'], text: 'text-emerald-700', label: '胜利', badgeBg: 'bg-emerald-500' } 
      : { color: '#ef4444', gradient: ['#fef2f2', '#fee2e2'], text: 'text-rose-700', label: '失败', badgeBg: 'bg-rose-500' };

  // 获取地图与中文名
  const mapInfo = getMapInfo(mapName);
  const mapChineseName = getChineseMapName(mapName);

  return (
    <TouchableOpacity 
      activeOpacity={0.85} 
      onPress={onPress}
      className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden border border-slate-100"
      style={{ elevation: 2 }}
    >
      {/* 1. 顶部通栏：地图背景 + 关键信息 */}
      <View className="h-16 relative">
        {/* 地图背景图 */}
        <Image 
          // ✅ 这里的修复是正确的
          source={{ uri: mapInfo.imageUrl || '' }} 
          className="absolute w-full h-full"
          style={{ opacity: 0.8 }} 
          resizeMode="cover"
        />
        {/* 渐变遮罩 */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute w-full h-full"
        />
        
        {/* 顶部内容行 */}
        <View className="flex-row justify-between items-center px-4 h-full">
          <View>
            <Text className="text-white font-extrabold text-base tracking-wider shadow-sm">
              {mapChineseName}
            </Text>
            <Text className="text-white/80 text-xs font-medium mt-0.5">
              {gameMode.replace('RM ', '')} • {duration}
            </Text>
          </View>

          {/* 结果徽章 */}
          <View className={`${theme.badgeBg} px-3 py-1 rounded-full flex-row items-center shadow-sm`}>
            <FontAwesome5 name={isWin ? "crown" : isInvalid ? "minus-circle" : "skull"} size={10} color="white" style={{marginRight: 4}} />
            <Text className="text-white text-xs font-bold uppercase tracking-widest">
              {theme.label}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. 下半部分：对战详情 */}
      <View className="p-3 bg-white">
        <View className="flex-row items-start">
          
          {/* 左侧：我方队伍 */}
          <View className="flex-1 pr-2">
            {players.map((p: any, i: number) => {
              const civInfo = getCivilizationInfo(p.civilization);
              return (
                <View key={`p-${i}`} className="flex-row items-center justify-end mb-2">
                  <View className="items-end flex-1 mr-2">
                    <Text numberOfLines={1} className="text-slate-700 font-bold text-xs">
                      {p.name}
                    </Text>
                    <Text className="text-slate-400 text-[10px] font-medium">
                       {p.rating}
                    </Text>
                  </View>
                  {/* 文明图标 */}
                  <Image 
                    // 🔧 修复点 1：添加 || '' 防止 null 类型报错
                    source={{ uri: civInfo.imageUrl || '' }} 
                    className="w-6 h-6 rounded border border-slate-100 bg-slate-50"
                    resizeMode="cover"
                  />
                </View>
              );
            })}
          </View>

          {/* 中间：VS / 分数 */}
          <View className="items-center justify-center w-16 pt-1">
            <Text className="text-slate-200 font-black italic text-sm mb-1">VS</Text>
            {/* ELO 变化胶囊 */}
            {!isInvalid && eloChange !== 0 && (
              <View className={`px-2 py-0.5 rounded-md border ${isWin ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <Text className={`text-[10px] font-bold ${isWin ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {eloChange > 0 ? '+' : ''}{eloChange}
                </Text>
              </View>
            )}
             <Text className="text-[10px] text-slate-300 mt-1">{timeAgo}</Text>
          </View>

          {/* 右侧：敌方队伍 */}
          <View className="flex-1 pl-2">
            {opponents.map((o: any, i: number) => {
              const civInfo = getCivilizationInfo(o.civilization);
              return (
                <View key={`o-${i}`} className="flex-row items-center justify-start mb-2">
                   {/* 文明图标 */}
                   <Image 
                    // 🔧 修复点 2：添加 || '' 防止 null 类型报错
                    source={{ uri: civInfo.imageUrl || '' }} 
                    className="w-6 h-6 rounded border border-slate-100 bg-slate-50"
                    resizeMode="cover"
                  />
                  <View className="items-start flex-1 ml-2">
                    <Text numberOfLines={1} className="text-slate-600 font-medium text-xs">
                      {o.name}
                    </Text>
                    <Text className="text-slate-400 text-[10px] font-medium">
                       {o.rating}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

        </View>
        
        {/* 底部装饰条 */}
        <View className={`h-0.5 w-1/3 self-center mt-1 rounded-full opacity-20 ${isWin ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      </View>
    </TouchableOpacity>
  );
}