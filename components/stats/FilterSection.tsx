import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeImage } from './SafeImage';
import { getMapInfo, getChineseMapName } from '../../services/mapImages';
import { getCivilizationInfo } from '../../services/civilizationImages';
import { MapStatsResponse } from '../../services/apiService';
import {
  LEADERBOARD_OPTIONS,
  RM_RATING_OPTIONS,
  QM_RATING_OPTIONS,
} from '../../constants/statsConstants';

interface FilterSectionProps {
  selectedLeaderboard: string;
  onSelectLeaderboard: (key: string) => void;
  selectedRating: string;
  onSelectRating: (key: string) => void;
  selectedMap: number | null;
  onSelectMap: (id: number | null) => void;
  mapData: MapStatsResponse | null;
}

export function FilterSection({
  selectedLeaderboard,
  onSelectLeaderboard,
  selectedRating,
  onSelectRating,
  selectedMap,
  onSelectMap,
  mapData,
}: FilterSectionProps) {
  const [showLeaderboardDropdown, setShowLeaderboardDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showMapDropdown, setShowMapDropdown] = useState(false);

  const ratingOptions = selectedLeaderboard.startsWith('rm_')
    ? RM_RATING_OPTIONS
    : QM_RATING_OPTIONS;

  return (
    <View className="mb-4 rounded-3xl bg-white/95 p-6">
      <View className="mb-4 flex-row space-x-4">
        {/* 模式选择 */}
        <View className="flex-1">
          <Text className="mb-3 text-lg font-bold text-gray-800">选择模式</Text>
          <TouchableOpacity
            onPress={() => setShowLeaderboardDropdown(!showLeaderboardDropdown)}
            className="flex-row items-center justify-between rounded-2xl bg-gray-100 px-4 py-3">
            <View className="flex-row items-center">
              <FontAwesome5
                name={
                  LEADERBOARD_OPTIONS.find((opt) => opt.key === selectedLeaderboard)?.icon as any
                }
                size={16}
                color={
                  LEADERBOARD_OPTIONS.find((opt) => opt.key === selectedLeaderboard)?.color ||
                  '#6b7280'
                }
              />
              <Text className="ml-2 font-medium text-gray-700">
                {LEADERBOARD_OPTIONS.find((opt) => opt.key === selectedLeaderboard)?.name ||
                  '选择模式'}
              </Text>
            </View>
            <FontAwesome5
              name={showLeaderboardDropdown ? 'chevron-up' : 'chevron-down'}
              size={12}
              color="#6b7280"
            />
          </TouchableOpacity>

          {showLeaderboardDropdown && (
            <View className="absolute left-0 right-0 top-20 z-50 mt-2 rounded-2xl border border-gray-200 bg-white shadow-lg">
              {/* 这里可以简化渲染逻辑，或者保持原样分两组渲染 */}
              <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled>
                {LEADERBOARD_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => {
                      onSelectLeaderboard(option.key);
                      setShowLeaderboardDropdown(false);
                    }}
                    className={`flex-row items-center px-3 py-3 ${selectedLeaderboard === option.key ? 'bg-purple-50' : ''}`}>
                    <FontAwesome5 name={option.icon as any} size={14} color={option.color} />
                    <Text
                      className={`ml-2 font-medium ${selectedLeaderboard === option.key ? 'text-purple-700' : 'text-gray-700'}`}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* 分段选择 */}
        <View className="flex-1">
          <Text className="mb-3 text-lg font-bold text-gray-800">选择分段</Text>
          <TouchableOpacity
            onPress={() => setShowRatingDropdown(!showRatingDropdown)}
            className="flex-row items-center justify-between rounded-2xl bg-gray-100 px-4 py-3">
            <Text className="font-medium text-gray-700">
              {ratingOptions.find((opt) => opt.key === selectedRating)?.name || '全部'}
            </Text>
            <FontAwesome5
              name={showRatingDropdown ? 'chevron-up' : 'chevron-down'}
              size={12}
              color="#6b7280"
            />
          </TouchableOpacity>

          {showRatingDropdown && (
            <View className="absolute left-0 right-0 top-20 z-50 mt-2 rounded-2xl border border-gray-200 bg-white shadow-lg">
              <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                {ratingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => {
                      onSelectRating(option.key);
                      setShowRatingDropdown(false);
                    }}
                    className={`flex-row items-center px-4 py-3 ${selectedRating === option.key ? 'bg-purple-50' : ''}`}>
                    <Text
                      className={`font-medium ${selectedRating === option.key ? 'text-purple-700' : 'text-gray-700'}`}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* 地图选择器 */}
      <View className="z-10">
        <Text className="mb-3 text-lg font-bold text-gray-800">
          选择地图 (可选) {mapData?.data?.length ? `- ${mapData.data.length}个地图` : ''}
        </Text>
        <TouchableOpacity
          onPress={() => setShowMapDropdown(!showMapDropdown)}
          className="flex-row items-center justify-between rounded-2xl bg-gray-100 px-4 py-3">
          <View className="flex-row items-center">
            <FontAwesome5 name="map" size={16} color="#6b7280" />
            <Text className="ml-2 font-medium text-gray-700">
              {selectedMap
                ? (() => {
                    const selectedMapData = mapData?.data?.find(
                      (m) => m && m.map_id === selectedMap
                    );
                    const mapName = selectedMapData?.map_name || selectedMapData?.map || '';
                    return getChineseMapName(mapName) || mapName || '未知地图';
                  })()
                : '全部地图'}
            </Text>
          </View>
          <FontAwesome5
            name={showMapDropdown ? 'chevron-up' : 'chevron-down'}
            size={12}
            color="#6b7280"
          />
        </TouchableOpacity>

        {showMapDropdown && (
          <View
            className="mt-2 rounded-2xl border border-gray-200 bg-white shadow-lg"
            style={{ maxHeight: 400 }}>
            <ScrollView nestedScrollEnabled>
              <TouchableOpacity
                onPress={() => {
                  onSelectMap(null);
                  setShowMapDropdown(false);
                }}
                className={`flex-row items-center px-4 py-3 ${selectedMap === null ? 'bg-purple-50' : ''}`}>
                <FontAwesome5 name="globe" size={16} color="#6b7280" />
                <Text
                  className={`ml-3 font-medium ${selectedMap === null ? 'text-purple-700' : 'text-gray-700'}`}>
                  全部地图
                </Text>
              </TouchableOpacity>

              {mapData?.data
                ?.filter((m) => m && (m.map_name || m.map))
                .sort((a, b) => b.games_count - a.games_count)
                .map((mapItem) => {
                  const mapName = mapItem.map_name || mapItem.map || '';
                  const mapInfo = getMapInfo(mapName);
                  const chineseName = getChineseMapName(mapName);
                  const isActive = selectedMap === mapItem.map_id;

                  return (
                    <TouchableOpacity
                      key={mapItem.map_id}
                      onPress={() => {
                        onSelectMap(mapItem.map_id);
                        setShowMapDropdown(false);
                      }}
                      className={`flex-row items-center px-4 py-3 ${isActive ? 'bg-purple-50' : ''}`}>
                      {mapInfo.imageUrl ? (
                        <SafeImage
                          source={{ uri: mapInfo.imageUrl }}
                          className="mr-3 h-8 w-8 rounded-lg"
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          className="mr-3 h-8 w-8 items-center justify-center rounded-lg"
                          style={{ backgroundColor: mapInfo.color }}>
                          <FontAwesome5 name="map" size={12} color="white" />
                        </View>
                      )}
                      <View className="flex-1">
                        <Text
                          className={`font-medium ${isActive ? 'text-purple-700' : 'text-gray-700'}`}>
                          {chineseName || mapName}
                        </Text>

                        <Text className="text-xs text-gray-500">
                          {mapItem.games_count?.toLocaleString()}场 •{' '}
                          {(() => {
                            const civKey = mapItem.highest_win_rate_civilization;
                            if (!civKey) return '未知';
                            return getCivilizationInfo(civKey).name;
                          })()}
                          最强
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}
