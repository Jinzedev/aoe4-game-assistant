import React from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface MatchInfoCardProps {
  mapName: string;               // 地图名称
  mapImageUrl?: string;          // 地图图片链接，可以为空
  gameMode: string;              // 例如 "4v4快速匹配"
  result: 'win' | 'lose' | 'invalid'; // 对局结果
  color?: string;                // 地图背景色，可选
}

export function MatchInfoCard({
  mapName,
  mapImageUrl,
  gameMode,
  result,
  color = '#333',               // 地图图块默认色
}: MatchInfoCardProps) {
  // 结果样式
  let resultText = '';
  let textColor = '';
  let bgColor = '';

  if (result === 'win') {
    resultText = '胜利';
    textColor = '#047857';
    bgColor = '#d1fae5';
  } else if (result === 'lose') {
    resultText = '失败';
    textColor = '#b91c1c';
    bgColor = '#fee2e2';
  } else {
    resultText = '无效';
    textColor = '#4b5563';
    bgColor = '#f3f4f6';
  }

  return (
    <View
      style={{
        marginBottom: 16,
        backgroundColor: '#F7F7FA',
        borderRadius: 24,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* 左侧地图和信息 */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            marginRight: 16,
            overflow: 'hidden',
            backgroundColor: color,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {mapImageUrl ? (
            <Image
              source={{ uri: mapImageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <FontAwesome5 name="map" size={24} color="white" />
          )}
        </View>
        <View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#232342',
              marginBottom: 4,
            }}
          >
            {mapName}
          </Text>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>{gameMode}</Text>
        </View>
      </View>
      {/* 右侧结果 */}
      <View
        style={{
          backgroundColor: bgColor,
          borderRadius: 20,
          paddingHorizontal: 18,
          paddingVertical: 8,
        }}
      >
        <Text
          style={{
            color: textColor,
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
          {resultText}
        </Text>
      </View>
    </View>
  );
}
