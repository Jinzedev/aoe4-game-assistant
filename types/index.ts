// 搜索结果类型定义
export interface SearchResult {
  profile_id: number;
  name: string;
  country?: string;
  avatars?: {
    small: string;
    medium: string;
    large: string;
  };
  leaderboards: {
    rm_solo?: {
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
    };
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

// Build Order 相关类型定义
export interface BuildOrderItem {
  id: string;
  icon: string;  // 图标路径，如 "icons/races/hre_historic/units/gilded_villager"
  pbgid: number;
  modid: string | null;
  type: "Unit" | "Building" | "Upgrade" | "Age" | "Animal";
  finished: number[];  // 完成时间数组，每个数字代表一个单位完成的游戏内秒数
  constructed: number[];
  packed: number[];
  unpacked: number[];
  transformed: number[];
  destroyed: number[];
  unknown: Record<string, number[]>;
}

export interface ParsedBuildOrderItem {
  time: number;
  formattedTime: string;
  type: "Unit" | "Building" | "Upgrade" | "Age" | "Animal";
  name: string;
  icon: string;
  iconUrl: string;
  id: string;
  count?: number;
}

export interface GameSummaryPlayer {
  profileId: number;
  name: string;
  civilization: string;
  team: number;
  result: "win" | "loss";
  buildOrder: BuildOrderItem[];
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