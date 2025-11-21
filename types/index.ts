// 搜索结果类型定义
// 说明：AoE4World 的玩家数据里，排位和快速匹配都会写在 leaderboards 字段里，
// 不同模式的字段结构是一样的，这里抽成一个通用类型，方便在各个模式之间复用。
export interface SearchResultLeaderboardEntry {
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

export interface SearchResult {
  profile_id: number;
  name: string;
  country?: string;
  avatars?: {
    small: string;
    medium: string;
    large: string;
  };
  // 覆盖 AoE4World 目前常见的几种模式，保持和 apiService.Player.leaderboards 一致
  leaderboards: {
    rm_solo?: SearchResultLeaderboardEntry; // 排位 1v1
    rm_team?: SearchResultLeaderboardEntry; // 排位 组队
    qm_1v1?: SearchResultLeaderboardEntry;  // 快速匹配 1v1
    qm_2v2?: SearchResultLeaderboardEntry;
    qm_3v3?: SearchResultLeaderboardEntry;
    qm_4v4?: SearchResultLeaderboardEntry;
  };
  last_game_at?: string;
}

// 应用状态类型
export interface AppState {
  activeTab: string;
  boundPlayerName?: string;
  showBindingPage: boolean;
}

// 导航标签类型
export interface NavigationTab {
  key: string;
  name: string;
  icon: string;
}

export interface GameSummaryPlayer {
  profileId: number;
  name: string;
  civilization: string;
  team: number;
  result: "win" | "loss";
  scores?: {
    total: number;
    military: number;
    economy: number;
    technology: number;
    society: number;
  };
  totalResourcesSpent?: {
    total: number;
    food: number;
    wood: number;
    gold: number;
    stone: number;
    oliveoil: number;
  };
  _stats?: {
    sqprod: number;
    sqkill: number;
    edeaths: number;
    structdmg: number;
    blost: number;
    upg: number;
    pcap: number;
    plost: number;
    precap: number;
  };
  apm?: number;
}

export interface GameSummary {
  gameId: number;
  duration: number;
  map: string;
  players: GameSummaryPlayer[];
} 