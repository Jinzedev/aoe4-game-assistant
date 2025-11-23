
export const LEADERBOARD_OPTIONS = [
    { key: 'rm_solo', name: '1v1', icon: 'user', color: '#3b82f6' },
    { key: 'rm_2v2', name: '团队2v2', icon: 'users', color: '#8b5cf6' },
    { key: 'rm_3v3', name: '团队3v3', icon: 'users', color: '#8b5cf6' },
    { key: 'rm_4v4', name: '团队4v4', icon: 'users', color: '#8b5cf6' },
    { key: 'qm_1v1', name: '快速1v1', icon: 'bolt', color: '#f59e0b' },
    { key: 'qm_2v2', name: '快速2v2', icon: 'user-friends', color: '#10b981' },
    { key: 'qm_3v3', name: '快速3v3', icon: 'user-friends', color: '#10b981' },
    { key: 'qm_4v4', name: '快速4v4', icon: 'user-friends', color: '#10b981' },
  ];
  
  export const RM_RATING_OPTIONS = [
    { key: '', name: '全部', color: '#6b7280' },
    { key: '<699', name: '青铜', color: '#92400e' },
    { key: '700-999', name: '白银', color: '#6b7280' },
    { key: '1000-1199', name: '黄金', color: '#d97706' },
    { key: '1200-1399', name: '铂金', color: '#0891b2' },
    { key: '>1400', name: '钻石', color: '#7c3aed' },
    { key: '>1700', name: '征服者', color: '#dc2626' },
  ];
  
  export const QM_RATING_OPTIONS = [
    { key: '', name: '全部', color: '#6b7280' },
    { key: '<899', name: '青铜', color: '#92400e' },
    { key: '900-999', name: '白银', color: '#6b7280' },
    { key: '1000-1099', name: '黄金', color: '#d97706' },
    { key: '1100-1199', name: '铂金', color: '#0891b2' },
    { key: '1200-1299', name: '钻石', color: '#7c3aed' },
    { key: '>1300', name: '征服者', color: '#dc2626' },
  ];
  
  export const PERSONAL_MODE_OPTIONS = [
    { key: 'rm_solo', label: '1v1', description: '单人排位' },
    { key: 'rm_team', label: '团队', description: '多人排位' },
  ] as const;
  
  export type PersonalMode = (typeof PERSONAL_MODE_OPTIONS)[number]['key'];