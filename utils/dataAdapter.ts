import { SearchResult, SearchResultLeaderboardEntry } from '../types';

export const normalizeLeaderboards = (player: any): {
  rm_solo?: SearchResultLeaderboardEntry;
  rm_team?: SearchResultLeaderboardEntry;
  qm_1v1?: SearchResultLeaderboardEntry;
  qm_2v2?: SearchResultLeaderboardEntry;
  qm_3v3?: SearchResultLeaderboardEntry;
  qm_4v4?: SearchResultLeaderboardEntry;
} => {
  const source = player?.leaderboards || player?.modes;
  if (!source) return {};

  const buildEntry = (mode: any | undefined): SearchResultLeaderboardEntry | undefined => {
    if (!mode) return undefined;
    return {
      rating: mode.rating ?? 0,
      rank: mode.rank ?? 0,
      rank_level: mode.rank_level ?? 'unranked',
      streak: mode.streak ?? 0,
      games_count: mode.games_count ?? 0,
      wins_count: mode.wins_count ?? 0,
      losses_count: mode.losses_count ?? 0,
      disputes_count: mode.disputes_count ?? 0,
      drops_count: mode.drops_count ?? 0,
      last_game_at: mode.last_game_at ?? player?.last_game_at ?? '',
      win_rate: mode.win_rate ?? 0,
      season: mode.season,
    };
  };

  return {
    rm_solo: buildEntry(source.rm_solo || source.rm_1v1 || source.rm_1v1_elo),
    rm_team: buildEntry(source.rm_team || source.rm_4v4_elo),
    qm_1v1: buildEntry(source.qm_1v1),
    qm_2v2: buildEntry(source.qm_2v2),
    qm_3v3: buildEntry(source.qm_3v3),
    qm_4v4: buildEntry(source.qm_4v4),
  };
};

export const transformPlayerData = (rawPlayer: any): SearchResult => {
  return {
    profile_id: rawPlayer.profile_id,
    name: rawPlayer.name,
    country: rawPlayer.country,
    avatars: rawPlayer.avatars,
    leaderboards: normalizeLeaderboards(rawPlayer),
    last_game_at: rawPlayer.last_game_at
  };
};