import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getMapInfo, getChineseMapName } from '../services/mapImages';
import { getCivilizationInfo } from '../services/civilizationImages';

interface Player {
  name: string;
  rating: number;
  civilization?: string;
}

interface GameRecordProps {
  gameId?: string | number;
  mapName: string;
  mapIcon: string;
  gameMode: string;
  duration: string;
  isWin: boolean;
  players: Player[];
  playerIcon: string;
  opponents: Player[];
  opponentIcon: string;
  eloChange: number;
  timeAgo: string;
  mapIconColor?: string;
  playerIconColor?: string;
  opponentIconColor?: string;
  onPress?: () => void;
}

export function GameRecord({
  gameId,
  mapName,
  mapIcon,
  gameMode,
  duration,
  isWin,
  players,
  playerIcon,
  opponents,
  opponentIcon,
  eloChange,
  timeAgo,
  mapIconColor = '#16a34a',
  playerIconColor = '#eab308',
  opponentIconColor = '#16a34a',
  onPress,
}: GameRecordProps) {
  const [imageError, setImageError] = React.useState(false);
  
  // 检测是否为无效对局
  const isInvalidGame = gameMode.includes('(Invalid)');
  
  // 无效对局使用灰色主题
  const bgColor = isInvalidGame ? 'bg-gray-50' : (isWin ? 'bg-green-50' : 'bg-red-50');
  const borderColor = isInvalidGame ? 'border-gray-400' : (isWin ? 'border-green-400' : 'border-red-400');
  const statusBg = isInvalidGame ? 'bg-gray-100' : (isWin ? 'bg-green-100' : 'bg-red-100');
  const statusText = isInvalidGame ? 'text-gray-600' : (isWin ? 'text-green-700' : 'text-red-700');
  const changeBg = isInvalidGame ? 'bg-gray-100' : (isWin ? 'bg-green-100' : 'bg-red-100');
  const changeText = isInvalidGame ? 'text-gray-600' : (isWin ? 'text-green-700' : 'text-red-700');
  const changeIcon = isWin ? 'arrow-up' : 'arrow-down';
  const changeIconColor = isInvalidGame ? '#6b7280' : (isWin ? '#16a34a' : '#dc2626');

  // 获取地图信息
  const mapInfo = getMapInfo(mapName);

  const GameContent = () => (
    <View className={`${bgColor} border-l-4 ${borderColor} rounded-xl p-4 mb-3`}>
      {/* 地图信息头部 */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-lg mr-3 overflow-hidden" style={{ backgroundColor: mapInfo.color }}>
            {mapInfo.imageUrl && !imageError ? (
              <Image 
                source={{ uri: mapInfo.imageUrl }} 
                className="w-full h-full"
                style={{ resizeMode: 'cover' }}
                onError={() => setImageError(true)}
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <FontAwesome5 name={mapIcon as any} size={14} color="white" />
              </View>
            )}
          </View>
          <View>
            <Text className="font-bold text-gray-800 text-base">{getChineseMapName(mapName)}</Text>
            <Text className="text-gray-500 text-sm mt-1">{gameMode} • {duration}</Text>
          </View>
        </View>
        <View className="flex-col items-end">
          <View className={`${statusBg} px-3 py-1 rounded-full mb-1`}>
            <Text className={`${statusText} text-sm font-semibold`}>
              {isInvalidGame ? '无效' : (isWin ? '胜利' : '失败')}
            </Text>
          </View>
          <Text className="text-gray-400 text-xs">{timeAgo}</Text>
        </View>
      </View>
      
      {/* 对战信息 - 统一使用水平布局 */}
      <View className="flex-row items-center justify-between">
        {/* 玩家信息 */}
        <View className="flex-1">
          {players.map((player, index) => {
            const civInfo = getCivilizationInfo(player.civilization || '');
            return (
              <View key={index} className="flex-row items-center mb-1" style={{flexWrap: 'nowrap'}}>
                <View className="w-6 h-6 rounded mr-2 overflow-hidden" style={{ backgroundColor: civInfo.color }}>
                  {civInfo.imageUrl ? (
                    <Image 
                      source={{ uri: civInfo.imageUrl }} 
                      className="w-full h-full"
                      style={{ resizeMode: 'cover' }}
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <FontAwesome5 name="shield-alt" size={8} color="white" />
                    </View>
                  )}
                </View>
                <Text className="text-gray-800 font-medium text-sm flex-shrink">
                  {player.name}{' '}
                </Text>
                <Text className="text-blue-600 font-semibold text-sm">
                  {player.rating}
                </Text>
              </View>
            );
          })}
        </View>
        
        {/* VS 和 ELO变化 */}
        <View className="items-center mx-2">
          <Text className="text-gray-400 text-xs mb-1">VS</Text>
          <View className={`${changeBg} px-2 py-1 rounded-full flex-row items-center`}>
            {!isInvalidGame && (
              <FontAwesome5 name={changeIcon} size={8} color={changeIconColor} />
            )}
            <Text className={`${changeText} text-xs font-semibold ${!isInvalidGame ? 'ml-1' : ''}`}>
              {isInvalidGame ? '--' : 
                eloChange === 0 ? '0' : 
                `${eloChange > 0 ? '+' : ''}${eloChange}`}
            </Text>
          </View>
        </View>
        
        {/* 对手信息 */}
        <View className="flex-1">
          {opponents.map((opponent, index) => {
            const civInfo = getCivilizationInfo(opponent.civilization || '');
            return (
              <View key={index} className="flex-row items-center mb-1" style={{flexWrap: 'nowrap'}}>
                <View className="w-6 h-6 rounded mr-2 overflow-hidden" style={{ backgroundColor: civInfo.color }}>
                  {civInfo.imageUrl ? (
                    <Image 
                      source={{ uri: civInfo.imageUrl }} 
                      className="w-full h-full"
                      style={{ resizeMode: 'cover' }}
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center">
                      <FontAwesome5 name="shield-alt" size={8} color="white" />
                    </View>
                  )}
                </View>
                <Text className="text-gray-800 font-medium text-sm flex-shrink">
                  {opponent.name}{' '}
                </Text>
                <Text className="text-red-600 font-semibold text-sm">
                  {opponent.rating}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <GameContent />
      </TouchableOpacity>
    );
  }

  return <GameContent />;
} 