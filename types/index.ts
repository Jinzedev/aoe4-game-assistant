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