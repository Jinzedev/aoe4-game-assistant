import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface GameRecordProps {
  mapName: string;
  mapIcon: string;
  gameMode: string;
  duration: string;
  isWin: boolean;
  playerName: string;
  playerElo: number;
  playerIcon: string;
  opponentName: string;
  opponentElo: number;
  opponentIcon: string;
  eloChange: number;
  timeAgo: string;
  mapIconColor?: string;
  playerIconColor?: string;
  opponentIconColor?: string;
}

export function GameRecord({
  mapName,
  mapIcon,
  gameMode,
  duration,
  isWin,
  playerName,
  playerElo,
  playerIcon,
  opponentName,
  opponentElo,
  opponentIcon,
  eloChange,
  timeAgo,
  mapIconColor = '#16a34a',
  playerIconColor = '#eab308',
  opponentIconColor = '#16a34a',
}: GameRecordProps) {
  const bgColor = isWin ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isWin ? 'border-green-400' : 'border-red-400';
  const statusBg = isWin ? 'bg-green-100' : 'bg-red-100';
  const statusText = isWin ? 'text-green-700' : 'text-red-700';
  const changeBg = isWin ? 'bg-green-100' : 'bg-red-100';
  const changeText = isWin ? 'text-green-700' : 'text-red-700';
  const changeIcon = isWin ? 'arrow-up' : 'arrow-down';
  const changeIconColor = isWin ? '#16a34a' : '#dc2626';

  return (
    <View className={`${bgColor} border-l-4 ${borderColor} rounded-xl p-3 mb-2`}>
      {/* 地图信息头部 */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center space-x-2">
          <View className="w-8 h-8 bg-green-600 rounded-lg items-center justify-center" style={{ backgroundColor: mapIconColor }}>
            <FontAwesome5 name={mapIcon as any} size={12} color="white" />
          </View>
          <View>
            <Text className="font-bold text-gray-700 text-sm">{mapName}</Text>
            <Text className="text-gray-500 text-xs">{gameMode} • {duration}</Text>
          </View>
        </View>
        <View className={`${statusBg} px-2 py-1 rounded-full`}>
          <Text className={`${statusText} text-xs font-medium`}>{isWin ? '胜利' : '失败'}</Text>
        </View>
      </View>
      
      {/* 对战信息 */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-2">
          <View className="w-6 h-6 rounded items-center justify-center" style={{ backgroundColor: playerIconColor }}>
            <FontAwesome5 name={playerIcon as any} size={8} color="white" />
          </View>
          <View>
            <Text className="text-gray-700 font-medium text-xs">{playerName}</Text>
            <Text className="text-gray-500 text-xs">{playerElo}</Text>
          </View>
        </View>
        
        <View className={`${changeBg} px-2 py-1 rounded-full flex-row items-center`}>
          <FontAwesome5 name={changeIcon} size={8} color={changeIconColor} />
          <Text className={`${changeText} text-xs ml-1`}>{isWin ? '+' : ''}{eloChange}</Text>
        </View>
        
        <Text className="text-gray-500 text-xs">vs</Text>
        
        <View className="flex-row items-center space-x-2">
          <View>
            <Text className="text-gray-700 font-medium text-xs text-right">{opponentName}</Text>
            <Text className="text-gray-500 text-xs text-right">{opponentElo}</Text>
          </View>
          <View className="w-6 h-6 rounded items-center justify-center" style={{ backgroundColor: opponentIconColor }}>
            <FontAwesome5 name={opponentIcon as any} size={8} color="white" />
          </View>
        </View>
      </View>
    </View>
  );
} 