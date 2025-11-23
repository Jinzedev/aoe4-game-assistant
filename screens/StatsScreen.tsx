// src/screens/StatsScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Services
import { apiService, StatsResponse, Game, MapStatsResponse } from '../services/apiService';
import { getChineseMapName } from '../services/mapImages';
import { StorageService } from '../services/storageService';
import { SearchResult } from '../types';

// Constants & Types
import { PersonalMode } from '../constants/statsConstants';

// Components
import { CivilizationCard } from '../components/stats/CivilizationCard';
import { PersonalStatsCard } from '../components/stats/PersonalStatsCard';
import { FilterSection } from '../components/stats/FilterSection';

export function StatsScreen() {
  // --- 全局状态 ---
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('rm_solo');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedMap, setSelectedMap] = useState<number | null>(null);
  
  // --- 数据状态 ---
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
  const [mapData, setMapData] = useState<MapStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 个人数据状态 ---
  const [boundPlayer, setBoundPlayer] = useState<SearchResult | null>(null);
  const [personalGames, setPersonalGames] = useState<Game[]>([]);
  const [personalCivStats, setPersonalCivStats] = useState<Map<string, {wins: number, total: number, winRate: number}>>(new Map());
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalMode, setPersonalMode] = useState<PersonalMode>('rm_solo');
  const [personalStatsCache, setPersonalStatsCache] = useState<Record<string, { games: Game[], civStats: Map<string, {wins: number, total: number, winRate: number}> }>>({});
  const personalModeRef = useRef<PersonalMode>('rm_solo');

  // --- API Methods ---
  const fetchCivilizationStats = async () => {
    if (!selectedLeaderboard) return;
    setLoading(true);
    setError(null);
    try {
      console.log('📊 获取文明统计数据:', { leaderboard: selectedLeaderboard, rating: selectedRating, mapId: selectedMap });
      let data: StatsResponse;
      if (selectedMap) {
        const mapCivData = await apiService.getMapCivilizationStats(
          selectedLeaderboard, selectedMap, undefined, selectedRating || undefined
        );
        data = {
          data: mapCivData.data,
          leaderboard: mapCivData.leaderboard,
          patch: mapCivData.patch,
          rank_level: mapCivData.rank_level,
          rating: mapCivData.rating
        };
      } else {
        data = await apiService.getCivilizationStats(selectedLeaderboard, undefined, selectedRating || undefined);
      }
      setStatsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
      setStatsData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMapData = async () => {
    if (!selectedLeaderboard) return;
    try {
      const data = await apiService.getMapStats(selectedLeaderboard, undefined, selectedRating || undefined);
      setMapData(data);
    } catch (err) {
      console.error('❌ 获取地图数据失败:', err);
      setMapData(null);
    }
  };

  const fetchPersonalData = async (mode: PersonalMode) => {
    try {
      const playerId = await StorageService.getBoundPlayerId();
      if (!playerId) return;
      
      const latestPlayerData = await apiService.getPlayer(playerId);
      if (personalModeRef.current === mode) setPersonalLoading(true);

      const player: SearchResult = {
        profile_id: latestPlayerData.profile_id,
        name: latestPlayerData.name,
        country: latestPlayerData.country,
        avatars: latestPlayerData.avatars,
        leaderboards: latestPlayerData.leaderboards,
        last_game_at: latestPlayerData.last_game_at
      };
      setBoundPlayer(player);

      const gameData = await apiService.getPlayerGames(player.profile_id, { limit: 500, leaderboard: mode });
      const civStatsMap = new Map<string, {wins: number, total: number, winRate: number}>();
      
      gameData.games.forEach(game => {
        const playerData = game.teams.flat().find(t => t.player.profile_id === player.profile_id);
        if (playerData) {
          const civ = playerData.player.civilization;
          const isWin = playerData.player.result === 'win';
          const existing = civStatsMap.get(civ) || { wins: 0, total: 0, winRate: 0 };
          existing.total += 1;
          if (isWin) existing.wins += 1;
          existing.winRate = existing.total > 0 ? (existing.wins / existing.total) * 100 : 0;
          civStatsMap.set(civ, existing);
        }
      });

      setPersonalStatsCache(prev => ({ ...prev, [mode]: { games: gameData.games, civStats: civStatsMap } }));
      if (personalModeRef.current === mode) {
        setPersonalGames(gameData.games);
        setPersonalCivStats(civStatsMap);
      }
    } catch (err) {
      console.error('❌ 获取个人数据失败:', err);
    } finally {
      if (personalModeRef.current === mode) setPersonalLoading(false);
    }
  };

  const handlePersonalModeChange = (mode: PersonalMode) => {
    if (mode === personalMode) return;
    setPersonalMode(mode);
    const cached = personalStatsCache[mode];
    if (cached) {
      setPersonalGames(cached.games);
      setPersonalCivStats(new Map(cached.civStats));
    } else {
      fetchPersonalData(mode);
    }
  };

  // --- Effects ---
  useEffect(() => {
    setSelectedRating('');
    setSelectedMap(null);
  }, [selectedLeaderboard]);

  useEffect(() => {
    fetchCivilizationStats();
    fetchMapData();
  }, [selectedLeaderboard, selectedRating, selectedMap]);

  useEffect(() => {
    personalModeRef.current = personalMode;
  }, [personalMode]);

  useEffect(() => {
    fetchPersonalData(personalModeRef.current);
  }, []);

  const sortedCivs = statsData?.data ? [...statsData.data].sort((a, b) => b.win_rate - a.win_rate) : [];

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient colors={['#0f172a', '#581c87', '#0f172a']} className="flex-1">
        
        {/* Header */}
        <View className="px-6 pb-4 pt-10">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-white">文明统计</Text>
              <Text className="text-white/60">全球文明胜率分析</Text>
            </View>
            <TouchableOpacity className="bg-white/10 rounded-2xl p-3" onPress={fetchCivilizationStats}>
              <FontAwesome5 name="sync-alt" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          {/* 1. 个人数据卡片 */}
          {boundPlayer && (
            <PersonalStatsCard 
              player={boundPlayer}
              games={personalGames}
              civStats={personalCivStats}
              loading={personalLoading}
              mode={personalMode}
              onModeChange={handlePersonalModeChange}
            />
          )}

          {/* 2. 筛选器区域 */}
          <FilterSection 
            selectedLeaderboard={selectedLeaderboard}
            onSelectLeaderboard={setSelectedLeaderboard}
            selectedRating={selectedRating}
            onSelectRating={setSelectedRating}
            selectedMap={selectedMap}
            onSelectMap={setSelectedMap}
            mapData={mapData}
          />

          {/* 3. 统计列表 */}
          <View className="bg-white/95 rounded-3xl p-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">文明胜率排行</Text>
                <Text className="text-gray-500 text-sm">
                  {selectedMap 
                    ? (() => {
                        const selectedMapData = mapData?.data?.find(m => m && m.map_id === selectedMap);
                        const mapName = selectedMapData?.map_name || selectedMapData?.map || '';
                        return `${getChineseMapName(mapName) || mapName} 数据`;
                      })()
                    : '全地图数据'
                  }
                </Text>
              </View>
              <View className="flex-row items-center">
                <FontAwesome5 name="sort-amount-down" size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-1">按胜率排序</Text>
              </View>
            </View>

            {loading ? (
              <View className="space-y-3 py-4">
                 <View className="items-center"><ActivityIndicator color="#7c3aed" /></View>
                 <Text className="text-center text-gray-400">正在分析数据...</Text>
              </View>
            ) : error ? (
              <View className="py-8 items-center">
                <FontAwesome5 name="exclamation-circle" size={32} color="#ef4444" />
                <Text className="text-red-500 text-center mt-3 mb-4">{error}</Text>
                <TouchableOpacity onPress={fetchCivilizationStats} className="bg-red-500 rounded-2xl px-6 py-3">
                  <Text className="text-white font-medium">重试</Text>
                </TouchableOpacity>
              </View>
            ) : sortedCivs.length > 0 ? (
              <View>
                {sortedCivs.map((civ, index) => (
                  <CivilizationCard
                    key={`${civ.civilization}-${index}`}
                    civ={civ}
                    rank={index + 1}
                  />
                ))}
              </View>
            ) : (
              <View className="py-8 items-center">
                <FontAwesome5 name="search" size={32} color="#9ca3af" />
                <Text className="text-gray-500 text-center mt-3">暂无数据</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}