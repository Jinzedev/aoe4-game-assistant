// API服务层 - 用于接入官方游戏API
export interface PlayerStats {
  playerId: string;
  playerName: string;
  ranking1v1: number;
  rankingTeam: number;
  winRate: number;
  totalGames: number;
  eloScore: number;
  tier: string;
  recentGames: GameRecord[];
}

export interface GameRecord {
  gameId: string;
  mapName: string;
  gameMode: string;
  duration: string;
  isWin: boolean;
  playerElo: number;
  opponentName: string;
  opponentElo: number;
  eloChange: number;
  playedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// AoE4World API 服务
const API_BASE_URL = 'https://aoe4world.com/api/v0';

// 类型定义
export interface Player {
  profile_id: number;
  name: string;
  country?: string;
  steam_id?: string;
  avatars?: {
    small: string;
    medium: string;
    large: string;
  };
  leaderboards: {
    rm_solo?: LeaderboardEntry;
    rm_team?: LeaderboardEntry;
    qm_1v1?: LeaderboardEntry;
    qm_2v2?: LeaderboardEntry;
    qm_3v3?: LeaderboardEntry;
    qm_4v4?: LeaderboardEntry;
  };
  last_game_at?: string;
  verified?: boolean;
}

export interface LeaderboardEntry {
  rating: number;
  rank: number;
  rank_level: string;
  streak: number;
  games_count: number;
  wins_count: number;
  losses_count: number;
  disputes_count?: number;
  drops_count?: number;
  last_game_at: string;
  win_rate: number;
  season?: number;
}

export interface Game {
  game_id: number;
  started_at: string;
  updated_at: string;
  duration: number | null;
  map: string; // 简单字符串，不是对象
  kind: string; // "rm_1v1", "rm_2v2", etc.
  leaderboard: string; // "rm_solo", "rm_team", etc.
  mmr_leaderboard?: string;
  season: number;
  server: string;
  patch: number;
  average_rating: number;
  average_rating_deviation?: number | null;
  average_mmr?: number | null;
  average_mmr_deviation?: number | null;
  ongoing: boolean;
  just_finished: boolean;
  teams: PlayerWrapper[][]; // 二维数组结构
}

export interface PlayerWrapper {
  player: GamePlayer;
}

export interface Team {
  team_id: number;
  result: 'win' | 'loss';
  players: GamePlayer[];
}

export interface GamePlayer {
  profile_id: number;
  name: string;
  country?: string;
  result: 'win' | 'loss' | null;
  civilization: string; // 简化为字符串
  civilization_randomized?: boolean;
  rating: number | null;
  rating_diff: number | null;
  mmr: number | null;
  mmr_diff: number | null;
  input_type?: string;
}

export interface LeaderboardParams {
  leaderboard: 'rm_solo' | 'rm_team' | 'qm_1v1' | 'qm_2v2' | 'qm_3v3' | 'qm_4v4';
  page?: number;
  count?: number;
  search?: string;
}

export interface GameParams {
  page?: number;
  limit?: number;
  leaderboard?: string;
  opponent_profile_id?: number;
  since?: string | number;
  include_alts?: boolean;
}

export interface SearchParams {
  query: string;
  page?: number;
  exact?: boolean;
}

export interface StatsResponse {
  data: CivilizationStats[];
  leaderboard: string;
  patch: string;
  rank_level: string | null;
  rating: string | null;
}

export interface CivilizationStats {
  civilization: string; // API返回的是字符串，不是对象
  duration_average: number;
  duration_median: number;
  games_count: number;
  pick_rate: number;
  player_games_count: number;
  win_count: number;
  win_rate: number;
}

// 新增：地图统计数据相关类型
export interface MapStats {
  map_id: number;
  map_name?: string; // 可选，因为API可能返回map字段
  map?: string; // API实际返回的字段
  games_count: number;
  pick_rate?: number;
  duration_average: number;
  duration_median: number;
  win_rate?: number;
  highest_win_rate_civilization: string; // 该地图上胜率最高的文明
}

export interface MapStatsResponse {
  data: MapStats[];
  leaderboard: string;
  patch: string;
  rank_level: string | null;
  rating: string | null;
}

export interface MapCivilizationStatsResponse {
  data: CivilizationStats[];
  map: {
    map_id: number;
    map_name: string;
  };
  leaderboard: string;
  patch: string;
  rank_level: string | null;
  rating: string | null;
}

export interface MonthlyStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  rankChange: number | null;
  teamRankChange: number | null;
}

// API 服务类
class ApiService {
  private baseURL: string;

  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // 通用请求方法
  private async request<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const url = new URL(`${this.baseURL}${endpoint}`);
      
      if (params) {
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key].toString());
          }
        });
      }
      
      // 在终端显示请求信息
      console.log(`🚀 [API请求] 路径: ${endpoint}`);
      console.log(`📋 [API请求] 参数:`, params || '无参数');
      console.log(`🔗 [API请求] 完整URL: ${url.toString()}`);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [API错误] 响应:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ [API成功] 响应状态: ${response.status}`);
      return data;
    } catch (error) {
      console.error('💥 [API失败] 请求失败:', error);
      throw error;
    }
  }

  // ========== 玩家相关 API ==========
  
  // 获取玩家详细信息
  async getPlayer(profileId: number): Promise<Player> {
    return this.request<Player>(`/players/${profileId}`);
  }

  // 获取玩家游戏记录
  async getPlayerGames(profileId: number, params?: GameParams): Promise<{ games: Game[], count: number }> {
    return this.request(`/players/${profileId}/games`, params);
  }

  // 获取玩家特定游戏详情
  async getPlayerGame(profileId: number, gameId: number, includeAlts?: boolean): Promise<Game> {
    const params = includeAlts ? { include_alts: includeAlts } : undefined;
    return this.request<Game>(`/players/${profileId}/games/${gameId}`, params);
  }

  // 获取玩家最后一场游戏
  async getPlayerLastGame(profileId: number, includeStats?: boolean): Promise<Game> {
    const params = includeStats ? { include_stats: includeStats } : undefined;
    return this.request<Game>(`/players/${profileId}/games/last`, params);
  }

  // 搜索玩家
  async searchPlayers(params: SearchParams): Promise<{ players: Player[], count: number }> {
    if (params.query.length < 1) {
      throw new Error('搜索查询至少需要1个字符');
    }
    return this.request(`/players/search`, params);
  }

  // 玩家自动完成
  async autocompletePlayer(leaderboard: string, query: string, limit = 10): Promise<Player[]> {
    if (query.length < 1) {
      throw new Error('搜索查询至少需要1个字符');
    }
    return this.request(`/players/autocomplete`, { leaderboard, query, limit });
  }

  // ========== 排行榜 API ==========
  
  // 获取排行榜
  async getLeaderboard(params: LeaderboardParams): Promise<{ players: LeaderboardEntry[], count: number }> {
    return this.request(`/leaderboards/${params.leaderboard}`, params);
  }

  // ========== 游戏相关 API ==========
  
  // ========== 统计数据 API ==========
  
  // 获取文明统计数据
  async getCivilizationStats(leaderboard: string, patch?: string, rating?: string): Promise<StatsResponse> {
    const params: any = {};
    if (patch) params.patch = patch;
    if (rating) params.rating = rating;
    
    return this.request<StatsResponse>(`/stats/${leaderboard}/civilizations`, params);
  }

  // 获取地图统计数据
  async getMapStats(leaderboard: string, patch?: string, rating?: string): Promise<MapStatsResponse> {
    const params: any = {};
    if (patch) params.patch = patch;
    if (rating) params.rating = rating;
    
    return this.request<MapStatsResponse>(`/stats/${leaderboard}/maps`, params);
  }

  // 获取特定地图的文明统计
  async getMapCivilizationStats(leaderboard: string, mapId: number, patch?: string, rating?: string): Promise<MapCivilizationStatsResponse> {
    const params: any = {};
    if (patch) params.patch = patch;
    if (rating) params.rating = rating;
    
    return this.request<MapCivilizationStatsResponse>(`/stats/${leaderboard}/maps/${mapId}`, params);
  }

  // 获取组队统计数据 (仅限2v2)
  async getTeamStats(leaderboard: string, patch?: string, rating?: string): Promise<any> {
    const params: any = {};
    if (patch) params.patch = patch;
    if (rating) params.rating = rating;
    
    return this.request(`/stats/${leaderboard}/teams`, params);
  }

  // 新增：获取游戏详细分析数据（测试方法）
  async getGameSummary(profileId: number, gameId: number): Promise<any> {
    try {
      // 先尝试不带sig参数的情况
      const url = `https://aoe4world.com/players/${profileId}/games/${gameId}/summary?camelize=true`;
    
      // 在终端显示请求信息
      console.log(`🚀 [游戏分析] 路径: /players/${profileId}/games/${gameId}/summary`);
      console.log(`📋 [游戏分析] 参数: camelize=true`);
      console.log(`🔗 [游戏分析] 完整URL: ${url}`);
      
      const response = await fetch(url);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ [游戏分析] 请求失败:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ [游戏分析] 响应状态: ${response.status}`);
      
      return data;
    } catch (error) {
      console.log('💥 [游戏分析] 获取失败:', error);
      
    }
  }
}

// 创建API服务实例
export const apiService = new ApiService();

// 默认导出
export default apiService;

// ========== Mock 数据 (用于开发测试) ==========
export const mockData = {
  player: {
    profile_id: 4635035,
    name: "帝国征服者",
    country: "CN",
    avatars: {
      small: "https://avatars.akamai.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e.jpg",
      medium: "https://avatars.akamai.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_medium.jpg",
      large: "https://avatars.akamai.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg"
    },
    modes: {
      rm_solo: {
        leaderboard_id: "rm_solo",
        profile_id: 4635035,
        elo: 1247,
        rank: 1247,
        tier: "diamond",
        wins: 114,
        losses: 42,
        win_rate: 73.08,
        games_count: 156,
        streak: 3,
        last_match_at: "2024-01-15T10:30:00Z"
      }
    },
    verified: true
  },

  recentGames: [
    {
      game_id: 123456789,
      started_at: "2024-01-15T10:30:00Z",
      duration: 1860,
      map: { map_id: 1, name: "阿拉伯" },
      kind: "rm_1v1",
      leaderboard: "rm_solo",
      teams: [
        {
          team_id: 1,
          result: "win" as const,
          players: [{
            profile_id: 4635035,
            name: "帝国征服者",
            elo: 1247,
            elo_rating: 1247,
            elo_change: 12,
            civilization: { item_id: 1, name: "英格兰", abbreviation: "ENG" },
            result: "win" as const
          }]
        },
        {
          team_id: 2,
          result: "loss" as const,
          players: [{
            profile_id: 9876543,
            name: "对手玩家",
            elo: 1198,
            elo_rating: 1198,
            elo_change: -12,
            civilization: { item_id: 2, name: "法兰西", abbreviation: "FRE" },
            result: "loss" as const
          }]
        }
      ]
    }
  ]
};

// ========== 辅助函数 ==========

// 格式化段位名称
export const formatTier = (tier: string): string => {
  const tierMap: Record<string, string> = {
    'bronze': '青铜',
    'silver': '白银',
    'gold': '黄金',
    'platinum': '铂金',
    'diamond': '钻石',
    'conqueror': '征服者'
  };
  return tierMap[tier] || tier;
};

// 格式化段位等级
export const formatRankLevel = (rankLevel: string): string => {
  if (!rankLevel) return '未排名';
  
  const rankMap: Record<string, string> = {
    // 未排名状态
    'unranked': '未排名',
    
    // 青铜段位
    'bronze_1': '青铜1',
    'bronze_2': '青铜2',
    'bronze_3': '青铜3',
    
    // 白银段位
    'silver_1': '白银1',
    'silver_2': '白银2',
    'silver_3': '白银3',
    
    // 黄金段位
    'gold_1': '黄金1',
    'gold_2': '黄金2',
    'gold_3': '黄金3',
    
    // 铂金段位
    'platinum_1': '铂金1',
    'platinum_2': '铂金2',
    'platinum_3': '铂金3',
    
    // 钻石段位
    'diamond_1': '钻石1',
    'diamond_2': '钻石2',
    'diamond_3': '钻石3',
    
    // 征服者段位
    'conqueror_1': '征服者1',
    'conqueror_2': '征服者2',
    'conqueror_3': '征服者3',
    'conqueror_4': '征服者4'
  };
  
  return rankMap[rankLevel] || rankLevel;
};

// 根据段位等级获取对应图标
export const getRankIcon = (rankLevel: string): string => {
  if (!rankLevel) return '❓';
  
  // 提取段位类型（去掉数字部分）
  const rankType = rankLevel.split('_')[0];
  
  const iconMap: Record<string, string> = {
    'bronze': '🟤',      // 青铜 - 棕色圆圈
    'silver': '⚪',      // 白银 - 白色圆圈  
    'gold': '🟡',       // 黄金 - 黄色圆圈
    'platinum': '🔷',    // 铂金 - 蓝色菱形
    'diamond': '💎',     // 钻石 - 钻石
    'conqueror': '👑',   // 征服者 - 皇冠
    'unranked': '❓'     // 未排名 - 问号
  };
  
  return iconMap[rankType] || '❓';
};

// 格式化游戏时长
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 格式化ELO变化
export const formatEloChange = (change?: number): string => {
  if (!change) return '';
  return change > 0 ? `+${change}` : `${change}`;
};

// 获取文明颜色
export const getCivilizationColor = (abbreviation: string): string => {
  const colorMap: Record<string, string> = {
    'ENG': '#1e40af', // 英格兰 - 蓝色
    'FRE': '#7c3aed', // 法兰西 - 紫色
    'HRE': '#dc2626', // 神圣罗马帝国 - 红色
    'RUS': '#059669', // 罗斯 - 绿色
    'CHI': '#d97706', // 中国 - 橙色
    'ABB': '#0891b2', // 阿拔斯王朝 - 青色
    'DEL': '#7c2d12', // 德里苏丹国 - 棕色
    'MON': '#4338ca', // 蒙古 - 靛青色
  };
  return colorMap[abbreviation] || '#6b7280';
};

// 计算本月统计数据
export const calculateMonthlyStats = (games: Game[], playerId?: number): MonthlyStats => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // 本月第一天
  const monthStart = new Date(currentYear, currentMonth, 1);
  
  // 筛选本月的游戏
  const monthlyGames = games.filter(game => {
    const gameDate = new Date(game.started_at);
    return gameDate >= monthStart;
  });
  
      console.log(`📊 [月度统计] 总共${games.length}场游戏，本月${monthlyGames.length}场`);
  
  if (monthlyGames.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      rankChange: null,
      teamRankChange: null
    };
  }
  
  // 计算胜负
  let wins = 0;
  let losses = 0;
  let validGames = 0; // 有效游戏计数
  
  monthlyGames.forEach((game, index) => {
    // 验证游戏数据结构
    if (!game.teams || !Array.isArray(game.teams)) {
      return;
    }
    
    // 找到玩家所在的队伍（修正数据结构）
    let playerResult: string | null = null;
    
    // API返回的teams是二维数组，每个team是一个数组，包含玩家对象
    for (const team of game.teams) {
      if (Array.isArray(team)) {
        for (const playerWrapper of team) {
          if (playerWrapper.player && playerWrapper.player.profile_id === playerId) {
            playerResult = playerWrapper.player.result;
            break;
          }
        }
      }
      if (playerResult) break;
    }
    
    // 统计有效的游戏结果
    if (playerResult === 'win') {
      wins++;
      validGames++;
    } else if (playerResult === 'loss') {
      losses++;
      validGames++;
    }
    // 忽略result为null的游戏（通常是正在进行或异常的游戏）
  });
  
  const totalGames = validGames; // 使用有效游戏数量
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  
  console.log(`📊 [月度结果] ${wins}胜${losses}负，总计${totalGames}场有效游戏，胜率${winRate.toFixed(1)}%`);
  
  return {
    totalGames,
    wins,
    losses,
    winRate,
    rankChange: null, // 需要更复杂的逻辑来计算排名变化
    teamRankChange: null
  };
};

// 获取国旗emoji
export const getCountryFlag = (countryCode: string): string => {
  if (!countryCode) return '🌍';
  
  // 转换为大写以确保匹配
  const upperCode = countryCode.toUpperCase();
  
  const flagMap: Record<string, string> = {
    'CN': '🇨🇳', // 中国
    'US': '🇺🇸', // 美国
    'DE': '🇩🇪', // 德国
    'FR': '🇫🇷', // 法国
    'GB': '🇬🇧', // 英国
    'JP': '🇯🇵', // 日本
    'KR': '🇰🇷', // 韩国
    'RU': '🇷🇺', // 俄罗斯
    'CA': '🇨🇦', // 加拿大
    'AU': '🇦🇺', // 澳大利亚
    'BR': '🇧🇷', // 巴西
    'IT': '🇮🇹', // 意大利
    'ES': '🇪🇸', // 西班牙
    'NL': '🇳🇱', // 荷兰
    'SE': '🇸🇪', // 瑞典
    'NO': '🇳🇴', // 挪威
    'DK': '🇩🇰', // 丹麦
    'FI': '🇫🇮', // 芬兰
    'PL': '🇵🇱', // 波兰
    'CZ': '🇨🇿', // 捷克
    'AT': '🇦🇹', // 奥地利
    'CH': '🇨🇭', // 瑞士
    'BE': '🇧🇪', // 比利时
    'PT': '🇵🇹', // 葡萄牙
    'MX': '🇲🇽', // 墨西哥
    'AR': '🇦🇷', // 阿根廷
    'TR': '🇹🇷', // 土耳其
    'IN': '🇮🇳', // 印度
    'TH': '🇹🇭', // 泰国
    'VN': '🇻🇳', // 越南
    'SG': '🇸🇬', // 新加坡
    'MY': '🇲🇾', // 马来西亚
    'ID': '🇮🇩', // 印度尼西亚
    'PH': '🇵🇭', // 菲律宾
    'TW': '🇹🇼', // 台湾
    'HK': '🇭🇰', // 香港
    'ZA': '🇿🇦', // 南非
    'EG': '🇪🇬', // 埃及
    'IL': '🇮🇱', // 以色列
    'AE': '🇦🇪', // 阿联酋
    'SA': '🇸🇦', // 沙特阿拉伯
    'UA': '🇺🇦', // 乌克兰
  };
  
  return flagMap[upperCode] || '🌍';
}; 