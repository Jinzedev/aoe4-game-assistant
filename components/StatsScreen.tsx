import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService, StatsResponse, CivilizationStats, Game, MapStatsResponse, MapStats } from '../services/apiService';
import { getCivilizationInfo } from '../services/civilizationImages';
import { getMapInfo, getChineseMapName } from '../services/mapImages';
import { StorageService } from '../services/storageService';
import { SearchResult } from '../types';

const { width } = Dimensions.get('window');

// 排行榜选项配置
const LEADERBOARD_OPTIONS = [
  { key: 'rm_solo', name: '1v1', icon: 'user', color: '#3b82f6' },
  { key: 'rm_2v2', name: '团队2v2', icon: 'users', color: '#8b5cf6' },
  { key: 'rm_3v3', name: '团队3v3', icon: 'users', color: '#8b5cf6' },
  { key: 'rm_4v4', name: '团队4v4', icon: 'users', color: '#8b5cf6' },
  { key: 'qm_1v1', name: '快速1v1', icon: 'bolt', color: '#f59e0b' },
  { key: 'qm_2v2', name: '快速2v2', icon: 'user-friends', color: '#10b981' },
  { key: 'qm_3v3', name: '快速3v3', icon: 'user-friends', color: '#10b981' },
  { key: 'qm_4v4', name: '快速4v4', icon: 'user-friends', color: '#10b981' },
];

// 排位模式(rm_solo, rm_2v2, rm_3v3, rm_4v4)的分段选项
const RM_RATING_OPTIONS = [
  { key: '', name: '全部', color: '#6b7280' },
  { key: '<699', name: '青铜', color: '#92400e' },
  { key: '700-999', name: '白银', color: '#6b7280' },
  { key: '1000-1199', name: '黄金', color: '#d97706' },
  { key: '1200-1399', name: '铂金', color: '#0891b2' },
  { key: '>1400', name: '钻石', color: '#7c3aed' },
  { key: '>1700', name: '征服者', color: '#dc2626' },
];

// 快速匹配(qm_*)的分段选项
const QM_RATING_OPTIONS = [
  { key: '', name: '全部', color: '#6b7280' },
  { key: '<899', name: '青铜', color: '#92400e' },
  { key: '900-999', name: '白银', color: '#6b7280' },
  { key: '1000-1099', name: '黄金', color: '#d97706' },
  { key: '1100-1199', name: '铂金', color: '#0891b2' },
  { key: '1200-1299', name: '钻石', color: '#7c3aed' },
  { key: '>1300', name: '征服者', color: '#dc2626' },
];

interface CivilizationCardProps {
  civ: CivilizationStats;
  rank: number;
}

// 文明卡片组件
function CivilizationCard({ civ, rank }: CivilizationCardProps) {
  const civInfo = getCivilizationInfo(civ.civilization);
  const civImage = civInfo.imageUrl;
  
  // 统一的排名配色方案
  const rankColor = '#6366f1'; // 统一使用紫色主题
  const rankColorLight = '#e0e7ff'; // 浅色背景

      return (
      <View className="mb-3">
        <View
          className="bg-white/95 rounded-2xl p-4 shadow-sm"
          style={{
            borderWidth: 1,
            borderColor: '#e5e7eb'
          }}
        >
          <View className="flex-row items-center">
            {/* 排名徽章 */}
            <View 
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: rankColor }}
            >
              <Text className="text-white font-bold text-xs">
                {rank}
              </Text>
            </View>

            {/* 文明图片 - 圆形 */}
            <View 
              className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-white items-center justify-center"
              style={{ borderWidth: 2, borderColor: '#e5e7eb' }}
            >
              {civImage ? (
                <Image 
                  source={{ uri: civImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome5 name="chess-pawn" size={20} color="#6b7280" />
              )}
            </View>

            {/* 文明信息和统计 */}
            <View className="flex-1">
              {/* 第一行：文明名称和胜率 */}
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-bold text-lg text-gray-800">
                  {civInfo.name}
                </Text>
                <Text 
                  className="text-2xl font-bold"
                  style={{ color: rankColor }}
                >
                  {(civ.win_rate || 0).toFixed(1)}%
                </Text>
              </View>
              
              {/* 第二行：详细统计信息 */}
              <View className="flex-row items-center space-x-4">
                <Text className="text-sm text-gray-600">
                  {(civ.games_count || 0).toLocaleString()}场比赛
                </Text>
                <Text className="text-sm text-gray-600">
                  使用率 {(civ.pick_rate || 0).toFixed(1)}%
                </Text>
              </View>
              
              {/* 第三行：胜率进度条 */}
              <View className="mt-3">
                <View className="w-full bg-gray-200 rounded-full h-2">
                  <View 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${Math.min(civ.win_rate || 0, 100)}%`,
                      backgroundColor: rankColor
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
}

export function StatsScreen() {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('rm_solo');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedMap, setSelectedMap] = useState<number | null>(null);
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
  const [mapData, setMapData] = useState<MapStatsResponse | null>(null);
  const [loading, setLoading] = useState(true); // 初始状态为加载中
  const [error, setError] = useState<string | null>(null);
  const [showLeaderboardDropdown, setShowLeaderboardDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showMapDropdown, setShowMapDropdown] = useState(false);
  
  // 个人数据状态
  const [boundPlayer, setBoundPlayer] = useState<SearchResult | null>(null);
  const [personalGames, setPersonalGames] = useState<Game[]>([]);
  const [personalCivStats, setPersonalCivStats] = useState<Map<string, {wins: number, total: number, winRate: number}>>(new Map());

  // 获取文明统计数据
  const fetchCivilizationStats = async () => {
    if (!selectedLeaderboard) return;

    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 获取文明统计数据:', { 
        leaderboard: selectedLeaderboard, 
        rating: selectedRating,
        mapId: selectedMap 
      });
      
      let data: StatsResponse;
      
      if (selectedMap) {
        // 获取特定地图的文明统计
        const mapCivData = await apiService.getMapCivilizationStats(
          selectedLeaderboard,
          selectedMap,
          undefined, // patch参数，使用当前patch
          selectedRating || undefined // rating参数
        );
        data = {
          data: mapCivData.data,
          leaderboard: mapCivData.leaderboard,
          patch: mapCivData.patch,
          rank_level: mapCivData.rank_level,
          rating: mapCivData.rating
        };
      } else {
        // 获取全局文明统计
        data = await apiService.getCivilizationStats(
          selectedLeaderboard, 
          undefined, // patch参数，使用当前patch
          selectedRating || undefined // rating参数
        );
      }
      
      setStatsData(data);
    } catch (err) {
      console.error('❌ 获取文明统计数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
      setStatsData(null); // 清空之前的数据
    } finally {
      setLoading(false);
    }
  };

  // 测试地图API的临时函数
  const testMapAPI = async () => {
    console.log('🧪 开始测试地图API...');
    
    const testCases = [
      { leaderboard: 'rm_solo', name: '排位1v1' },
      { leaderboard: 'rm_2v2', name: '排位2v2' },
      { leaderboard: 'rm_3v3', name: '排位3v3' },
      { leaderboard: 'rm_4v4', name: '排位4v4' },
      { leaderboard: 'qm_1v1', name: '快速1v1' },
      { leaderboard: 'qm_2v2', name: '快速2v2' }
    ];
    
    for (const testCase of testCases) {
      try {
        console.log(`🔍 测试 ${testCase.name} (${testCase.leaderboard})...`);
        const response = await fetch(`https://aoe4world.com/api/v0/stats/${testCase.leaderboard}/maps`);
        console.log(`📡 ${testCase.name} 响应状态:`, response.status);
        
        if (response.ok) {
          const data = await response.json();
          const maps = data?.data?.slice(0, 5).map((m: any) => ({
            name: m.map_name || m.map,
            games: m.games_count
          })) || [];
          
          console.log(`✅ ${testCase.name} 数据:`, {
            mapCount: data?.data?.length || 0,
            leaderboard: data?.leaderboard,
            patch: data?.patch,
            topMaps: maps
          });
        } else {
          const errorText = await response.text();
          console.log(`❌ ${testCase.name} 错误:`, response.status, errorText);
        }
      } catch (error) {
        console.error(`💥 ${testCase.name} 异常:`, error);
      }
    }
  };

  // 获取地图数据
  const fetchMapData = async () => {
    if (!selectedLeaderboard) return;

    try {
      console.log(`🔍 请求地图数据: leaderboard=${selectedLeaderboard}, rating=${selectedRating || 'undefined'}`);
      
      const data = await apiService.getMapStats(
        selectedLeaderboard,
        undefined, // patch参数，使用当前patch
        selectedRating || undefined // rating参数
      );
      
      // 详细的地图数据日志
      const validMaps = data?.data?.filter(m => m && (m.map_name || m.map)) || [];
      console.log(`🗺️ 已加载 ${validMaps.length} 个地图 (${selectedLeaderboard} - ${data?.patch})`);
      
      setMapData(data);
    } catch (err) {
      console.error('❌ 获取地图数据失败:', err);
      setMapData(null);
    }
  };

  // 获取个人数据
  const fetchPersonalData = async () => {
    try {
      // 使用新的存储策略：获取玩家ID
      const playerId = await StorageService.getBoundPlayerId();
      if (!playerId) {
        console.log('📝 未绑定玩家，跳过个人数据获取');
        return;
      }
      
      // 根据ID获取最新的玩家数据
      const latestPlayerData = await apiService.getPlayer(playerId);
      
      // 构建 SearchResult 对象
      const player: SearchResult = {
        profile_id: latestPlayerData.profile_id,
        name: latestPlayerData.name,
        country: latestPlayerData.country,
        avatars: latestPlayerData.avatars,
        leaderboards: latestPlayerData.leaderboards,
        last_game_at: latestPlayerData.last_game_at
      };
      
      setBoundPlayer(player);
      console.log('👤 获取个人游戏数据:', player.name);
      
      // 获取最近的游戏记录（限制500场以避免API限制）
      const gameData = await apiService.getPlayerGames(player.profile_id, {
        limit: 500,
        leaderboard: selectedLeaderboard.includes('rm_') ? selectedLeaderboard.replace('rm_', 'rm_') : selectedLeaderboard.replace('qm_', 'qm_')
      });
      
      setPersonalGames(gameData.games);
      
      // 计算文明使用统计
      const civStatsMap = new Map<string, {wins: number, total: number, winRate: number}>();
      
      gameData.games.forEach(game => {
        // 找到当前玩家的数据
        const playerData = game.teams.flat().find(teamWrapper => 
          teamWrapper.player.profile_id === player.profile_id
        );
        
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
      
      setPersonalCivStats(civStatsMap);
      console.log('✅ 个人文明统计计算完成:', civStatsMap.size, '个文明');
      
    } catch (err) {
      console.error('❌ 获取个人数据失败:', err);
    }
  };

  // 当排行榜切换时，重置分段选择
  useEffect(() => {
    setSelectedRating(''); // 重置为"全部"
    setSelectedMap(null); // 重置地图选择
  }, [selectedLeaderboard]);

  // 页面加载时获取数据
  useEffect(() => {
    fetchCivilizationStats();
    fetchMapData();
    fetchPersonalData();
  }, [selectedLeaderboard, selectedRating, selectedMap]);

  // 初始加载个人数据
  useEffect(() => {
    fetchPersonalData();
  }, []);

  // 按胜率排序文明数据
  const sortedCivs = statsData?.data ? 
    [...statsData.data].sort((a, b) => b.win_rate - a.win_rate) : [];

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
              <Text className="text-2xl font-bold text-white">文明统计</Text>
              <Text className="text-white/60">全球文明胜率分析</Text>
            </View>
            <TouchableOpacity 
              className="bg-white/10 rounded-2xl p-3"
              onPress={fetchCivilizationStats}
            >
              <FontAwesome5 name="sync-alt" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 内容 */}
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          
          {/* 个人文明使用情况 */}
          {boundPlayer && personalCivStats.size > 0 && (
            <View className="bg-white/95 rounded-3xl p-6 mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-lg font-bold text-gray-800">我的文明使用情况</Text>
                  <Text className="text-gray-500 text-sm">{boundPlayer.name}</Text>
                </View>
                <View className="bg-purple-100 rounded-full px-3 py-1">
                  <Text className="text-purple-700 font-medium text-sm">
                    {personalGames.length}场比赛
                  </Text>
                </View>
              </View>
              
              {/* 文明使用统计 */}
              <View className="space-y-3">
                {Array.from(personalCivStats.entries())
                  .sort(([,a], [,b]) => b.total - a.total) // 按使用次数排序
                  .slice(0, 6) // 显示前6个文明
                  .map(([civilization, stats], index) => {
                    const civInfo = getCivilizationInfo(civilization);
                    // 扩展的颜色方案：金蓝铜 + 紫色系
                    const rankColors = [
                      '#f59e0b', // 金色 - 第1名
                      '#3b82f6', // 蓝色 - 第2名
                      '#cd7f32', // 铜色 - 第3名
                      '#8b5cf6', // 紫色 - 第4名
                      '#06b6d4', // 青色 - 第5名
                      '#10b981'  // 绿色 - 第6名
                    ];
                    const rankColor = rankColors[index] || '#6b7280';
                    
                    return (
                      <View key={civilization} className="bg-gray-50 rounded-2xl p-4">
                        <View className="flex-row items-center">
                          {/* 排名徽章 */}
                          <View 
                            className="w-8 h-8 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: rankColor }}
                          >
                            <Text className="text-white font-bold text-sm">
                              {index + 1}
                            </Text>
                          </View>
                          
                          {/* 文明图标 */}
                          <Image 
                            source={{ uri: civInfo.imageUrl }} 
                            className="w-10 h-10 rounded-xl mr-3"
                            resizeMode="cover"
                          />
                          
                          {/* 文明信息 */}
                          <View className="flex-1">
                            <Text className="font-bold text-gray-800">
                              {civInfo.name}
                            </Text>
                            <Text className="text-gray-600 text-sm">
                              {stats.total}场 • {stats.wins}胜{stats.total - stats.wins}负
                            </Text>
                          </View>
                          
                          {/* 胜率 */}
                          <View className="items-end">
                            <Text 
                              className="text-xl font-bold"
                              style={{ color: rankColor }}
                            >
                              {stats.winRate.toFixed(1)}%
                            </Text>
                            <Text className="text-gray-500 text-xs">胜率</Text>
                          </View>
                        </View>
                        
                        {/* 胜率进度条 */}
                        <View className="mt-3">
                          <View className="w-full bg-gray-200 rounded-full h-2">
                            <View 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${Math.min(stats.winRate, 100)}%`,
                                backgroundColor: rankColor
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  })}
              </View>
              
              {/* 查看更多按钮 */}
              {personalCivStats.size > 6 && (
                <TouchableOpacity className="mt-4 bg-purple-50 rounded-2xl p-3">
                  <Text className="text-purple-700 font-medium text-center">
                    查看全部 {personalCivStats.size} 个文明数据
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {/* 模式和分段选择器 */}
          <View className="bg-white/95 rounded-3xl p-6 mb-4">
            <View className="flex-row space-x-4 mb-4">
              {/* 模式选择下拉菜单 */}
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800 mb-3">选择模式</Text>
                <TouchableOpacity
                  onPress={() => setShowLeaderboardDropdown(!showLeaderboardDropdown)}
                  className="bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    <FontAwesome5 
                      name={LEADERBOARD_OPTIONS.find(opt => opt.key === selectedLeaderboard)?.icon as any} 
                      size={16} 
                      color={LEADERBOARD_OPTIONS.find(opt => opt.key === selectedLeaderboard)?.color || '#6b7280'} 
                    />
                    <Text className="ml-2 font-medium text-gray-700">
                      {LEADERBOARD_OPTIONS.find(opt => opt.key === selectedLeaderboard)?.name || '选择模式'}
                    </Text>
                  </View>
                  <FontAwesome5 
                    name={showLeaderboardDropdown ? "chevron-up" : "chevron-down"} 
                    size={12} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
                
                {/* 下拉选项 */}
                {showLeaderboardDropdown && (
                  <View className="mt-2 bg-white rounded-2xl shadow-lg border border-gray-200">
                    {/* 排位模式组 */}
                    <View className="px-3 py-2 border-b border-gray-100">
                      <Text className="text-xs font-medium text-gray-500 mb-1">排位模式</Text>
                      {LEADERBOARD_OPTIONS.filter(option => option.key.startsWith('rm_')).map((option) => (
                        <TouchableOpacity
                          key={option.key}
                          onPress={() => {
                            setSelectedLeaderboard(option.key);
                            setShowLeaderboardDropdown(false);
                          }}
                          className={`py-2 px-2 rounded-xl flex-row items-center ${
                            selectedLeaderboard === option.key ? 'bg-purple-50' : ''
                          }`}
                        >
                          <FontAwesome5 
                            name={option.icon as any} 
                            size={14} 
                            color={option.color} 
                          />
                          <Text 
                            className={`ml-2 font-medium ${
                              selectedLeaderboard === option.key 
                                ? 'text-purple-700' 
                                : 'text-gray-700'
                            }`}
                          >
                            {option.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    {/* 快速匹配组 */}
                    <View className="px-3 py-2">
                      <Text className="text-xs font-medium text-gray-500 mb-1">快速匹配</Text>
                      {LEADERBOARD_OPTIONS.filter(option => option.key.startsWith('qm_')).map((option) => (
                        <TouchableOpacity
                          key={option.key}
                          onPress={() => {
                            setSelectedLeaderboard(option.key);
                            setShowLeaderboardDropdown(false);
                          }}
                          className={`py-2 px-2 rounded-xl flex-row items-center ${
                            selectedLeaderboard === option.key ? 'bg-purple-50' : ''
                          }`}
                        >
                          <FontAwesome5 
                            name={option.icon as any} 
                            size={14} 
                            color={option.color} 
                          />
                          <Text 
                            className={`ml-2 font-medium ${
                              selectedLeaderboard === option.key 
                                ? 'text-purple-700' 
                                : 'text-gray-700'
                            }`}
                          >
                            {option.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* 分段选择下拉菜单 */}
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800 mb-3">选择分段</Text>
                <TouchableOpacity
                  onPress={() => setShowRatingDropdown(!showRatingDropdown)}
                  className="bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className="font-medium text-gray-700">
                    {(selectedLeaderboard.startsWith('rm_') ? RM_RATING_OPTIONS : QM_RATING_OPTIONS)
                      .find(opt => opt.key === selectedRating)?.name || '全部'}
                  </Text>
                  <FontAwesome5 
                    name={showRatingDropdown ? "chevron-up" : "chevron-down"} 
                    size={12} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
                
                {/* 下拉选项 */}
                {showRatingDropdown && (
                  <View className="mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 max-h-48">
                    <ScrollView 
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                    >
                      {(selectedLeaderboard.startsWith('rm_') ? RM_RATING_OPTIONS : QM_RATING_OPTIONS).map((option) => (
                        <TouchableOpacity
                          key={option.key}
                          onPress={() => {
                            setSelectedRating(option.key);
                            setShowRatingDropdown(false);
                          }}
                          className={`py-3 px-4 flex-row items-center ${
                            selectedRating === option.key ? 'bg-purple-50' : ''
                          }`}
                        >
                          <Text 
                            className={`font-medium ${
                              selectedRating === option.key 
                                ? 'text-purple-700' 
                                : 'text-gray-700'
                            }`}
                          >
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
            <View>
              <Text className="text-lg font-bold text-gray-800 mb-3">
                选择地图 (可选) {mapData?.data?.length ? `- ${mapData.data.length}个地图` : '- 加载中...'}
                {__DEV__ && mapData?.data?.length === 0 && <Text className="text-red-500 text-xs"> (数据为空)</Text>}
              </Text>

              <TouchableOpacity
                onPress={() => setShowMapDropdown(!showMapDropdown)}
                className="bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <FontAwesome5 name="map" size={16} color="#6b7280" />
                  <Text className="ml-2 font-medium text-gray-700">
                    {selectedMap 
                      ? (() => {
                          const selectedMapData = mapData?.data?.find(mapItem => mapItem && mapItem.map_id === selectedMap);
                          const mapName = selectedMapData?.map_name || selectedMapData?.map || '';
                          const chineseName = getChineseMapName(mapName);
                          return chineseName || mapName || '未知地图';
                        })()
                      : '全部地图'
                    }
                  </Text>
                </View>
                <FontAwesome5 
                  name={showMapDropdown ? "chevron-up" : "chevron-down"} 
                  size={12} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
              
              {/* 地图下拉选项 */}
              {showMapDropdown && (
                <View className="mt-2 bg-white rounded-2xl shadow-lg border border-gray-200" style={{ maxHeight: 400 }}>
                  <ScrollView 
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {/* 全部地图选项 */}
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedMap(null);
                        setShowMapDropdown(false);
                      }}
                      className={`py-3 px-4 flex-row items-center ${
                        selectedMap === null ? 'bg-purple-50' : ''
                      }`}
                    >
                      <FontAwesome5 name="globe" size={16} color="#6b7280" />
                      <Text 
                        className={`ml-3 font-medium ${
                          selectedMap === null 
                            ? 'text-purple-700' 
                            : 'text-gray-700'
                        }`}
                      >
                        全部地图
                      </Text>
                    </TouchableOpacity>
                    
                    {/* 地图加载状态或错误提示 */}
                    {!mapData?.data && (
                      <View className="py-3 px-4">
                        <Text className="text-gray-500 text-center">正在加载地图数据...</Text>
                      </View>
                    )}
                    
                    {mapData?.data?.length === 0 && (
                      <View className="py-3 px-4">
                        <Text className="text-gray-500 text-center">暂无地图数据</Text>
                      </View>
                    )}
                    
                    {/* 具体地图选项 */}
                    {mapData?.data
                      ?.filter(mapData => {
                        return mapData && (mapData.map_name || mapData.map);
                      }) // 过滤无效数据
                      .sort((a, b) => b.games_count - a.games_count) // 按游戏数量排序
                      .map((mapItem) => {
                        const mapName = mapItem.map_name || mapItem.map || '';
                        const mapInfo = getMapInfo(mapName);
                        const chineseName = getChineseMapName(mapName);
                        return (
                          <TouchableOpacity
                            key={mapItem.map_id}
                            onPress={() => {
                              setSelectedMap(mapItem.map_id);
                              setShowMapDropdown(false);
                            }}
                            className={`py-3 px-4 flex-row items-center ${
                              selectedMap === mapItem.map_id ? 'bg-purple-50' : ''
                            }`}
                          >
                            {mapInfo.imageUrl ? (
                              <Image 
                                source={{ uri: mapInfo.imageUrl }} 
                                className="w-8 h-8 rounded-lg mr-3"
                                resizeMode="cover"
                              />
                            ) : (
                              <View 
                                className="w-8 h-8 rounded-lg mr-3 items-center justify-center"
                                style={{ backgroundColor: mapInfo.color }}
                              >
                                <FontAwesome5 name="map" size={12} color="white" />
                              </View>
                            )}
                            <View className="flex-1">
                              <Text 
                                className={`font-medium ${
                                  selectedMap === mapItem.map_id 
                                    ? 'text-purple-700' 
                                    : 'text-gray-700'
                                }`}
                              >
                                {chineseName || mapName || '未知地图'}
                              </Text>
                              <Text className="text-xs text-gray-500">
                                {mapItem.games_count?.toLocaleString() || '0'}场 • {(() => {
                                  const civName = mapItem.highest_win_rate_civilization;
                                  if (!civName) return '未知';
                                  const civInfo = getCivilizationInfo(civName);
                                  return civInfo.name;
                                })()}最强
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

          {/* 文明胜率排行 */}
          <View className="bg-white/95 rounded-3xl p-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">文明胜率排行</Text>
                <Text className="text-gray-500 text-sm">
                  {selectedMap 
                    ? (() => {
                        const selectedMapData = mapData?.data?.find(mapItem => mapItem && mapItem.map_id === selectedMap);
                        const mapName = selectedMapData?.map_name || selectedMapData?.map || '';
                        const chineseName = getChineseMapName(mapName);
                        return `${chineseName || mapName || '特定地图'}数据`;
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
              // 加载状态
              <View className="space-y-3">
                {[1, 2, 3, 4, 5].map((index) => (
                  <View key={index} className="animate-pulse">
                    <View className="bg-gray-100 rounded-2xl p-4">
                      <View className="flex-row items-center">
                        <View className="w-8 h-8 bg-gray-200 rounded-full mr-3" />
                        <View className="w-12 h-12 bg-gray-200 rounded-xl mr-4" />
                        <View className="flex-1">
                          <View className="w-24 h-4 bg-gray-200 rounded mb-2" />
                          <View className="w-16 h-3 bg-gray-200 rounded" />
                </View>
                <View className="items-end">
                          <View className="w-12 h-6 bg-gray-200 rounded mb-2" />
                          <View className="w-8 h-3 bg-gray-200 rounded" />
                </View>
              </View>
                  </View>
                  </View>
                ))}
                </View>
            ) : error ? (
              // 错误状态
              <View className="py-8 items-center">
                <FontAwesome5 name="exclamation-circle" size={32} color="#ef4444" />
                <Text className="text-red-500 text-center mt-3 mb-4">{error}</Text>
                <TouchableOpacity
                  onPress={fetchCivilizationStats}
                  className="bg-red-500 rounded-2xl px-6 py-3"
                >
                  <Text className="text-white font-medium">重试</Text>
                </TouchableOpacity>
                </View>
            ) : sortedCivs.length > 0 ? (
              // 文明列表
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
              // 空状态
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